import { useCallback, useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import type { BrushStyle, AppMode, ThemeMode } from '../store/useStore'
import '../styles/toolbar.css'

const BRUSH_STYLES: { id: BrushStyle; label: string; icon: string }[] = [
  { id: 'smooth', label: 'Smooth', icon: '✏️' },
  { id: 'rough', label: 'Rough', icon: '🖍️' },
  { id: 'chalky', label: 'Chalky', icon: '🖌️' },
  { id: 'neon', label: 'Neon', icon: '💡' },
  { id: 'marker', label: 'Marker', icon: '🖊️' },
  { id: 'spray', label: 'Spray', icon: '🎨' },
  { id: 'eraser', label: 'Eraser', icon: '🧽' },
]

const PRESET_COLORS = [
  '#2d2d2d', // Near black
  '#e74c3c', // Red
  '#e67e22', // Orange
  '#f1c40f', // Yellow
  '#2ecc71', // Green
  '#3498db', // Blue
  '#9b59b6', // Purple
  '#e91e63', // Pink
  '#00bcd4', // Cyan
  '#795548', // Brown
  '#607d8b', // Gray
  '#f0f0ff', // Neon white (for dark mode)
]

const APP_MODES: { id: AppMode; label: string; icon: string }[] = [
  { id: 'draw', label: 'Draw', icon: '🎨' },
  { id: 'animate', label: 'Animate', icon: '🎬' },
]

export default function Toolbar() {
  const {
    mode,
    setMode,
    brushStyle,
    setBrushStyle,
    brushSize,
    setBrushSize,
    brushColor,
    setBrushColor,
    brushOpacity,
    setBrushOpacity,
    canUndo,
    canRedo,
    undo,
    redo,
    bubbleToolActive,
    setBubbleToolActive,
    isDarkMode,
    themeMode,
    setThemeMode,
    setWigglerActive,
    includeWatermark,
    setIncludeWatermark,
  } = useStore()

  // Mobile collapsed states
  const [showBrushPanel, setShowBrushPanel] = useState(false)
  const [showColorPanel, setShowColorPanel] = useState(false)
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false)

  const colorPickerRef = useRef<HTMLInputElement>(null)
  const brushPanelRef = useRef<HTMLDivElement>(null)
  const colorPanelRef = useRef<HTMLDivElement>(null)

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (brushPanelRef.current && !brushPanelRef.current.contains(target)) {
        setShowBrushPanel(false)
      }
      if (colorPanelRef.current && !colorPanelRef.current.contains(target)) {
        setShowColorPanel(false)
        setShowCustomColorPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleUndo = useCallback(() => {
    const imageData = undo()
    if (imageData) {
      const canvas = document.querySelector('.canvas-board, .animator-canvas') as HTMLCanvasElement
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!
        ctx.putImageData(imageData, 0, 0)
      }
    }
  }, [undo])

  const handleRedo = useCallback(() => {
    const imageData = redo()
    if (imageData) {
      const canvas = document.querySelector('.canvas-board, .animator-canvas') as HTMLCanvasElement
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!
        ctx.putImageData(imageData, 0, 0)
      }
    }
  }, [redo])

  const handleClear = useCallback(() => {
    const canvas = document.querySelector('.canvas-board, .animator-canvas') as HTMLCanvasElement
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!
      ctx.fillStyle = isDarkMode ? '#0a0a0a' : '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      useStore.getState().pushHistory(imageData)
    }
  }, [isDarkMode])

  const handleSave = useCallback(() => {
    const event = new CustomEvent('crayon-save')
    window.dispatchEvent(event)
  }, [])

  const handleExportGif = useCallback(() => {
    const event = new CustomEvent('crayon-export-gif')
    window.dispatchEvent(event)
  }, [])

  const handleCustomColorClick = useCallback(() => {
    setShowCustomColorPicker(true)
    // Small delay to ensure input is rendered
    setTimeout(() => {
      colorPickerRef.current?.click()
    }, 50)
  }, [])

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushColor(e.target.value)
  }, [setBrushColor])

  // Cycle through theme modes: system -> light -> dark -> system
  const handleThemeToggle = useCallback(() => {
    const modes: ThemeMode[] = ['system', 'light', 'dark']
    const currentIndex = modes.indexOf(themeMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setThemeMode(modes[nextIndex])
  }, [themeMode, setThemeMode])

  const handleWiggleBreak = useCallback(() => {
    setWigglerActive(true)
  }, [setWigglerActive])

  const handleWatermarkToggle = useCallback(() => {
    setIncludeWatermark(!includeWatermark)
  }, [includeWatermark, setIncludeWatermark])

  // Get theme icon based on current mode
  const getThemeIcon = () => {
    if (themeMode === 'system') return '🌓'
    if (themeMode === 'dark') return '🌙'
    return '☀️'
  }

  const getThemeLabel = () => {
    if (themeMode === 'system') return 'System'
    if (themeMode === 'dark') return 'Dark'
    return 'Light'
  }

  return (
    <div className="toolbar">
      {/* Mode selector - always visible */}
      <div className="toolbar-section mode-selector">
        {APP_MODES.map((m) => (
          <button
            key={m.id}
            className={`mode-btn ${mode === m.id ? 'active' : ''}`}
            onClick={() => setMode(m.id)}
            title={m.label}
          >
            <span className="mode-icon">{m.icon}</span>
            <span className="mode-label">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Drawing tools - show in draw and animate modes */}
      {(mode === 'draw' || mode === 'animate') && (
        <>
          {/* Brush selector (collapsed on mobile) */}
          <div className="toolbar-section brush-section" ref={brushPanelRef}>
            <button
              className="tool-toggle brush-toggle"
              onClick={() => setShowBrushPanel(!showBrushPanel)}
              title="Brush settings"
            >
              <span className="current-brush-icon">
                {BRUSH_STYLES.find((s) => s.id === brushStyle)?.icon || '✏️'}
              </span>
              <span className="brush-size-indicator">{brushSize}</span>
            </button>

            {showBrushPanel && (
              <div className="tool-panel brush-panel">
                <div className="panel-header">Brush</div>

                <div className="brush-grid">
                  {BRUSH_STYLES.map((style) => (
                    <button
                      key={style.id}
                      className={`brush-btn ${brushStyle === style.id ? 'active' : ''}`}
                      onClick={() => {
                        setBrushStyle(style.id)
                      }}
                      title={style.label}
                    >
                      <span className="brush-icon">{style.icon}</span>
                      <span className="brush-name">{style.label}</span>
                    </button>
                  ))}
                </div>

                <div className="slider-group">
                  <label className="slider-label">
                    Size <span className="slider-value">{brushSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="slider"
                  />
                </div>

                <div className="slider-group">
                  <label className="slider-label">
                    Opacity <span className="slider-value">{Math.round(brushOpacity * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={brushOpacity}
                    onChange={(e) => setBrushOpacity(Number(e.target.value))}
                    className="slider"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Color selector (collapsed on mobile) */}
          <div className="toolbar-section color-section" ref={colorPanelRef}>
            <button
              className="tool-toggle color-toggle"
              onClick={() => setShowColorPanel(!showColorPanel)}
              title="Color picker"
              style={{ backgroundColor: brushColor }}
            >
              <span className="color-swatch" style={{ backgroundColor: brushColor }} />
            </button>

            {showColorPanel && (
              <div className="tool-panel color-panel">
                <div className="panel-header">Color</div>

                <div className="color-grid">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${brushColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setBrushColor(color)}
                      title={color}
                    />
                  ))}
                  <button
                    className="color-btn color-picker-btn"
                    onClick={handleCustomColorClick}
                    title="Custom color"
                  >
                    <span className="plus-icon">+</span>
                  </button>
                </div>

                {/* Hidden native color picker */}
                <input
                  ref={colorPickerRef}
                  type="color"
                  value={brushColor}
                  onChange={handleColorChange}
                  className="hidden-color-input"
                />

                {showCustomColorPicker && (
                  <div className="custom-color-preview">
                    <span>Selected:</span>
                    <span
                      className="preview-swatch"
                      style={{ backgroundColor: brushColor }}
                    />
                    <span className="color-hex">{brushColor}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Speech bubble tool toggle */}
          <button
            className={`tool-toggle bubble-toggle ${bubbleToolActive ? 'active' : ''}`}
            onClick={() => setBubbleToolActive(!bubbleToolActive)}
            title={bubbleToolActive ? 'Exit bubble mode' : 'Add speech bubbles'}
          >
            💬
          </button>
        </>
      )}

      {/* Wiggle break button */}
      <button
        className="tool-toggle wiggle-btn"
        onClick={handleWiggleBreak}
        title="Need a wiggle break?"
      >
        🐛
      </button>

      <div className="toolbar-spacer" />

      {/* Theme toggle */}
      <button
        className="tool-toggle theme-toggle"
        onClick={handleThemeToggle}
        title={`Theme: ${getThemeLabel()} (click to cycle)`}
      >
        <span className="theme-icon">{getThemeIcon()}</span>
      </button>

      {/* Watermark toggle */}
      <label className="watermark-toggle" title="Include watermark on export">
        <input
          type="checkbox"
          checked={includeWatermark}
          onChange={handleWatermarkToggle}
        />
        <span className="watermark-label">QS</span>
      </label>

      {/* Actions - always visible */}
      <div className="toolbar-section actions">
        <button
          className="action-btn"
          onClick={handleUndo}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
        >
          ↩️
        </button>
        <button
          className="action-btn"
          onClick={handleRedo}
          disabled={!canRedo()}
          title="Redo (Ctrl+Y)"
        >
          ↪️
        </button>
        <button className="action-btn" onClick={handleClear} title="Clear canvas">
          🗑️
        </button>
        <button className="action-btn save-btn" onClick={handleSave} title="Save with watermark">
          💾
        </button>
        {mode === 'animate' && (
          <button className="action-btn" onClick={handleExportGif} title="Export GIF">
            📹
          </button>
        )}
      </div>
    </div>
  )
}
