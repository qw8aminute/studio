import { useEffect, useMemo, useState } from 'react'
import { TAROT_CARDS } from '../../types'
import Dock from './Dock'
import CardStack from './Cardstack'
import TerminalModal from '../Terminal/TerminalModal'
import ExperimentTerminal from '../Terminal/CardComponents/ExperimentTerminal'
import TheTemplates from '../Terminal/TheTemplates/TheTemplates'


const MOBILE_BREAKPOINT = 768

export default function TileGrid() {
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const openCard = useMemo(
    () => TAROT_CARDS.find((card) => card.id === activeCard) ?? null,
    [activeCard]
  )

  const handleCardSelect = (cardId: string) => setActiveCard(cardId)

  const dockItems = useMemo(
    () =>
      TAROT_CARDS.map((card) => ({
        id: card.id,
        src: card.src,
        alt: card.title,
        onClick: () => handleCardSelect(card.id),
      })),
    []
  )

  return (
    <>
      {isMobile ? (
        <CardStack onCardSelect={handleCardSelect} />
      ) : (
        <Dock items={dockItems} />
      )}

      <TerminalModal
  isOpen={!!activeCard}
  onClose={() => setActiveCard(null)}
  onMinimize={() => setActiveCard(null)}
  title={openCard?.title ?? ''}
>
  {openCard?.title?.toUpperCase() === 'THE EXPERIMENT' ? (
    <div style={{ height: '100%', minHeight: 520, padding: 0, overflow: 'hidden' }}>
      <ExperimentTerminal />
    </div>
  ) : openCard?.title?.toUpperCase() === 'THE TEMPLATES' ? (
    <div style={{ height: '100%', minHeight: 520, padding: 0, overflow: 'hidden' }}>
      <TheTemplates />
    </div>
  ) : (
    <div
      style={{
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--qd-cyan)',
        fontSize: '1.5rem',
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "SF Mono", "Courier New", monospace',
      }}
    >
      {openCard?.title} - Portfolio Content Coming Soon
    </div>
  )}
</TerminalModal>
    </>
  )
}
