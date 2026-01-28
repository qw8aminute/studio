import { useEffect, useCallback } from 'react'
import { useStore } from './store/useStore'
import CanvasBoard from './components/CanvasBoard'
import Toolbar from './components/Toolbar'
import AnimatorBoard from './components/AnimatorBoard'
import SpeechBubblePalette from './components/SpeechBubblePalette'
import BubbleEditor from './components/BubbleEditor'
import Wiggler from './components/Wiggler'
import { downloadWithWatermark, renderBubblesToCanvas } from './components/SaveWithWatermark'
import './styles/app.css'

function App() {
  const { mode, wigglerActive, setWigglerActive, bubbles, bubbleToolActive, undo, redo, isDarkMode, themeMode, setIsDarkMode, includeWatermark } = useStore()

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (themeMode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode, setIsDarkMode])

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          const imageData = redo()
          if (imageData) {
            const canvas = document.querySelector('.canvas-board') as HTMLCanvasElement
            if (canvas) {
              const ctx = canvas.getContext('2d')!
              ctx.putImageData(imageData, 0, 0)
            }
          }
        } else {
          const imageData = undo()
          if (imageData) {
            const canvas = document.querySelector('.canvas-board') as HTMLCanvasElement
            if (canvas) {
              const ctx = canvas.getContext('2d')!
              ctx.putImageData(imageData, 0, 0)
            }
          }
        }
      }

      // Redo with Ctrl+Y
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        const imageData = redo()
        if (imageData) {
          const canvas = document.querySelector('.canvas-board') as HTMLCanvasElement
          if (canvas) {
            const ctx = canvas.getContext('2d')!
            ctx.putImageData(imageData, 0, 0)
          }
        }
      }

      // Save with Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  // Handle save
  const handleSave = useCallback(async () => {
    const canvas = document.querySelector('.canvas-board, .animator-canvas') as HTMLCanvasElement
    if (!canvas) return

    // If there are bubbles, render them to the canvas
    if (bubbles.length > 0) {
      renderBubblesToCanvas(canvas, bubbles)
    }

    await downloadWithWatermark({
      canvas,
      filename: `crayon-${Date.now()}`,
      format: 'png',
      includeWatermark: includeWatermark,
      watermarkPosition: 'bottom-right',
      watermarkSize: 50,
      watermarkOpacity: 0.8,
    })
  }, [bubbles, includeWatermark])

  // Listen for save event from toolbar
  useEffect(() => {
    const handleSaveEvent = () => handleSave()
    window.addEventListener('crayon-save', handleSaveEvent)
    return () => window.removeEventListener('crayon-save', handleSaveEvent)
  }, [handleSave])

  // GIF export is now handled directly by AnimatorBoard

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      <Toolbar />

      <div className="canvas-container">
        {/* Main drawing canvas (visible in draw mode) */}
        {mode === 'draw' && <CanvasBoard />}

        {/* Animator board */}
        {mode === 'animate' && <AnimatorBoard />}

        {/* Speech bubbles layer - shown when bubble tool is active */}
        {bubbleToolActive && (
          <>
            <SpeechBubblePalette />
            <BubbleEditor />
          </>
        )}
      </div>

      {/* Wiggler break mode */}
      {wigglerActive && <Wiggler onExit={() => setWigglerActive(false)} />}
    </div>
  )
}

export default App
