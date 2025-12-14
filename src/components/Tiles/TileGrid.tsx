import { useState, useEffect } from 'react';
import { TAROT_CARDS } from '../../types';
import Dock from './Dock';
import DockCard from './DockCard';
import Card from './Card';
import CardStack from './Cardstack';
import TerminalModal from '../Terminal/TerminalModal';

const MOBILE_BREAKPOINT = 768;

export default function TileGrid() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openCard = TAROT_CARDS.find((card) => card.id === activeCard);

  const handleCardSelect = (cardId: string) => {
    setActiveCard(cardId);
  };

  return (
    <>
      {isMobile ? (
        <CardStack onCardSelect={handleCardSelect} />
      ) : (
        <Dock>
          {TAROT_CARDS.map((card) => (
            <DockCard key={card.id} onClick={() => handleCardSelect(card.id)}>
              <Card src={card.src} alt={card.title} />
            </DockCard>
          ))}
        </Dock>
      )}

      <TerminalModal
        isOpen={!!activeCard}
        onClose={() => setActiveCard(null)}
        onMinimize={() => setActiveCard(null)}
        title={openCard?.title || ''}
      >
        <div
          style={{
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--qd-cyan)',
            fontSize: '1.5rem',
            fontFamily: 'SF Mono, monospace',
          }}
        >
          {openCard?.title} - Portfolio Content Coming Soon
        </div>
      </TerminalModal>
    </>
  );
}