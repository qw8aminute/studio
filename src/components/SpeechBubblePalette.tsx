import { useCallback } from 'react'
import { useStore } from '../store/useStore'
import type { SpeechBubble } from '../store/useStore'
import '../styles/bubbles.css'

// Import SVGs as URLs
import happySvg from '../assets/bubbles/happy.svg'
import angrySvg from '../assets/bubbles/angry.svg'
import whisperSvg from '../assets/bubbles/whisper.svg'
import shoutSvg from '../assets/bubbles/shout.svg'
import thinkSvg from '../assets/bubbles/think.svg'
import normalSvg from '../assets/bubbles/normal.svg'

type BubbleType = SpeechBubble['type']

interface BubbleOption {
  type: BubbleType
  label: string
  icon: string
  svg: string
  description: string
}

const BUBBLE_OPTIONS: BubbleOption[] = [
  { type: 'normal', label: 'Normal', icon: '💬', svg: normalSvg, description: 'Classic speech bubble' },
  { type: 'happy', label: 'Happy', icon: '😊', svg: happySvg, description: 'Cheerful with sparkles' },
  { type: 'angry', label: 'Angry', icon: '😠', svg: angrySvg, description: 'Jagged and intense' },
  { type: 'whisper', label: 'Whisper', icon: '🤫', svg: whisperSvg, description: 'Soft and dashed' },
  { type: 'shout', label: 'Shout', icon: '📢', svg: shoutSvg, description: 'Explosive burst' },
  { type: 'think', label: 'Think', icon: '💭', svg: thinkSvg, description: 'Cloud thought bubble' },
]

export default function SpeechBubblePalette() {
  const { mode, bubbleToolActive, addBubble, selectBubble } = useStore()

  const handleAddBubble = useCallback(
    (type: BubbleType) => {
      const newBubble: SpeechBubble = {
        id: `bubble-${Date.now()}`,
        type,
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
        width: 200,
        height: 150,
        text: '',
        rotation: 0,
      }
      addBubble(newBubble)
      selectBubble(newBubble.id)
    },
    [addBubble, selectBubble]
  )

  // Show palette when bubble tool is active in draw or animate mode
  if (!bubbleToolActive || (mode !== 'draw' && mode !== 'animate')) return null

  return (
    <div className="bubble-palette">
      <div className="bubble-palette-header">
        <h3>Speech Bubbles</h3>
        <p>Click to add a bubble to the canvas</p>
      </div>

      <div className="bubble-grid">
        {BUBBLE_OPTIONS.map((option) => (
          <button
            key={option.type}
            className="bubble-option"
            onClick={() => handleAddBubble(option.type)}
            title={option.description}
          >
            <div className="bubble-preview">
              <img src={option.svg} alt={option.label} />
            </div>
            <span className="bubble-label">
              <span className="bubble-icon">{option.icon}</span>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Export bubble SVG paths for inline rendering
export function getBubbleSvgUrl(type: BubbleType): string {
  const map: Record<BubbleType, string> = {
    happy: happySvg,
    angry: angrySvg,
    whisper: whisperSvg,
    shout: shoutSvg,
    think: thinkSvg,
    normal: normalSvg,
  }
  return map[type]
}
