import { useRef, useEffect, useCallback, useState } from 'react'
import { useStore } from '../store/useStore'
import type { Frame, Point } from '../store/useStore'
import { renderBrushStroke, getBrushCursor } from './BrushEngine'
import { exportAndDownloadGif, exportToGifSimple, downloadBlob, type ExportProgress } from './GifExporter'
import '../styles/animator.css'

type AnimatorTool = 'draw' | 'select'

interface Selection {
  x: number
  y: number
  width: number
  height: number
  imageData: ImageData | null
}

export default function AnimatorBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onionSkinCanvasRef = useRef<HTMLCanvasElement>(null)
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const frameIndexRef = useRef(0)

  // Tool state
  const [activeTool, setActiveTool] = useState<AnimatorTool>('draw')
  const [selection, setSelection] = useState<Selection | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [isDraggingSelection, setIsDraggingSelection] = useState(false)
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null)
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null)

  // Use refs to avoid render loops during playback
  const framesRef = useRef<Frame[]>([])
  const isPlayingRef = useRef(false)
  const isSavingRef = useRef(false)

  const {
    brushStyle,
    brushSize,
    brushColor,
    brushOpacity,
    isDrawing,
    setIsDrawing,
    frames,
    currentFrameIndex,
    setCurrentFrameIndex,
    addFrame,
    updateFrame,
    deleteFrame,
    duplicateFrame,
    onionSkinEnabled,
    setOnionSkinEnabled,
    onionSkinOpacity,
    setOnionSkinOpacity,
    isPlaying,
    setIsPlaying,
    fps,
    setFps,
    mode,
  } = useStore()

  const lastPointRef = useRef<Point | null>(null)
  const playbackRef = useRef<number | null>(null)

  // GIF export state
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null)

  // Keep refs in sync with state (avoids stale closures in callbacks)
  useEffect(() => {
    framesRef.current = frames
  }, [frames])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  // Load frame content to canvas - use ref to get latest frames to avoid dependency loops
  const loadFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d', { willReadFrequently: true })!
      // Use ref to get current frames to avoid stale closures
      const currentFrames = framesRef.current
      const frame = currentFrames[index]

      // Clear canvas
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw frame content if exists
      if (frame?.imageData) {
        // Scale if necessary
        if (frame.imageData.width !== canvas.width || frame.imageData.height !== canvas.height) {
          // Create temp canvas to scale
          const tempCanvas = document.createElement('canvas')
          tempCanvas.width = frame.imageData.width
          tempCanvas.height = frame.imageData.height
          tempCanvas.getContext('2d')!.putImageData(frame.imageData, 0, 0)
          ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height)
        } else {
          ctx.putImageData(frame.imageData, 0, 0)
        }
      }
    },
    [] // No dependencies - uses refs for mutable data
  )

  // Draw onion skin (previous frame ghosted) - uses refs to avoid circular dependencies
  const drawOnionSkin = useCallback(() => {
    const onionCanvas = onionSkinCanvasRef.current
    // Get current index from store directly to avoid stale closures
    const currentIndex = useStore.getState().currentFrameIndex
    if (!onionCanvas || currentIndex === 0) return

    const ctx = onionCanvas.getContext('2d', { willReadFrequently: true })!
    ctx.clearRect(0, 0, onionCanvas.width, onionCanvas.height)

    const currentFrames = framesRef.current
    const prevFrame = currentFrames[currentIndex - 1]
    const currentOpacity = useStore.getState().onionSkinOpacity

    if (prevFrame?.imageData) {
      ctx.globalAlpha = currentOpacity
      // Scale if necessary
      if (prevFrame.imageData.width !== onionCanvas.width || prevFrame.imageData.height !== onionCanvas.height) {
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = prevFrame.imageData.width
        tempCanvas.height = prevFrame.imageData.height
        tempCanvas.getContext('2d')!.putImageData(prevFrame.imageData, 0, 0)
        ctx.drawImage(tempCanvas, 0, 0, onionCanvas.width, onionCanvas.height)
      } else {
        ctx.putImageData(prevFrame.imageData, 0, 0)
      }
      ctx.globalAlpha = 1
    }
  }, []) // No dependencies - uses store.getState() for current values

  // Calculate canvas size based on container
  useEffect(() => {
    const updateCanvasSize = () => {
      const wrapper = wrapperRef.current
      if (!wrapper) return

      const rect = wrapper.getBoundingClientRect()
      // Use 4:3 aspect ratio, fit within container
      const maxWidth = rect.width - 32 // padding
      const maxHeight = rect.height - 32

      let width = maxWidth
      let height = (width * 3) / 4

      if (height > maxHeight) {
        height = maxHeight
        width = (height * 4) / 3
      }

      setCanvasSize({
        width: Math.floor(width),
        height: Math.floor(height)
      })
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  // Initialize canvases
  useEffect(() => {
    const canvas = canvasRef.current
    const onionCanvas = onionSkinCanvasRef.current
    const selCanvas = selectionCanvasRef.current
    if (!canvas || !onionCanvas) return

    canvas.width = canvasSize.width
    canvas.height = canvasSize.height
    onionCanvas.width = canvasSize.width
    onionCanvas.height = canvasSize.height
    if (selCanvas) {
      selCanvas.width = canvasSize.width
      selCanvas.height = canvasSize.height
    }

    // Load current frame (use store.getState to get current index)
    const currentIndex = useStore.getState().currentFrameIndex
    loadFrame(currentIndex)
  }, [canvasSize, loadFrame])

  // Update onion skin when frame changes or onion skin settings change
  useEffect(() => {
    if (onionSkinEnabled) {
      drawOnionSkin()
    }
  }, [currentFrameIndex, onionSkinEnabled, onionSkinOpacity, drawOnionSkin])

  // Save current canvas to frame - uses store.getState() to avoid render loops
  const saveCurrentFrame = useCallback(() => {
    // Prevent concurrent saves
    if (isSavingRef.current) return
    isSavingRef.current = true

    const canvas = canvasRef.current
    if (!canvas) {
      isSavingRef.current = false
      return
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // Use store.getState() to get current index without causing re-renders
    const currentIndex = useStore.getState().currentFrameIndex
    updateFrame(currentIndex, { imageData })

    // Allow next save after a microtask
    queueMicrotask(() => {
      isSavingRef.current = false
    })
  }, [updateFrame])

  // Frame navigation - avoids render loops by using refs
  const goToFrame = useCallback(
    (index: number) => {
      const currentFrames = framesRef.current
      if (index < 0 || index >= currentFrames.length) return

      // Save current frame first (non-blocking)
      saveCurrentFrame()

      // Update index and load new frame
      setCurrentFrameIndex(index)
      // Use requestAnimationFrame to ensure state has settled
      requestAnimationFrame(() => {
        loadFrame(index)
      })
    },
    [saveCurrentFrame, setCurrentFrameIndex, loadFrame]
  )

  // Add new frame (now duplicates current frame for easier animation)
  const handleAddFrame = useCallback(() => {
    saveCurrentFrame()
    // Duplicate the current frame so objects can be moved around
    const currentIndex = useStore.getState().currentFrameIndex
    duplicateFrame(currentIndex)
    // Move to the new frame
    const newIndex = framesRef.current.length // This will be the index after duplicate
    setCurrentFrameIndex(newIndex)
    requestAnimationFrame(() => {
      loadFrame(newIndex)
    })
  }, [saveCurrentFrame, duplicateFrame, setCurrentFrameIndex, loadFrame])

  // Add blank frame (for when you want a fresh canvas)
  const handleAddBlankFrame = useCallback(() => {
    saveCurrentFrame()
    const newFrame: Frame = {
      id: `frame-${Date.now()}`,
      imageData: null,
      duration: 1000 / fps,
    }
    addFrame(newFrame)
    const newIndex = framesRef.current.length
    setCurrentFrameIndex(newIndex)
    requestAnimationFrame(() => {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    })
  }, [saveCurrentFrame, addFrame, fps, setCurrentFrameIndex])

  // Duplicate current frame (explicit duplicate button)
  const handleDuplicateFrame = useCallback(() => {
    saveCurrentFrame()
    const currentIndex = useStore.getState().currentFrameIndex
    duplicateFrame(currentIndex)
  }, [saveCurrentFrame, duplicateFrame])

  // Delete current frame
  const handleDeleteFrame = useCallback(() => {
    const currentFrames = framesRef.current
    const currentIndex = useStore.getState().currentFrameIndex
    if (currentFrames.length <= 1) return

    deleteFrame(currentIndex)
    const newIndex = Math.min(currentIndex, currentFrames.length - 2)
    setCurrentFrameIndex(newIndex)
    requestAnimationFrame(() => loadFrame(newIndex))
  }, [deleteFrame, setCurrentFrameIndex, loadFrame])

  // Export to GIF
  const handleExportGif = useCallback(async () => {
    if (isExporting) return

    // Save current frame first
    saveCurrentFrame()

    // Wait for state to settle
    await new Promise(resolve => setTimeout(resolve, 100))

    const currentFrames = framesRef.current
    if (currentFrames.length === 0) {
      alert('No frames to export!')
      return
    }

    setIsExporting(true)
    setExportProgress({ phase: 'preparing', progress: 0, currentFrame: 0, totalFrames: currentFrames.length })

    try {
      // Extract imageData from frames
      const frameData = currentFrames.map(f => f.imageData)

      // Try gif.js first, fall back to simple encoder
      try {
        await exportAndDownloadGif(
          frameData,
          {
            fps: Math.min(fps, 12), // Cap at 12fps for GIF
            maxFrames: 24,
            quality: 10,
            watermark: true,
          },
          setExportProgress
        )
      } catch {
        // Fallback to simple encoder if gif.js workers fail
        console.log('Using fallback GIF encoder...')
        const blob = await exportToGifSimple(
          frameData,
          {
            fps: Math.min(fps, 12),
            maxFrames: 24,
            quality: 10,
            watermark: true,
          },
          setExportProgress
        )
        const timestamp = new Date().toISOString().slice(0, 10)
        downloadBlob(blob, `opus-prime-animation-${timestamp}.gif`)
      }
    } catch (error) {
      console.error('GIF export failed:', error)
      alert('Failed to export GIF. Please try again.')
    } finally {
      setIsExporting(false)
      setExportProgress(null)
    }
  }, [isExporting, saveCurrentFrame, fps])

  // Listen for export event from toolbar
  useEffect(() => {
    const handleExportEvent = () => {
      handleExportGif()
    }

    window.addEventListener('crayon-export-gif', handleExportEvent)
    return () => window.removeEventListener('crayon-export-gif', handleExportEvent)
  }, [handleExportGif])

  // Playback - simplified to avoid render loops
  useEffect(() => {
    if (!isPlaying) {
      if (playbackRef.current) {
        clearInterval(playbackRef.current)
        playbackRef.current = null
      }
      return
    }

    // Save current frame before starting playback (non-blocking)
    saveCurrentFrame()
    // Get current index from store to initialize playback position
    frameIndexRef.current = useStore.getState().currentFrameIndex

    // Use refs inside interval to avoid stale closures
    playbackRef.current = window.setInterval(() => {
      const currentFrames = framesRef.current
      if (currentFrames.length === 0) return

      frameIndexRef.current = (frameIndexRef.current + 1) % currentFrames.length
      setCurrentFrameIndex(frameIndexRef.current)
      loadFrame(frameIndexRef.current)
    }, 1000 / fps)

    return () => {
      if (playbackRef.current) {
        clearInterval(playbackRef.current)
        playbackRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Only re-run when isPlaying or fps changes
  }, [isPlaying, fps])

  // Drawing handlers
  const getPointerInfo = useCallback((e: PointerEvent | React.PointerEvent): Point => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pressure: e.pressure || 0.5,
    }
  }, [])

  // Draw selection rectangle on overlay canvas
  const drawSelectionRect = useCallback((x: number, y: number, w: number, h: number) => {
    const selCanvas = selectionCanvasRef.current
    if (!selCanvas) return

    const ctx = selCanvas.getContext('2d')!
    ctx.clearRect(0, 0, selCanvas.width, selCanvas.height)

    if (w === 0 || h === 0) return

    // Marching ants effect
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.strokeRect(x, y, w, h)

    ctx.strokeStyle = '#fff'
    ctx.lineDashOffset = 5
    ctx.strokeRect(x, y, w, h)
    ctx.setLineDash([])
  }, [])

  // Clear selection overlay
  const clearSelectionOverlay = useCallback(() => {
    const selCanvas = selectionCanvasRef.current
    if (!selCanvas) return
    const ctx = selCanvas.getContext('2d')!
    ctx.clearRect(0, 0, selCanvas.width, selCanvas.height)
  }, [])

  // Copy selection to clipboard (internal)
  const copySelection = useCallback(() => {
    if (!selection) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    const imageData = ctx.getImageData(selection.x, selection.y, selection.width, selection.height)

    setSelection(prev => prev ? { ...prev, imageData } : null)
  }, [selection])

  // Paste selection at new position
  const pasteSelection = useCallback((x: number, y: number) => {
    if (!selection?.imageData) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    ctx.putImageData(selection.imageData, x, y)
    saveCurrentFrame()
  }, [selection, saveCurrentFrame])

  // Clear selection area on main canvas (cut)
  const clearSelectionArea = useCallback(() => {
    if (!selection) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(selection.x, selection.y, selection.width, selection.height)
  }, [selection])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (mode !== 'animate' || isPlaying) return

      e.currentTarget.setPointerCapture(e.pointerId)
      const point = getPointerInfo(e)

      if (activeTool === 'select') {
        // Check if clicking inside existing selection to drag
        if (selection &&
            point.x >= selection.x && point.x <= selection.x + selection.width &&
            point.y >= selection.y && point.y <= selection.y + selection.height) {
          setIsDraggingSelection(true)
          dragOffsetRef.current = {
            x: point.x - selection.x,
            y: point.y - selection.y
          }
          // Copy the selection area if not already copied
          if (!selection.imageData) {
            copySelection()
          }
          // Clear the original area
          clearSelectionArea()
        } else {
          // Start new selection
          setIsSelecting(true)
          setSelection(null)
          selectionStartRef.current = { x: point.x, y: point.y }
          clearSelectionOverlay()
        }
      } else {
        // Drawing mode
        setIsDrawing(true)
        lastPointRef.current = point

        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d', { willReadFrequently: true })!
          renderBrushStroke(ctx, [point], {
            style: brushStyle,
            size: brushSize,
            color: brushColor,
            opacity: brushOpacity,
          })
        }
      }
    },
    [mode, isPlaying, getPointerInfo, activeTool, selection, copySelection, clearSelectionArea, clearSelectionOverlay, setIsDrawing, brushStyle, brushSize, brushColor, brushOpacity]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (mode !== 'animate') return

      const point = getPointerInfo(e)

      if (activeTool === 'select') {
        if (isDraggingSelection && selection && dragOffsetRef.current) {
          // Move selection
          const newX = point.x - dragOffsetRef.current.x
          const newY = point.y - dragOffsetRef.current.y
          setSelection(prev => prev ? { ...prev, x: newX, y: newY } : null)
          drawSelectionRect(newX, newY, selection.width, selection.height)
        } else if (isSelecting && selectionStartRef.current) {
          // Draw selection rectangle
          const x = Math.min(selectionStartRef.current.x, point.x)
          const y = Math.min(selectionStartRef.current.y, point.y)
          const w = Math.abs(point.x - selectionStartRef.current.x)
          const h = Math.abs(point.y - selectionStartRef.current.y)
          drawSelectionRect(x, y, w, h)
        }
      } else {
        // Drawing mode
        if (!isDrawing) return

        const canvas = canvasRef.current
        if (canvas && lastPointRef.current) {
          const ctx = canvas.getContext('2d', { willReadFrequently: true })!
          renderBrushStroke(ctx, [lastPointRef.current, point], {
            style: brushStyle,
            size: brushSize,
            color: brushColor,
            opacity: brushOpacity,
          })
        }
        lastPointRef.current = point
      }
    },
    [mode, activeTool, isDraggingSelection, selection, isSelecting, isDrawing, getPointerInfo, drawSelectionRect, brushStyle, brushSize, brushColor, brushOpacity]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.releasePointerCapture(e.pointerId)

      if (activeTool === 'select') {
        if (isDraggingSelection && selection?.imageData) {
          // Paste at new position
          pasteSelection(selection.x, selection.y)
          setIsDraggingSelection(false)
          dragOffsetRef.current = null
        } else if (isSelecting && selectionStartRef.current) {
          // Finalize selection
          const point = getPointerInfo(e)
          const x = Math.min(selectionStartRef.current.x, point.x)
          const y = Math.min(selectionStartRef.current.y, point.y)
          const w = Math.abs(point.x - selectionStartRef.current.x)
          const h = Math.abs(point.y - selectionStartRef.current.y)

          if (w > 5 && h > 5) {
            // Copy the selected area
            const canvas = canvasRef.current
            if (canvas) {
              const ctx = canvas.getContext('2d', { willReadFrequently: true })!
              const imageData = ctx.getImageData(x, y, w, h)
              setSelection({ x, y, width: w, height: h, imageData })
            }
          } else {
            setSelection(null)
            clearSelectionOverlay()
          }

          setIsSelecting(false)
          selectionStartRef.current = null
        }
      } else {
        // Drawing mode
        if (!isDrawing) return
        setIsDrawing(false)
        lastPointRef.current = null
        saveCurrentFrame()
      }
    },
    [activeTool, isDraggingSelection, selection, isSelecting, isDrawing, getPointerInfo, pasteSelection, clearSelectionOverlay, setIsDrawing, saveCurrentFrame]
  )

  // Deselect when pressing Escape
  const handleDeselect = useCallback(() => {
    setSelection(null)
    clearSelectionOverlay()
  }, [clearSelectionOverlay])

  // Copy selection to next frame
  const copyToNextFrame = useCallback(() => {
    if (!selection?.imageData) return

    // Save current frame
    saveCurrentFrame()

    // Add new frame (duplicate current)
    handleAddFrame()

    // After state update, paste the selection
    setTimeout(() => {
      const canvas = canvasRef.current
      if (canvas && selection.imageData) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!
        ctx.putImageData(selection.imageData, selection.x, selection.y)
        saveCurrentFrame()
      }
    }, 50)
  }, [selection, saveCurrentFrame, handleAddFrame])

  // Cursor
  const cursorStyle = activeTool === 'select'
    ? (isDraggingSelection ? 'grabbing' : (selection ? 'grab' : 'crosshair'))
    : getBrushCursor({
        style: brushStyle,
        size: brushSize,
        color: brushColor,
        opacity: brushOpacity,
      })

  // Keyboard shortcuts - use refs to avoid stale closures
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== 'animate') return

      const currentIndex = useStore.getState().currentFrameIndex
      const playing = isPlayingRef.current

      if (e.key === 'ArrowLeft') {
        goToFrame(currentIndex - 1)
      } else if (e.key === 'ArrowRight') {
        goToFrame(currentIndex + 1)
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying(!playing)
      } else if (e.key === 'Escape') {
        handleDeselect()
      } else if (e.key === 'v' || e.key === 'V') {
        setActiveTool('select')
      } else if (e.key === 'b' || e.key === 'B') {
        setActiveTool('draw')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode, goToFrame, setIsPlaying, handleDeselect])

  if (mode !== 'animate') return null

  return (
    <div className="animator-container">
      <div className="animator-canvas-wrapper" ref={wrapperRef}>
        <div
          className="animator-canvas-frame"
          style={{ width: canvasSize.width, height: canvasSize.height }}
        >
          {/* Onion skin layer */}
          {onionSkinEnabled && (
            <canvas
              ref={onionSkinCanvasRef}
              className="onion-skin-canvas"
              width={canvasSize.width}
              height={canvasSize.height}
              style={{ opacity: onionSkinOpacity }}
            />
          )}

          {/* Main drawing canvas */}
          <canvas
            ref={canvasRef}
            className="animator-canvas"
            width={canvasSize.width}
            height={canvasSize.height}
            style={{ cursor: isPlaying ? 'default' : cursorStyle }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />

          {/* Selection overlay canvas */}
          <canvas
            ref={selectionCanvasRef}
            className="selection-canvas"
            width={canvasSize.width}
            height={canvasSize.height}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="animator-timeline">
        <div className="timeline-controls">
          {/* Tool selector */}
          <div className="tool-selector">
            <button
              className={`tool-btn ${activeTool === 'draw' ? 'active' : ''}`}
              onClick={() => setActiveTool('draw')}
              title="Draw Tool (B)"
            >
              ✏️
            </button>
            <button
              className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`}
              onClick={() => setActiveTool('select')}
              title="Select Tool (V)"
            >
              ⬚
            </button>
          </div>

          {/* Copy to next frame button - only show when there's a selection */}
          {selection?.imageData && (
            <button
              className="copy-to-next-btn"
              onClick={copyToNextFrame}
              title="Copy selection to next frame"
            >
              📋→
            </button>
          )}

          {/* Frame navigation controls - mobile friendly */}
          <div className="frame-nav-controls">
            <button
              className="frame-nav-btn"
              onClick={() => goToFrame(currentFrameIndex - 1)}
              disabled={currentFrameIndex === 0 || isPlaying}
              title="Previous Frame (←)"
            >
              ◀
            </button>
            <button
              className={`play-btn ${isPlaying ? 'playing' : ''}`}
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button
              className="frame-nav-btn"
              onClick={() => goToFrame(currentFrameIndex + 1)}
              disabled={currentFrameIndex >= frames.length - 1 || isPlaying}
              title="Next Frame (→)"
            >
              ▶
            </button>
            <button
              className="frame-nav-btn add-frame"
              onClick={handleAddFrame}
              disabled={isPlaying}
              title="Add Frame (+)"
            >
              +
            </button>
          </div>

          <div className="fps-control">
            <label>FPS:</label>
            <input
              type="number"
              min="1"
              max="60"
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
            />
          </div>

          <div className="onion-control">
            <label>
              <input
                type="checkbox"
                checked={onionSkinEnabled}
                onChange={(e) => setOnionSkinEnabled(e.target.checked)}
              />
              Onion Skin
            </label>
            {onionSkinEnabled && (
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.1"
                value={onionSkinOpacity}
                onChange={(e) => setOnionSkinOpacity(Number(e.target.value))}
              />
            )}
          </div>
        </div>

        <div className="frames-strip">
          {frames.map((frame, index) => (
            <div
              key={frame.id}
              className={`frame-thumb ${index === currentFrameIndex ? 'active' : ''}`}
              onClick={() => goToFrame(index)}
            >
              <span className="frame-number">{index + 1}</span>
              {frame.imageData && (
                <FrameThumbnail imageData={frame.imageData} width={60} height={45} />
              )}
            </div>
          ))}

          <button className="add-frame-btn" onClick={handleAddFrame} title="Duplicate Frame (+)">
            +
          </button>
          <button className="add-frame-btn blank-frame-btn" onClick={handleAddBlankFrame} title="Add Blank Frame">
            ☐
          </button>
        </div>

        <div className="frame-actions">
          <button onClick={handleDuplicateFrame} title="Duplicate Frame">
            📋
          </button>
          <button
            onClick={handleDeleteFrame}
            disabled={frames.length <= 1}
            title="Delete Frame"
          >
            🗑️
          </button>
          <button
            onClick={handleExportGif}
            disabled={isExporting || frames.length === 0}
            title="Export to GIF"
            className="export-gif-btn"
          >
            {isExporting ? '⏳' : '🎬'}
          </button>
          <span className="frame-counter">
            Frame {currentFrameIndex + 1} / {frames.length}
          </span>
        </div>

        {/* Export progress overlay */}
        {isExporting && exportProgress && (
          <div className="export-progress-overlay">
            <div className="export-progress-content">
              <div className="export-progress-title">
                {exportProgress.phase === 'preparing' && '📦 Preparing frames...'}
                {exportProgress.phase === 'encoding' && '🎬 Encoding GIF...'}
                {exportProgress.phase === 'finishing' && '✨ Finishing up...'}
              </div>
              <div className="export-progress-bar">
                <div
                  className="export-progress-fill"
                  style={{ width: `${exportProgress.progress}%` }}
                />
              </div>
              <div className="export-progress-text">
                {exportProgress.currentFrame} / {exportProgress.totalFrames} frames
                ({exportProgress.progress}%)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper component for frame thumbnails
function FrameThumbnail({
  imageData,
  width,
  height,
}: {
  imageData: ImageData
  width: number
  height: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = imageData.width
    tempCanvas.height = imageData.height
    tempCanvas.getContext('2d')!.putImageData(imageData, 0, 0)

    ctx.drawImage(tempCanvas, 0, 0, width, height)
  }, [imageData, width, height])

  return <canvas ref={canvasRef} width={width} height={height} className="frame-preview" />
}
