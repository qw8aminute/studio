import { useState, useCallback } from 'react'
import { useSprings, animated, to as interpolate } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { TAROT_CARDS } from '../../types'
import './CardStack.css'

interface CardStackProps {
  onCardSelect: (cardId: string) => void
}

// Initial position for each card in the stack
const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -6 + Math.random() * 12,
  delay: i * 100,
})

// Cards fly in from above
const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })

// Transform string for 3D effect
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(20deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

export default function CardStack({ onCardSelect }: CardStackProps) {
  const cards = TAROT_CARDS
  const [gone] = useState(() => new Set<number>())

  const [springs, api] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i),
  }))

  // Haptic feedback
  const haptic = useCallback((ms: number = 10) => {
    if ('vibrate' in navigator) navigator.vibrate(ms)
  }, [])

  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity: [vx], tap }) => {
      // Tap = open the card
      if (tap) {
        haptic(15)
        onCardSelect(cards[index].id)
        return
      }

      const trigger = vx > 0.2 // Flick threshold
      const dir = xDir < 0 ? -1 : 1

      if (!down && trigger) {
        gone.add(index)
        haptic(25)
      }

      api.start(i => {
        if (index !== i) return // Only animate the card being dragged
        const isGone = gone.has(index)
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0
        const rot = mx / 100 + (isGone ? dir * 10 * vx : 0)
        const scale = down ? 1.08 : 1

        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        }
      })

      // Reset deck when all cards are gone
      if (!down && gone.size === cards.length) {
        setTimeout(() => {
          gone.clear()
          api.start(i => to(i))
        }, 600)
      }
    },
    { filterTaps: true, threshold: 10 }
  )

  return (
    <div className="card-stack-container">
      {springs.map(({ x, y, rot, scale }, i) => (
        <animated.div className="card-stack-wrapper" key={cards[i].id} style={{ x, y }}>
          <animated.div
            {...bind(i)}
            className="card-stack-card"
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${cards[i].src})`,
            }}
          >
            {/* Shine overlay */}
            <div className="card-shine" />
            {/* Glow border */}
            <div className="card-glow-border" />
          </animated.div>
        </animated.div>
      ))}

      <div className="card-stack-hint">
        Tap to open · Swipe to browse
      </div>
    </div>
  )
}