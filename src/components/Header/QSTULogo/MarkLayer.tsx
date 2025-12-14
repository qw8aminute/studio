import { animated, useSpring } from '@react-spring/web'
import type { QSTUPanel } from './QSTULogo'

type Props = {
  visible: boolean
  open: boolean
  setOpen: (v: boolean) => void
  onSelect?: (panel: QSTUPanel) => void
}

const isCoarsePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(pointer: coarse)').matches

export default function MarkLayer({ visible, open, setOpen, onSelect }: Props) {
  const fade = useSpring({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0px) scale(1)' : 'translateY(6px) scale(0.985)',
    config: { tension: 260, friction: 26 },
  })

  const menu = useSpring({
    opacity: open ? 1 : 0,
    maxHeight: open ? 240 : 0,
    transform: open ? 'translateY(0px) scale(1)' : 'translateY(-10px) scale(0.985)',
    config: { tension: 320, friction: 26 },
  })

  const onPointerDown = (e: React.PointerEvent) => {
    // tap-to-toggle only on coarse pointer devices (mobile/tablet)
    if (!isCoarsePointer()) return
    e.preventDefault()
    e.stopPropagation()
    setOpen(!open)
  }

  const onMouseEnter = () => {
    // hover-to-open only on fine pointers (desktop/laptop)
    if (isCoarsePointer()) return
    setOpen(true)
  }

  const onMouseLeave = () => {
    if (isCoarsePointer()) return
    setOpen(false)
  }

  const pick = (panel: QSTUPanel) => {
    onSelect?.(panel)
    setOpen(false)
  }

  return (
    <animated.div className="qstu-mark-layer" style={fade}>
      <div
        className="qstu-mark"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onPointerDown={onPointerDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
          if (e.key === 'Enter' || e.key === ' ') setOpen(!open)
        }}
      >
        <div className={`qstu-text ${open ? 'is-hidden' : ''}`}>
          <div>QS</div>
          <div>TU</div>
        </div>

        <animated.div
          className={`qstu-menu ${open ? 'is-open' : ''}`}
          style={menu}
          aria-hidden={!open}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="menu-inner">
            <button className="menu-item" type="button" onClick={() => pick('about')}>
              About
            </button>
            <button className="menu-item" type="button" onClick={() => pick('contact')}>
              Contact
            </button>
            <button className="menu-item" type="button" onClick={() => pick('resume')}>
              Resume
            </button>
          </div>
        </animated.div>
      </div>
    </animated.div>
  )
}
