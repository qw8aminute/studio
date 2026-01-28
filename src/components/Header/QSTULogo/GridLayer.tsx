import { animated, useTrail, useSpring } from '@react-spring/web'

const CELL = 10
const COLS = 7
const ROWS = 7
const STROKE = 0.7
const OFFSET = STROKE / 2

const SIZE = COLS * CELL + OFFSET * 2

const SMILEY: Array<[number, number]> = [
  [1.5 * CELL, 2 * CELL],
  [4.5 * CELL, 2 * CELL],
  [1.5 * CELL, 4.5 * CELL],
  [2.5 * CELL, 5 * CELL],
  [3 * CELL, 5.2 * CELL],
  [3.5 * CELL, 5 * CELL],
  [4.5 * CELL, 4.5 * CELL],
]

export default function GridLayer({ showSmiley }: { showSmiley: boolean }) {
  const grid = useTrail(Math.max(COLS, ROWS) + 1, {
    from: { x2: 0, y2: 0, o: 0 },
    to: { x2: SIZE, y2: SIZE, o: 1 },
    config: { tension: 260, friction: 30 },
  })

  const smiley = useSpring({
    opacity: showSmiley ? 1 : 0,
  })

  return (
  <svg className="qstu-grid" viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height="100%">
      <g stroke="currentColor" strokeWidth={STROKE} opacity={0.35}>
        {grid.map((s, i) => (
          <animated.line
            key={`h-${i}`}
            x1={0}
            y1={i * CELL + OFFSET}
            x2={s.x2}
            y2={i * CELL + OFFSET}
            opacity={s.o}
          />
        ))}
        {grid.map((s, i) => (
          <animated.line
            key={`v-${i}`}
            x1={i * CELL + OFFSET}
            y1={0}
            x2={i * CELL + OFFSET}
            y2={s.y2}
            opacity={s.o}
          />
        ))}
      </g>

      <animated.g style={smiley} fill="currentColor">
        {SMILEY.map(([x, y], i) => (
          <rect
            key={i}
            x={x + OFFSET}
            y={y + OFFSET}
            width={CELL}
            height={CELL}
            rx={2}
          />
        ))}
      </animated.g>
    </svg>
  )
}
