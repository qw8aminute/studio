import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
const CardContent = ({ cardId, onLinkedIn404 }) => {
    switch (cardId) {
        case 'machinas':
            return _jsx(MachinasContent, {});
        case 'omegaloops':
            return _jsx(OmegaloopsTerminal, {});
        case 'origin':
            return _jsx(AboutTerminal, {});
        case 'proof':
            return _jsx(ResumeTerminal, { onLinkedIn404: onLinkedIn404 });
        case 'signal':
            return _jsx(ContactTerminal, { onLinkedIn404: onLinkedIn404 });
        case 'bits':
            return _jsx(BitsComingSoon, {});
        default:
            return (_jsx("div", { style: {
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--qd-cyan)',
                    fontSize: '1.5rem',
                    fontFamily: 'SF Mono, monospace'
                }, children: "Content Coming Soon" }));
    }
};
export default function TileGrid() {
    const [activeCard, setActiveCard] = useState(null);
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
    return (_jsxs(_Fragment, { children: [isMobile ? (_jsx(CardStack, { onCardSelect: (id) => setActiveCard(id) })) : (_jsx(Dock, { items: dockItems })), _jsx(TerminalModal, { isOpen: !!activeCard, onClose: () => setActiveCard(null), onMinimize: () => setActiveCard(null), title: openCard?.title || '', children: _jsx(CardContent, { cardId: activeCard, onLinkedIn404: handleLinkedIn404 }) }), _jsx(TerminalModal, { isOpen: linkedIn404Open, onClose: () => setLinkedIn404Open(false), onMinimize: () => setLinkedIn404Open(false), title: "404 NO LINK", children: _jsxs("div", { style: {
                        padding: '2rem',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        color: 'rgba(210,245,255,0.92)',
                    }, children: [_jsx("div", { style: {
                                color: 'rgba(110,224,255,0.85)',
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                fontSize: '0.82rem',
                                marginBottom: '1rem',
                            }, children: "404 no link" }), _jsxs("div", { style: {
                                padding: '14px',
                                borderRadius: '14px',
                                border: '1px solid rgba(110,224,255,0.18)',
                                background: 'rgba(0,0,0,0.18)'
                            }, children: [_jsx("div", { style: { opacity: 0.75 }, children: "$msft didnt pay me \u00AF\\_(\u30C4)_/\u00AF" }), _jsx("div", { style: { marginTop: '18px', color: 'rgba(110,224,255,0.75)' }, children: "qdfafo ~ %" })] })] }) })] }));
}
