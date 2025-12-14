import { useEffect, useState } from 'react'
import GridLayer from './GridLayer'
import MarkLayer from './MarkLayer'
import './QSTULogo.css'

export type QSTUPanel = 'about' | 'contact' | 'resume'

type Props = {
  onSelect?: (panel: QSTUPanel) => void
}

export default function QSTULogo({ onSelect }: Props) {
  const [showMark, setShowMark] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setShowMark(true), 2000)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="qstu-root" onPointerDown={(e) => e.stopPropagation()}>
      <div className="qstu-stage">
        <div className="qstu-grid-wrap">
          <GridLayer showSmiley={!showMark || open} />
        </div>

        <MarkLayer
          visible={showMark}
          open={open}
          setOpen={setOpen}
          onSelect={onSelect}
        />
      </div>
    </div>
  )
}
