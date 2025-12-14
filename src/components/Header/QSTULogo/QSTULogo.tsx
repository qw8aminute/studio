import { useEffect, useState } from 'react'
import GridLayer from './GridLayer'
import MarkLayer from './MarkLayer'
import './QSTULogo.css'

export type HeaderPanel = 'about' | 'contact' | 'resume'

type Props = {
  onSelect?: (panel: HeaderPanel) => void
}

export default function QSTULogo({ onSelect }: Props) {
  const [showMark, setShowMark] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setShowMark(true), 2000)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="qstu-root">
      <div className="qstu-stage">
        <div className="qstu-grid-wrap">
          <GridLayer showSmiley={!showMark || hovered} />
        </div>

        <MarkLayer
          visible={showMark}
          hovered={hovered}
          onHover={setHovered}
          onSelect={onSelect}
        />
      </div>
    </div>
  )
}
