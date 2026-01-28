// src/components/Tiles/TileGrid.tsx
// Desktop: Mac Dock | Mobile: CardStack
import { useState, useEffect } from 'react';
import { TAROT_CARDS } from '../../types';
import Dock from './Dock';
import { CardStack } from './CardStack';
import TerminalModal from '../Terminal/TerminalModal';

// Card Content Components
import { OmegaloopsTerminal, MachinasContent, BitsComingSoon } from '../Terminal/CardComponents';
import { AboutTerminal, ContactTerminal, ResumeTerminal } from '../Terminal/Screens';

// Map card IDs to content
const CardContent: React.FC<{
  cardId: string | null;
  onLinkedIn404?: () => void;
}> = ({ cardId, onLinkedIn404 }) => {
  switch (cardId) {
    case 'machinas':
      return <MachinasContent />;
    case 'omegaloops':
      return <OmegaloopsTerminal />;
    case 'origin':
      return <AboutTerminal />;
    case 'proof':
      return <ResumeTerminal onLinkedIn404={onLinkedIn404} />;
    case 'signal':
      return <ContactTerminal onLinkedIn404={onLinkedIn404} />;
    case 'bits':
      return <BitsComingSoon />;
    default:
      return (
        <div style={{
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--qd-cyan)',
          fontSize: '1.5rem',
          fontFamily: 'SF Mono, monospace'
        }}>
          Content Coming Soon
        </div>
      );
  }
};

export default function TileGrid() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [linkedIn404Open, setLinkedIn404Open] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      const coarse = window.matchMedia?.('(pointer: coarse)')?.matches;
      const narrow = window.innerWidth < 768;
      setIsMobile(coarse || narrow);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openCard = TAROT_CARDS.find(card => card.id === activeCard);

  // Build dock items for Dock component
  const dockItems = TAROT_CARDS.map((card) => ({
    id: card.id,
    src: card.src,
    alt: card.title,
    onClick: () => setActiveCard(card.id),
  }));

  const handleLinkedIn404 = () => {
    setLinkedIn404Open(true);
  };

  return (
    <>
      {/* Desktop: Mac Dock | Mobile: CardStack */}
      {isMobile ? (
        <CardStack onCardSelect={(id) => setActiveCard(id)} />
      ) : (
        <Dock items={dockItems} />
      )}

      {/* Main Card Modal */}
      <TerminalModal
        isOpen={!!activeCard}
        onClose={() => setActiveCard(null)}
        onMinimize={() => setActiveCard(null)}
        title={openCard?.title || ''}
      >
        <CardContent
          cardId={activeCard}
          onLinkedIn404={handleLinkedIn404}
        />
      </TerminalModal>

      {/* LinkedIn 404 Modal */}
      <TerminalModal
        isOpen={linkedIn404Open}
        onClose={() => setLinkedIn404Open(false)}
        onMinimize={() => setLinkedIn404Open(false)}
        title="404 NO LINK"
      >
        <div style={{
          padding: '2rem',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          color: 'rgba(210,245,255,0.92)',
        }}>
          <div style={{
            color: 'rgba(110,224,255,0.85)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontSize: '0.82rem',
            marginBottom: '1rem',
          }}>
            404 no link
          </div>
          <div style={{
            padding: '14px',
            borderRadius: '14px',
            border: '1px solid rgba(110,224,255,0.18)',
            background: 'rgba(0,0,0,0.18)'
          }}>
            <div style={{ opacity: 0.75 }}>$msft didnt pay me ¯\_(ツ)_/¯</div>
            <div style={{ marginTop: '18px', color: 'rgba(110,224,255,0.75)' }}>qdfafo ~ %</div>
          </div>
        </div>
      </TerminalModal>
    </>
  );
}
