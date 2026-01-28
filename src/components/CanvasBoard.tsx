import { useRef, useEffect, useCallback, useState } from 'react'
import { useStore } from '../store/useStore'
import type { Point } from '../store/useStore'
import { renderBrushStroke, getBrushCursor } from './BrushEngine'

interface CanvasBoardProps {
  width?: number
  height?: number
}

interface Transform {
  scale: number
  offsetX: number
  offsetY: number
}

// Constants for infinite canvas behavior
const MIN_ZOOM = 0.1
const MAX_ZOOM = 20
const DEFAULT_ZOOM = 4.2  // 420% default for that big canvas feel
const ZOOM_SENSITIVITY = 0.002
const PINCH_SENSITIVITY = 0.008

export default function CanvasBoard({ width, height }: CanvasBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const bufferCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [dimensions, setDimensions] = useState({ width: width || 2000, height: height || 2000 })

  // Zoom/pan state - using refs for smooth animation
  const [transform, setTransform] = useState<Transform>({ scale: 1, offsetX: 0, offsetY: 0 })
  const transformRef = useRef<Transform>({ scale: 1, offsetX: 0, offsetY: 0 })
  const targetTransformRef = useRef<Transform>({ scale: 1, offsetX: 0, offsetY: 0 })
  const animationFrameRef = useRef<number | null>(null)
  const lastPinchDistRef = useRef<number | null>(null)
  const lastPanPointRef = useRef<{ x: number; y: number } | null>(null)
  const isPanningRef = useRef(false)
  const activeTouchesRef = useRef<Map<number, Touch>>(new Map())
  const isSpaceDownRef = useRef(false)
  // Store canvas state before touch drawing starts, to restore on pinch detection
  const preTouchImageDataRef = useRef<ImageData | null>(null)

  const {
    brushStyle,
    brushSize,
    brushColor,
    brushOpacity,
    isDrawing,
    setIsDrawing,
    currentPath,
    addToPath,
    clearPath,
    pushHistory,
    mode,
    isDarkMode,
  } = useStore()

  const lastPointRef = useRef<Point | null>(null)

  // Smooth animation loop for transform changes
  const animateTransform = useCallback(() => {
    const current = transformRef.current
    const target = targetTransformRef.current

    // Lerp factor for smooth interpolation
    const lerpFactor = 0.25

    const newScale = current.scale + (target.scale - current.scale) * lerpFactor
    const newOffsetX = current.offsetX + (target.offsetX - current.offsetX) * lerpFactor
    const newOffsetY = current.offsetY + (target.offsetY - current.offsetY) * lerpFactor

    // Check if we're close enough to stop animating
    const scaleDiff = Math.abs(target.scale - newScale)
    const offsetXDiff = Math.abs(target.offsetX - newOffsetX)
    const offsetYDiff = Math.abs(target.offsetY - newOffsetY)

    if (scaleDiff < 0.001 && offsetXDiff < 0.5 && offsetYDiff < 0.5) {
      transformRef.current = target
      setTransform(target)
      animationFrameRef.current = null
      return
    }

    transformRef.current = { scale: newScale, offsetX: newOffsetX, offsetY: newOffsetY }
    setTransform(transformRef.current)

    animationFrameRef.current = requestAnimationFrame(animateTransform)
  }, [])

  // Update transform with optional animation
  const updateTransform = useCallback((newTransform: Transform, animate = true) => {
    targetTransformRef.current = newTransform

    if (!animate) {
      transformRef.current = newTransform
      setTransform(newTransform)
      return
    }

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animateTransform)
    }
  }, [animateTransform])

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Initialize canvas and buffer
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Use larger internal resolution for "infinite" canvas feel
    // For mobile crispness, we use a larger base canvas (higher resolution)
    const w = width || 2000
    const h = height || 2000

    canvas.width = w
    canvas.height = h

    setDimensions({ width: w, height: h })

    // Create buffer canvas for double buffering
    if (!bufferCanvasRef.current) {
      bufferCanvasRef.current = document.createElement('canvas')
    }
    bufferCanvasRef.current.width = w
    bufferCanvasRef.current.height = h

    // Fill with background color based on theme
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    // Disable smoothing for crisp brush strokes
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = isDarkMode ? '#0a0a0a' : '#ffffff'
    ctx.fillRect(0, 0, w, h)

    // Save initial state to history
    const imageData = ctx.getImageData(0, 0, w, h)
    pushHistory(imageData)

    // Center the canvas at 420% zoom for infinite canvas feel
    const containerRect = container.getBoundingClientRect()
    const initialScale = DEFAULT_ZOOM

    // Center the view on the middle of the canvas
    const initialTransform = {
      scale: initialScale,
      offsetX: (containerRect.width - w * initialScale) / 2,
      offsetY: (containerRect.height - h * initialScale) / 2,
    }

    transformRef.current = initialTransform
    targetTransformRef.current = initialTransform
    setTransform(initialTransform)
  }, [width, height, pushHistory, isDarkMode])

  // Get canvas coordinates from screen coordinates
  const screenToCanvas = useCallback((screenX: number, screenY: number): { x: number; y: number } => {
    const container = containerRef.current
    if (!container) return { x: 0, y: 0 }

    const rect = container.getBoundingClientRect()
    const canvasX = (screenX - rect.left - transform.offsetX) / transform.scale
    const canvasY = (screenY - rect.top - transform.offsetY) / transform.scale

    return { x: canvasX, y: canvasY }
  }, [transform])

  // Get pointer position with pressure support
  const getPointerInfo = useCallback((e: PointerEvent | React.PointerEvent): Point => {
    const { x, y } = screenToCanvas(e.clientX, e.clientY)
    return {
      x,
      y,
      pressure: e.pressure || 0.5,
    }
  }, [screenToCanvas])

  // Handle zoom with pinch gesture
  const handlePinchZoom = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 2) return

    const touch1 = e.touches[0]
    const touch2 = e.touches[1]

    const currentDist = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    )

    if (lastPinchDistRef.current !== null) {
      const delta = currentDist - lastPinchDistRef.current
      const zoomFactor = 1 + delta * PINCH_SENSITIVITY

      // Calculate center point between fingers
      const centerX = (touch1.clientX + touch2.clientX) / 2
      const centerY = (touch1.clientY + touch2.clientY) / 2

      const prev = targetTransformRef.current
      const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.scale * zoomFactor))

      // Zoom toward the center point
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const mouseX = centerX - rect.left
      const mouseY = centerY - rect.top

      const scaleChange = newScale / prev.scale
      const newOffsetX = mouseX - (mouseX - prev.offsetX) * scaleChange
      const newOffsetY = mouseY - (mouseY - prev.offsetY) * scaleChange

      // Use immediate update for pinch (no animation lag)
      updateTransform({
        scale: newScale,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      }, false)
    }

    lastPinchDistRef.current = currentDist
  }, [updateTransform])

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Check if it's a pan gesture (shift + wheel or trackpad pan)
    if (e.shiftKey || (e.deltaX !== 0 && Math.abs(e.deltaX) > Math.abs(e.deltaY))) {
      // Pan mode
      const prev = targetTransformRef.current
      updateTransform({
        scale: prev.scale,
        offsetX: prev.offsetX - e.deltaX,
        offsetY: prev.offsetY - e.deltaY,
      }, false)
      return
    }

    // Normalize scroll delta for different input devices
    let delta = -e.deltaY
    if (e.deltaMode === 1) { // Line mode (Firefox)
      delta *= 16
    }
    delta *= ZOOM_SENSITIVITY

    const zoomFactor = Math.exp(delta)
    const prev = targetTransformRef.current
    const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.scale * zoomFactor))

    // Zoom toward mouse position
    const scaleChange = newScale / prev.scale
    const newOffsetX = mouseX - (mouseX - prev.offsetX) * scaleChange
    const newOffsetY = mouseY - (mouseY - prev.offsetY) * scaleChange

    updateTransform({
      scale: newScale,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
    })
  }, [updateTransform])

  // Space bar for pan mode (like Figma)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        isSpaceDownRef.current = true
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpaceDownRef.current = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Start drawing
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only draw in draw mode
      if (mode !== 'draw') return

      // Check for multi-touch (panning/pinch zoom)
      if (e.pointerType === 'touch') {
        activeTouchesRef.current.set(e.pointerId, e.nativeEvent as unknown as Touch)

        // If we now have 2 touches, switch to pinch/pan mode and cancel any drawing
        if (activeTouchesRef.current.size >= 2) {
          isPanningRef.current = true
          // Cancel any ongoing drawing and restore canvas to pre-touch state
          if (isDrawing) {
            setIsDrawing(false)
            clearPath()
            lastPointRef.current = null
            // Restore canvas to state before the touch started
            const canvas = canvasRef.current
            if (canvas && preTouchImageDataRef.current) {
              const ctx = canvas.getContext('2d', { willReadFrequently: true })!
              ctx.putImageData(preTouchImageDataRef.current, 0, 0)
              preTouchImageDataRef.current = null
            }
          }
          return
        }
      }

      // Middle mouse button or space + left click for panning
      if (e.button === 1 || (e.button === 0 && isSpaceDownRef.current)) {
        e.preventDefault()
        isPanningRef.current = true
        lastPanPointRef.current = { x: e.clientX, y: e.clientY }
        e.currentTarget.setPointerCapture(e.pointerId)
        return
      }

      e.currentTarget.setPointerCapture(e.pointerId)
      setIsDrawing(true)

      const point = getPointerInfo(e)
      addToPath(point)
      lastPointRef.current = point

      // Draw initial dot
      // Adjust brush size based on zoom for consistent visual appearance
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!

        // Save canvas state before touch drawing starts (for pinch-to-zoom recovery)
        if (e.pointerType === 'touch') {
          preTouchImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
        }
        const adjustedSize = brushSize / transform.scale
        renderBrushStroke(ctx, [point], {
          style: brushStyle,
          size: adjustedSize,
          color: brushColor,
          opacity: brushOpacity,
        })
      }
    },
    [mode, isDrawing, setIsDrawing, addToPath, clearPath, getPointerInfo, brushStyle, brushSize, brushColor, brushOpacity, transform.scale]
  )

  // Continue drawing
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Update touch tracking for multi-touch detection
      if (e.pointerType === 'touch') {
        activeTouchesRef.current.set(e.pointerId, e.nativeEvent as unknown as Touch)

        // If 2+ fingers are down, cancel drawing and switch to pan mode
        if (activeTouchesRef.current.size >= 2) {
          if (isDrawing) {
            setIsDrawing(false)
            clearPath()
            lastPointRef.current = null
            // Restore canvas to state before the touch started
            const canvas = canvasRef.current
            if (canvas && preTouchImageDataRef.current) {
              const ctx = canvas.getContext('2d', { willReadFrequently: true })!
              ctx.putImageData(preTouchImageDataRef.current, 0, 0)
              preTouchImageDataRef.current = null
            }
          }
          isPanningRef.current = true
          return
        }
      }

      // Handle panning with middle mouse or space+drag
      if (isPanningRef.current && lastPanPointRef.current) {
        const deltaX = e.clientX - lastPanPointRef.current.x
        const deltaY = e.clientY - lastPanPointRef.current.y

        const prev = targetTransformRef.current
        updateTransform({
          scale: prev.scale,
          offsetX: prev.offsetX + deltaX,
          offsetY: prev.offsetY + deltaY,
        }, false) // No animation for direct panning

        lastPanPointRef.current = { x: e.clientX, y: e.clientY }
        return
      }

      // Skip drawing if in pan mode
      if (isPanningRef.current) return

      if (!isDrawing || mode !== 'draw') return

      const point = getPointerInfo(e)
      addToPath(point)

      const canvas = canvasRef.current
      if (canvas && lastPointRef.current) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!

        // Draw segment from last point to current
        // Adjust brush size based on zoom for consistent visual appearance
        const adjustedSize = brushSize / transform.scale
        renderBrushStroke(ctx, [lastPointRef.current, point], {
          style: brushStyle,
          size: adjustedSize,
          color: brushColor,
          opacity: brushOpacity,
        })
      }

      lastPointRef.current = point
    },
    [isDrawing, setIsDrawing, clearPath, mode, addToPath, getPointerInfo, brushStyle, brushSize, brushColor, brushOpacity, updateTransform, transform.scale]
  )

  // End drawing
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      // Clean up touch tracking
      if (e.pointerType === 'touch') {
        activeTouchesRef.current.delete(e.pointerId)
        if (activeTouchesRef.current.size < 2) {
          lastPinchDistRef.current = null
        }
        // Reset panning mode when all fingers lifted
        if (activeTouchesRef.current.size === 0) {
          isPanningRef.current = false
        }
      }

      if (isPanningRef.current && e.pointerType !== 'touch') {
        isPanningRef.current = false
        lastPanPointRef.current = null
        return
      }

      if (!isDrawing) return

      e.currentTarget.releasePointerCapture(e.pointerId)
      setIsDrawing(false)

      // Clear the pre-touch backup since stroke completed successfully
      preTouchImageDataRef.current = null

      // Save state to history
      const canvas = canvasRef.current
      if (canvas && currentPath.length > 0) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        pushHistory(imageData)
      }

      clearPath()
      lastPointRef.current = null
    },
    [isDrawing, setIsDrawing, currentPath, clearPath, pushHistory]
  )

  // Handle touch events for pinch zoom
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      handlePinchZoom(e)
    }
  }, [handlePinchZoom])

  const handleTouchEnd = useCallback(() => {
    lastPinchDistRef.current = null
  }, [])

  // Prevent context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])

  // Generate cursor style - add state for panning cursor
  const [isPanning, setIsPanning] = useState(false)

  // Update panning cursor state
  useEffect(() => {
    const checkPanning = () => {
      setIsPanning(isSpaceDownRef.current || isPanningRef.current)
    }

    const interval = setInterval(checkPanning, 50)
    return () => clearInterval(interval)
  }, [])

  const cursorStyle = isPanning
    ? (isPanningRef.current ? 'grabbing' : 'grab')
    : mode === 'draw'
      ? getBrushCursor({
          style: brushStyle,
          size: brushSize * transform.scale,
          color: brushColor,
          opacity: brushOpacity,
        })
      : 'default'

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    const prev = targetTransformRef.current
    const newScale = Math.min(MAX_ZOOM, prev.scale * 1.25)
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const scaleChange = newScale / prev.scale
    updateTransform({
      scale: newScale,
      offsetX: centerX - (centerX - prev.offsetX) * scaleChange,
      offsetY: centerY - (centerY - prev.offsetY) * scaleChange,
    })
  }, [updateTransform])

  const handleZoomOut = useCallback(() => {
    const prev = targetTransformRef.current
    const newScale = Math.max(MIN_ZOOM, prev.scale / 1.25)
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const scaleChange = newScale / prev.scale
    updateTransform({
      scale: newScale,
      offsetX: centerX - (centerX - prev.offsetX) * scaleChange,
      offsetY: centerY - (centerY - prev.offsetY) * scaleChange,
    })
  }, [updateTransform])

  const handleResetZoom = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()

    // Reset to 420% zoom, centered
    updateTransform({
      scale: DEFAULT_ZOOM,
      offsetX: (rect.width - dimensions.width * DEFAULT_ZOOM) / 2,
      offsetY: (rect.height - dimensions.height * DEFAULT_ZOOM) / 2,
    })
  }, [dimensions, updateTransform])

  return (
    <div
      ref={containerRef}
      className="canvas-container-wrapper"
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        className="canvas-board"
        style={{
          cursor: cursorStyle,
          touchAction: 'none',
          transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={handleContextMenu}
      />

      {/* Zoom controls */}
      <div className="zoom-controls">
        <button onClick={handleZoomIn} title="Zoom In">+</button>
        <span className="zoom-level">{Math.round(transform.scale * 100)}%</span>
        <button onClick={handleZoomOut} title="Zoom Out">−</button>
        <button onClick={handleResetZoom} title="Reset Zoom" className="reset-btn">↺</button>
      </div>
    </div>
  )
}

// Export utility to get canvas context externally
export function getCanvasContext(canvasRef: React.RefObject<HTMLCanvasElement>) {
  return canvasRef.current?.getContext('2d', { willReadFrequently: true }) || null
}
