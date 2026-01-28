import { useRef, useEffect, useCallback, useState } from 'react'
import { useStore } from '../store/useStore'
import type { SpeechBubble } from '../store/useStore'
import { getBubbleSvgUrl } from './SpeechBubblePalette'
import '../styles/bubbles.css'

export default function BubbleEditor() {
  const { mode, bubbleToolActive, bubbles, selectedBubbleId, updateBubble, deleteBubble, selectBubble } = useStore()

  // Show editor when bubble tool is active in draw or animate mode
  if (!bubbleToolActive || (mode !== 'draw' && mode !== 'animate')) return null

  return (
    <div className="bubble-editor-layer">
      {bubbles.map((bubble) => (
        <BubbleItem
          key={bubble.id}
          bubble={bubble}
          isSelected={bubble.id === selectedBubbleId}
          onSelect={() => selectBubble(bubble.id)}
          onUpdate={(updates) => updateBubble(bubble.id, updates)}
          onDelete={() => deleteBubble(bubble.id)}
        />
      ))}
    </div>
  )
}

interface BubbleItemProps {
  bubble: SpeechBubble
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<SpeechBubble>) => void
  onDelete: () => void
}

function BubbleItem({ bubble, isSelected, onSelect, onUpdate, onDelete }: BubbleItemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const dragStartRef = useRef({ x: 0, y: 0, bubbleX: 0, bubbleY: 0 })
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 })
  const rotateStartRef = useRef({ angle: 0, rotation: 0 })

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (isEditing) return
      e.stopPropagation()
      onSelect()
      setIsDragging(true)
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        bubbleX: bubble.x,
        bubbleY: bubble.y,
      }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [bubble.x, bubble.y, onSelect, isEditing]
  )

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      onUpdate({
        x: dragStartRef.current.bubbleX + dx,
        y: dragStartRef.current.bubbleY + dy,
      })
    },
    [isDragging, onUpdate]
  )

  const handleDragEnd = useCallback((e: React.PointerEvent) => {
    setIsDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  // Resize handlers
  const handleResizeStart = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      setIsResizing(true)
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: bubble.width,
        height: bubble.height,
      }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [bubble.width, bubble.height]
  )

  const handleResizeMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isResizing) return
      const dx = e.clientX - resizeStartRef.current.x
      const dy = e.clientY - resizeStartRef.current.y
      onUpdate({
        width: Math.max(100, resizeStartRef.current.width + dx),
        height: Math.max(80, resizeStartRef.current.height + dy),
      })
    },
    [isResizing, onUpdate]
  )

  const handleResizeEnd = useCallback((e: React.PointerEvent) => {
    setIsResizing(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  // Rotate handlers
  const handleRotateStart = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      setIsRotating(true)
      const rect = containerRef.current!.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
      rotateStartRef.current = { angle, rotation: bubble.rotation }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [bubble.rotation]
  )

  const handleRotateMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isRotating) return
      const rect = containerRef.current!.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
      const deltaAngle = (angle - rotateStartRef.current.angle) * (180 / Math.PI)
      onUpdate({
        rotation: rotateStartRef.current.rotation + deltaAngle,
      })
    },
    [isRotating, onUpdate]
  )

  const handleRotateEnd = useCallback((e: React.PointerEvent) => {
    setIsRotating(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  // Double click to edit text
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  // Text change
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate({ text: e.target.value })
    },
    [onUpdate]
  )

  // Blur to stop editing
  const handleTextBlur = useCallback(() => {
    setIsEditing(false)
  }, [])

  // Keyboard delete
  useEffect(() => {
    if (!isSelected) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!isEditing) {
          onDelete()
        }
      }
      if (e.key === 'Escape') {
        setIsEditing(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSelected, isEditing, onDelete])

  const svgUrl = getBubbleSvgUrl(bubble.type)

  return (
    <div
      ref={containerRef}
      className={`bubble-item ${isSelected ? 'selected' : ''}`}
      style={{
        left: bubble.x,
        top: bubble.y,
        width: bubble.width,
        height: bubble.height,
        transform: `rotate(${bubble.rotation}deg)`,
      }}
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      onDoubleClick={handleDoubleClick}
    >
      {/* Bubble background */}
      <img src={svgUrl} alt={bubble.type} className="bubble-bg" draggable={false} />

      {/* Text content */}
      <div className="bubble-text-container">
        {isEditing ? (
          <textarea
            className="bubble-textarea"
            value={bubble.text}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            autoFocus
            placeholder="Type here..."
          />
        ) : (
          <div className="bubble-text">{bubble.text || 'Double-click to edit'}</div>
        )}
      </div>

      {/* Selection handles */}
      {isSelected && (
        <>
          {/* Resize handle */}
          <div
            className="bubble-handle resize-handle"
            onPointerDown={handleResizeStart}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
          />

          {/* Rotate handle */}
          <div
            className="bubble-handle rotate-handle"
            onPointerDown={handleRotateStart}
            onPointerMove={handleRotateMove}
            onPointerUp={handleRotateEnd}
          />

          {/* Delete button */}
          <button className="bubble-delete-btn" onClick={onDelete}>
            ×
          </button>
        </>
      )}
    </div>
  )
}
