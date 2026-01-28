// src/types/index.ts
// Shared types for QD Studio

export interface HeaderProps {
  transparent?: boolean;
}

export interface TarotCard {
  id: string;
  title: string;
  src: string;
}

export interface DockItem {
  id: string;
  src: string;
  alt?: string;
  onClick?: () => void;
}

// Import card images
import machinas from '../assets/machinas.png';
import omegaloops from '../assets/omegaloops.png';
import origin from '../assets/origin.png';
import proof from '../assets/proof.png';
import signal from '../assets/signal.png';
import bits from '../assets/bits.png';

export const TAROT_CARDS: TarotCard[] = [
  {
    id: 'machinas',
    title: 'MACHINAS',
    src: machinas,
  },
  {
    id: 'omegaloops',
    title: 'OMEGALOOPS',
    src: omegaloops,
  },
  {
    id: 'origin',
    title: 'ORIGIN',
    src: origin,
  },
  {
    id: 'proof',
    title: 'PROOF',
    src: proof,
  },
  {
    id: 'signal',
    title: 'SIGNAL',
    src: signal,
  },
  {
    id: 'bits',
    title: 'BITS',
    src: bits,
  },
];
