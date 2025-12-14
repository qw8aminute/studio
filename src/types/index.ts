// Shared Types for QD Studio

export interface HeroNode {
  id: string;
  label: string;
  type: 'center' | 'category';
  targetRoute?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface LiquidTileProps {
  id: string;
  title: string;
  subtitle?: string;
  videoSrc: string;
  route: string;
  themeColor: string;
  onClick?: () => void;
}

export interface BackgroundProps {
  pattern?: 'duality' | 'chaos' | 'flow';
  speed?: number;
  colorScheme?: 'blue' | 'teal' | 'purple';
}

export interface HeaderProps {
  transparent?: boolean;
}

export interface TerminalWindowProps {
  artifactUrl: string;
  onClose: () => void;
}

export interface TarotCard {
  id: string;
  title: string;
  src: string;
  route: string;
}

// Import images directly
import themicroteacher from '../assets/themicroteacher.png';
import thetemplates from '../assets/thetemplates.png';
import visualsignals from '../assets/visualsignals.png';
import theexperiment from '../assets/theexperiment.png';
import thebrandengine from '../assets/thebrandengine.png';
import thetuneup from '../assets/thetuneup.png';

export const TAROT_CARDS: TarotCard[] = [
  {
    id: 'templates',
    title: 'THE TEMPLATES',
    src: thetemplates,
    route: '/mini-templates'
  },
  {
    id: 'tuneup',
    title: 'THE TUNE UP',
    src: thetuneup,
    route: '/tuneup'
  },
  {
    id: 'brand-engine',
    title: 'THE BRAND ENGINE',
    src: thebrandengine,
    route: '/brand-engine'
  },
  {
    id: 'micro-teacher',
    title: 'THE MICRO TEACHER',
    src: themicroteacher,
    route: '/micro-teaching'
  },
  {
    id: 'visual-signals',
    title: 'VISUAL SIGNALS',
    src: visualsignals,
    route: '/abq-visuals'
  },
  {
    id: 'experiment',
    title: 'THE EXPERIMENT',
    src: theexperiment,
    route: '/experiments'
  }
];

export const TILE_DATA: Omit<LiquidTileProps, 'onClick'>[] = [
  {
    id: 'mini-templates',
    title: 'Mini Templates',
    subtitle: 'Instant web artifacts',
    videoSrc: '/videos/mini-templates.mp4',
    route: '/mini-templates',
    themeColor: '#FFD700'
  },
  {
    id: 'tuneup',
    title: 'Tune Up',
    subtitle: 'Brand health check',
    videoSrc: '/videos/tuneup.mp4',
    route: '/tuneup',
    themeColor: '#00CED1'
  },
  {
    id: 'brand-engine',
    title: 'Brand Engine',
    subtitle: 'Identity systems',
    videoSrc: '/videos/brand-engine.mp4',
    route: '/brand-engine',
    themeColor: '#FF6B6B'
  },
  {
    id: 'micro-teaching',
    title: 'Micro Teaching',
    subtitle: 'Quick expertise',
    videoSrc: '/videos/micro-teaching.mp4',
    route: '/micro-teaching',
    themeColor: '#9B59B6'
  },
  {
    id: 'abq-visuals',
    title: 'ABQ Visuals',
    subtitle: 'Local creative',
    videoSrc: '/videos/abq-visuals.mp4',
    route: '/abq-visuals',
    themeColor: '#E67E22'
  },
  {
    id: 'experiments',
    title: 'Experiments',
    subtitle: 'R&D playground',
    videoSrc: '/videos/experiments.mp4',
    route: '/experiments',
    themeColor: '#3498DB'
  }
];
