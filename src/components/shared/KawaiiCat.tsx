// src/components/shared/KawaiiCat.tsx
// Kawaii cat for the Visual Signals "coming soon" animation
import React from 'react';
import { colors } from '../../styles/tokens';

export type CatPhase = 'idle' | 'sneak' | 'grab' | 'flee' | 'loop';

interface KawaiiCatProps {
  phase: CatPhase;
  holdingCrown?: boolean;
  size?: number;
}

export const KawaiiCat: React.FC<KawaiiCatProps> = ({ 
  phase, 
  holdingCrown = false, 
  size = 70 
}) => (
  <svg 
    width={size} 
    height={size * 1.15} 
    viewBox="0 0 80 92"
    style={{ 
      overflow: 'visible',
      transform: phase === 'flee' ? 'scaleX(-1)' : 'scaleX(1)',
      transition: 'transform 0.2s ease',
    }}
  >
    <defs>
      <linearGradient id="tabbyBody404" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD699" />
        <stop offset="40%" stopColor="#FFCA80" />
        <stop offset="100%" stopColor="#F5B366" />
      </linearGradient>
      <linearGradient id="tabbyCream404" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFEF5" />
        <stop offset="100%" stopColor="#FFF5E6" />
      </linearGradient>
      <linearGradient id="crownGold404" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFE066" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#E6B800" />
      </linearGradient>
      <filter id="catGlow404">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Body */}
    <ellipse cx="40" cy="68" rx="26" ry="22" fill="url(#tabbyBody404)" stroke="#E8A850" strokeWidth="1.5"/>
    <ellipse cx="40" cy="70" rx="16" ry="16" fill="url(#tabbyCream404)"/>
    
    {/* Head */}
    <ellipse cx="40" cy="32" rx="25" ry="23" fill="url(#tabbyBody404)" stroke="#E8A850" strokeWidth="1.5"/>
    <ellipse cx="40" cy="37" rx="18" ry="16" fill="url(#tabbyCream404)"/>
    
    {/* Ears */}
    <path d="M 18 22 L 14 2 L 30 17 Z" fill="url(#tabbyBody404)" stroke="#E8A850" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M 19 19 L 17 8 L 27 17 Z" fill="#FFB5B5"/>
    <path d="M 62 22 L 66 2 L 50 17 Z" fill="url(#tabbyBody404)" stroke="#E8A850" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M 61 19 L 63 8 L 53 17 Z" fill="#FFB5B5"/>
    
    {/* Eyes */}
    {phase === 'sneak' ? (
      <>
        <g transform="translate(30, 32)">
          <ellipse rx="8" ry="9" fill="#1a1a24"/>
          <ellipse cx="3" cy="0" rx="3.5" ry="4" fill="#ffffff"/>
          <circle cx="5" cy="2" r="1.5" fill="#ffffff" opacity="0.6"/>
        </g>
        <g transform="translate(50, 32)">
          <ellipse rx="8" ry="9" fill="#1a1a24"/>
          <ellipse cx="3" cy="0" rx="3.5" ry="4" fill="#ffffff"/>
          <circle cx="5" cy="2" r="1.5" fill="#ffffff" opacity="0.6"/>
        </g>
      </>
    ) : phase === 'grab' ? (
      <>
        <g transform="translate(30, 32)">
          <ellipse rx="8" ry="9" fill="#1a1a24"/>
          <ellipse cx="-2" cy="-2" rx="3.5" ry="4" fill="#ffffff"/>
          <circle cx="3" cy="3" r="1.5" fill="#ffffff" opacity="0.6"/>
          <path d="M -2 -5 L -1.5 -3 L 0.5 -2.5 L -1.5 -2 L -2 0 L -2.5 -2 L -4.5 -2.5 L -2.5 -3 Z" fill="#ffffff">
            <animate attributeName="opacity" values="1;0.4;1" dur="0.4s" repeatCount="indefinite"/>
          </path>
        </g>
        <g transform="translate(50, 32)">
          <ellipse rx="8" ry="9" fill="#1a1a24"/>
          <ellipse cx="-2" cy="-2" rx="3.5" ry="4" fill="#ffffff"/>
          <circle cx="3" cy="3" r="1.5" fill="#ffffff" opacity="0.6"/>
          <path d="M -2 -5 L -1.5 -3 L 0.5 -2.5 L -1.5 -2 L -2 0 L -2.5 -2 L -4.5 -2.5 L -2.5 -3 Z" fill="#ffffff">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="0.4s" repeatCount="indefinite"/>
          </path>
        </g>
      </>
    ) : phase === 'flee' ? (
      <>
        <path d="M 24 32 Q 30 26 36 32" stroke="#2a2a3a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M 44 32 Q 50 26 56 32" stroke="#2a2a3a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </>
    ) : (
      <>
        <g transform="translate(30, 32)">
          <ellipse rx="8" ry="9" fill="#1a1a24"/>
          <ellipse cx="-2" cy="-2" rx="3.5" ry="4" fill="#ffffff"/>
          <circle cx="3" cy="3" r="1.5" fill="#ffffff" opacity="0.6"/>
        </g>
        <g transform="translate(50, 32)">
          <ellipse rx="8" ry="9" fill="#1a1a24"/>
          <ellipse cx="-2" cy="-2" rx="3.5" ry="4" fill="#ffffff"/>
          <circle cx="3" cy="3" r="1.5" fill="#ffffff" opacity="0.6"/>
        </g>
      </>
    )}
    
    {/* Blush */}
    <ellipse cx="20" cy="42" rx="5" ry="3" fill="#FFB5B5" opacity="0.8"/>
    <ellipse cx="60" cy="42" rx="5" ry="3" fill="#FFB5B5" opacity="0.8"/>
    
    {/* Nose */}
    <path d="M 40 44 L 37 47 L 43 47 Z" fill="#FFB5B5"/>
    
    {/* Mouth */}
    {phase === 'flee' ? (
      <path d="M 34 50 Q 40 57 46 50" stroke="#E8A850" strokeWidth="2" strokeLinecap="round" fill="none"/>
    ) : phase === 'sneak' ? (
      <path d="M 36 50 Q 40 53 44 50" stroke="#E8A850" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    ) : (
      <>
        <path d="M 35 49 Q 38 52 40 49" stroke="#E8A850" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M 40 49 Q 42 52 45 49" stroke="#E8A850" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </>
    )}
    
    {/* Whiskers */}
    <g stroke="#D4A574" strokeWidth="1.2" strokeLinecap="round" opacity="0.6">
      <line x1="16" y1="40" x2="4" y2="38"/>
      <line x1="16" y1="44" x2="2" y2="44"/>
      <line x1="16" y1="48" x2="4" y2="50"/>
      <line x1="64" y1="40" x2="76" y2="38"/>
      <line x1="64" y1="44" x2="78" y2="44"/>
      <line x1="64" y1="48" x2="76" y2="50"/>
    </g>
    
    {/* Arms */}
    <ellipse cx="18" cy="62" rx="8" ry="12" fill="url(#tabbyBody404)" stroke="#E8A850" strokeWidth="1.5"/>
    <ellipse cx="62" cy="62" rx="8" ry="12" fill="url(#tabbyBody404)" stroke="#E8A850" strokeWidth="1.5"/>
    
    {/* Crown in paws */}
    {holdingCrown && (phase === 'grab' || phase === 'flee') && (
      <g transform="translate(40, 58) scale(0.6)" filter="url(#catGlow404)">
        <path d="M -22 18 L -28 -8 L -14 6 L 0 -14 L 14 6 L 28 -8 L 22 18 Z" fill="url(#crownGold404)" stroke="#DAA520" strokeWidth="2"/>
        <rect x="-22" y="14" width="44" height="9" rx="2" fill="#DAA520"/>
        <circle cx="-11" cy="18" r="3.5" fill={colors.trust}/>
        <circle cx="0" cy="18" r="3.5" fill={colors.violet}/>
        <circle cx="11" cy="18" r="3.5" fill={colors.signal}/>
        <circle cx="-28" cy="-8" r="4" fill="#FFE066" stroke="#DAA520" strokeWidth="1"/>
        <circle cx="0" cy="-14" r="5" fill="#FFE066" stroke="#DAA520" strokeWidth="1"/>
        <circle cx="28" cy="-8" r="4" fill="#FFE066" stroke="#DAA520" strokeWidth="1"/>
      </g>
    )}
    
    {/* Motion lines */}
    {phase === 'flee' && (
      <g stroke="#E8A850" strokeWidth="2" opacity="0.5" strokeLinecap="round">
        <line x1="72" y1="40" x2="82" y2="38">
          <animate attributeName="x1" values="72;77;72" dur="0.15s" repeatCount="indefinite"/>
        </line>
        <line x1="74" y1="50" x2="84" y2="50">
          <animate attributeName="x1" values="74;79;74" dur="0.12s" repeatCount="indefinite"/>
        </line>
        <line x1="72" y1="60" x2="82" y2="62">
          <animate attributeName="x1" values="72;77;72" dur="0.18s" repeatCount="indefinite"/>
        </line>
      </g>
    )}
  </svg>
);

export default KawaiiCat;
