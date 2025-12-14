import { useEffect, useRef } from 'react'
import { animated, useSpring } from '@react-spring/web'

export type HeaderPanel = 'about' | 'contact' | 'resume'

type Props = {
  visible: boolean
  hovered: boolean
  onHover: (v: boolean) => void
  onSelect?: (panel: HeaderPanel) => void
}

export default function MarkLayer({ visible, hovered, onHover, onSelect }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  const fade = useSpring({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0px) scale(1)' : 'translateY(6px) scale(0.985)',
    config: { tension: 260, friction: 26 },
  })

  const menu = useSpring({
    opacity: hovered ? 1 : 0,
    maxHeight: hovered ? 220 : 0,
    transform: hovered ? 'translateY(0px)' : 'translateY(-10px)',
    config: { tension: 320, friction: 26 },
  })

  // Touch behavior: close when tapping outside
  useEffect(() => {
    if (!hovered) return

    const onDocPointerDown = (e: PointerEvent) => {
      const el = rootRef.current
      if (!el) return
      if (!el.contains(e.target as Node)) onHover(false)
    }

    document.addEventListener('pointerdown', onDocPointerDown, { capture: true })
    return () => document.removeEventListener('pointerdown', onDocPointerDown, { capture: true })
  }, [hovered, onHover])

  const select = (p: HeaderPanel) => {
    onSelect?.(p)
    onHover(false)
  }

  return (
    <animated.div className="qstu-mark-layer" style={fade}>
      <div
        ref={rootRef}
        className="qstu-mark"
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') onHover(true)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') onHover(false)
        }}
        onClick={(e) => {
          // Tap toggles on touch; mouse hover handles itself.
          // Stop bubbling so parent/document handlers don't insta-close it.
          e.stopPropagation()
          const isTouch = (e.nativeEvent as PointerEvent).pointerType === 'touch'
          if (isTouch) onHover(!hovered)
        }}
      >
        <div className={`qstu-text ${hovered ? 'is-hidden' : ''}`}>
          <div>QS</div>
          <div>TU</div>
        </div>

        <animated.div
          className={`qstu-menu ${hovered ? 'is-open' : ''}`}
          style={menu}
          aria-hidden={!hovered}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="menu-inner">
            <button className="menu-item" type="button" onClick={() => select('about')}>
              About
            </button>
            <button className="menu-item" type="button" onClick={() => select('contact')}>
              Contact
            </button>
            <button className="menu-item" type="button" onClick={() => select('resume')}>
              Resume
            </button>
          </div>
        </animated.div>
      </div>
    </animated.div>
  )
}
