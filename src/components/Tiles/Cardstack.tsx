import { useMemo, useState } from 'react'
import { useSprings, animated, to as interpolate } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { TAROT_CARDS } from '../../types'
import './CardStack.css'

interface CardStackProps {
  onCardSelect: (cardId: string) => void
}

const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(12deg) rotateY(${r / 12}deg) rotateZ(${r}deg) scale(${s})`

export default function CardStack({ onCardSelect }: CardStackProps) {
  const cards = TAROT_CARDS

  // top points at the "current" card in the deck (0..len-1)
  const [top, setTop] = useState(cards.length - 1)

  // Compute the stack order: top card is last index = top, then top-1, etc (wrap if you want later)
  const order = useMemo(() => {
    // show all cards behind the top for now
    return Array.from({ length: cards.length }, (_, i) => i)
  }, [cards.length])

  // Base pose for each card based on how far from top it is
  const pose = (i: number, currentTop: number) => {
    const depth = currentTop - i // 0 for top, positive for behind
    return {
      x: 0,
      y: Math.min(10, depth * 3),        // stack down slightly
      scale: 1 - Math.min(0.06, depth * 0.01),
      rot: depth === 0 ? 0 : -2 + (i % 5) * 0.6,
      immediate: false as const,
      config: { tension: 320, friction: 30 },
    }
  }

  const [springs, api] = useSprings(cards.length, (i) => pose(i, top))

  // whenever top changes, restack immediately
  const restack = (nextTop: number) => {
    api.start((i) => pose(i, nextTop))
  }

  const bind = useDrag(
    ({ down, movement: [mx], velocity: [vx], direction: [xDir], last, tap }) => {
      const index = top // only interact with current top card
      const dir = xDir < 0 ? -1 : 1

      if (tap) {
        onCardSelect(cards[index].id)
        return
      }

      // if user drags mostly vertically, cancel to avoid weirdness
      if (Math.abs(mx) < 2 && !down) return

      const throwIt = !down && (Math.abs(mx) > 90 || vx > 0.25)

      api.start((i) => {
        if (i !== index) return

        const x = throwIt ? (window.innerWidth + 220) * dir : down ? mx : 0
        const rot = mx / 18 + (throwIt ? dir * 12 : 0)
        const scale = down ? 1.03 : 1

        return {
          x,
          rot,
          scale,
          immediate: false,
          config: { tension: down ? 700 : 320, friction: 36 },
        }
      })

      if (last) {
        if (throwIt) {
          const nextTop = index - 1
          // advance deck (reset if empty)
          const normalized = nextTop >= 0 ? nextTop : cards.length - 1
          setTop(normalized)
          // restack using the new top (don’t wait for state)
          restack(normalized)
        } else {
          // snap back
          api.start((i) => (i === index ? pose(i, top) : undefined))
        }
      }
    },
    {
      filterTaps: true,
      threshold: 8,
      preventScroll: true,
      eventOptions: { passive: false },
    }
  )

  return (
    <div className="card-stack-container">
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
              zIndex: i === top ? 999 : i, // top always above
            }}
          >
            <animated.div
              {...(isTop ? bind() : {})}
              className={`card-stack-card ${isTop ? 'is-top' : ''}`}
              style={{
                transform: interpolate([rot, scale], trans),
                backgroundImage: `url(${cards[i].src})`,
              }}
            />
          </animated.div>
        )
      })}

      <div className="card-stack-hint">
        <span>Tap to open • Swipe to discard</span>
      </div>
    </div>
  )
}
