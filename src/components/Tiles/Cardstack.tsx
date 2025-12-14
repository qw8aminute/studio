import { useMemo, useState, useCallback } from 'react'
import { useSprings, animated, to as interpolate } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { TAROT_CARDS } from '../../types'
import './CardStack.css'

interface CardStackProps {
  onCardSelect: (cardId: string) => void
}

const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(8deg) rotateY(${r / 15}deg) rotateZ(${r}deg) scale(${s})`

export default function CardStack({ onCardSelect }: CardStackProps) {
  const cards = TAROT_CARDS
  const [top, setTop] = useState(cards.length - 1)
  const [isDragging, setIsDragging] = useState(false)

  const order = useMemo(() => {
    return Array.from({ length: cards.length }, (_, i) => i)
  }, [cards.length])

  const pose = useCallback((i: number, currentTop: number) => {
    const depth = currentTop - i
    return {
      x: 0,
      y: Math.min(12, depth * 4),
      scale: 1 - Math.min(0.08, depth * 0.015),
      rot: depth === 0 ? 0 : -1.5 + (i % 5) * 0.4,
      immediate: false as const,
      config: { tension: 280, friction: 28 },
    }
  }, [])

  const [springs, api] = useSprings(cards.length, (i) => pose(i, top))

  const restack = useCallback((nextTop: number) => {
    api.start((i) => pose(i, nextTop))
  }, [api, pose])

  // Haptic feedback helper
  const haptic = useCallback((style: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = { light: 10, medium: 20, heavy: 40 }
      navigator.vibrate(patterns[style])
    }
  }, [])

  const bind = useDrag(
    ({ down, movement: [mx, my], velocity: [vx], direction: [xDir], first, last, tap, event }) => {
      const index = top
      const dir = xDir < 0 ? -1 : 1

      // Prevent default to stop scroll interference
      if (event && 'preventDefault' in event) {
        event.preventDefault()
      }

      if (first) {
        setIsDragging(true)
        haptic('light')
      }

      // TAP = open the card
      if (tap) {
        setIsDragging(false)
        haptic('medium')
        onCardSelect(cards[index].id)
        return
      }

      // Determine if this is a horizontal swipe (not vertical scroll attempt)
      const isHorizontalSwipe = Math.abs(mx) > Math.abs(my) * 0.8

      // Throw threshold - easier to trigger
      const shouldThrow = !down && isHorizontalSwipe && (Math.abs(mx) > 60 || vx > 0.2)

      api.start((i) => {
        if (i !== index) return

        if (shouldThrow) {
          // Fling it off screen
          return {
            x: (window.innerWidth + 300) * dir,
            rot: dir * 25,
            scale: 0.95,
            immediate: false,
            config: { tension: 200, friction: 30 },
          }
        }

        if (down && isHorizontalSwipe) {
          // Active drag - follow finger with tilt
          return {
            x: mx,
            rot: mx / 12,
            scale: 1.02,
            immediate: false,
            config: { tension: 800, friction: 35 },
          }
        }

        // Snap back
        return pose(i, top)
      })

      if (last) {
        setIsDragging(false)
        
        if (shouldThrow) {
          haptic('heavy')
          const nextTop = index - 1
          const normalized = nextTop >= 0 ? nextTop : cards.length - 1
          
          // Small delay before restacking for smoother feel
          setTimeout(() => {
            setTop(normalized)
            restack(normalized)
          }, 150)
        }
      }
    },
    {
      filterTaps: true,
      threshold: 5,
      axis: 'x',
      preventScrollAxis: 'x',
      pointer: { touch: true },
      eventOptions: { passive: false },
    }
  )

  return (
    <div className="card-stack-container">
      {/* Glow backdrop for top card */}
      <div className={`card-glow ${isDragging ? 'dragging' : ''}`} />
      
      {order.map((i) => {
        const isTop = i === top
        const { x, y, rot, scale } = springs[i]

        return (
          <animated.div
            className="card-stack-wrapper"
            key={cards[i].id}
            style={{
              x,
              y,
              zIndex: i === top ? 999 : i,
            }}
          >
            <animated.div
              {...(isTop ? bind() : {})}
              className={`card-stack-card ${isTop ? 'is-top' : ''}`}
              style={{
                transform: interpolate([rot, scale], trans),
                backgroundImage: `url(${cards[i].src})`,
              }}
            >
              {/* Holographic shine overlay */}
              {isTop && <div className="card-shine" />}
              
              {/* Animated border */}
              {isTop && <div className="card-border-glow" />}
            </animated.div>
          </animated.div>
        )
      })}

      <div className="card-stack-hint">
        <span>Tap to open · Swipe to browse</span>
      </div>
    </div>
  )
}