// src/components/shared/ComingSoon.tsx
// Coming soon animation with spirograph eye and kawaii cat stealing crown
import React, { useState, useEffect, useMemo } from 'react';
import { colors, fonts } from '../../styles/tokens';
import { KawaiiCat, type CatPhase } from './KawaiiCat';

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
}

// Spirograph path generator
const generateSpiroPaths = (count: number, cx: number, cy: number, scale: number = 1): string[] => {
  const paths: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = 2 + (i % 4);
    const b = 3 + ((i + 1) % 5);
    const ampX = (60 + i * 2) * scale;
    const ampY = (35 + i * 1.75) * scale;
    const rot = (i * Math.PI) / 28;
    let d = "M ";
    for (let t = 0; t <= 360; t += 2) {
      const rad = (Math.PI * 2 * t) / 360;
      const x0 = ampX * Math.sin(a * rad);
      const y0 = ampY * Math.sin(b * rad + Math.PI / 3);
      const x = x0 * Math.cos(rot) - y0 * Math.sin(rot) + cx;
      const y = x0 * Math.sin(rot) + y0 * Math.cos(rot) + cy;
      d += t === 0 ? `${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    paths.push(d);
  }
  return paths;
};

// Spirograph Eye component
const SpirographEye: React.FC<{ hasCrown: boolean; isFrustrated: boolean }> = ({ hasCrown, isFrustrated }) => {
  const paths = useMemo(() => generateSpiroPaths(8, 100, 55, 1), []);
  
  return (
    <svg width="200" height="110" viewBox="0 0 200 110" style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 204, 0.2))' }}>
      <defs>
        <linearGradient id="crownGoldEye" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#E6B800" />
        </linearGradient>
        <filter id="eyeGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Eye outline */}
      <path 
        d="M 10 55 Q 100 5 190 55 Q 100 105 10 55 Z"
        fill="none"
        stroke={colors.starlight}
        strokeWidth="1.5"
        opacity="0.4"
      />
      
      {/* Spirograph patterns */}
      {paths.map((d, idx) => (
        <path 
          key={idx} 
          d={d}
          fill="none"
          stroke={isFrustrated ? colors.coral : "rgba(0, 255, 204, 0.7)"}
          strokeWidth="1"
          style={{
            mixBlendMode: 'screen',
            opacity: 0.6,
            transition: 'stroke 0.3s ease',
          }}
        />
      ))}
      
      {/* Crown on eye */}
      {hasCrown && (
        <g transform="translate(100, 8)" filter="url(#eyeGlow)">
          <path d="M -18 15 L -22 -6 L -11 5 L 0 -11 L 11 5 L 22 -6 L 18 15 Z" fill="url(#crownGoldEye)" stroke="#DAA520" strokeWidth="1.5"/>
          <rect x="-18" y="12" width="36" height="7" rx="2" fill="#DAA520"/>
          <circle cx="-9" cy="15" r="2.5" fill={colors.trust}/>
          <circle cx="0" cy="15" r="2.5" fill={colors.violet}/>
          <circle cx="9" cy="15" r="2.5" fill={colors.signal}/>
          <circle cx="-22" cy="-6" r="3" fill="#FFE066" stroke="#DAA520" strokeWidth="1"/>
          <circle cx="0" cy="-11" r="3.5" fill="#FFE066" stroke="#DAA520" strokeWidth="1"/>
          <circle cx="22" cy="-6" r="3" fill="#FFE066" stroke="#DAA520" strokeWidth="1"/>
        </g>
      )}
      
      {/* Frustrated eyebrows */}
      {isFrustrated && (
        <>
          <line x1="60" y1="35" x2="80" y2="45" stroke={colors.coral} strokeWidth="3" strokeLinecap="round">
            <animate attributeName="y1" values="35;33;35" dur="0.5s" repeatCount="indefinite"/>
          </line>
          <line x1="140" y1="35" x2="120" y2="45" stroke={colors.coral} strokeWidth="3" strokeLinecap="round">
            <animate attributeName="y1" values="35;33;35" dur="0.5s" repeatCount="indefinite"/>
          </line>
        </>
      )}
    </svg>
  );
};

export const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title = 'coming soon',
  subtitle = 'looks like someone made off with this page...'
}) => {
  const [phase, setPhase] = useState<CatPhase>('idle');

  useEffect(() => {
    const runSequence = () => {
      setPhase('idle');
      const timers = [
        setTimeout(() => setPhase('sneak'), 600),
        setTimeout(() => setPhase('grab'), 1600),
        setTimeout(() => setPhase('flee'), 2200),
        setTimeout(() => setPhase('loop'), 3200),
      ];
      return timers;
    };
    
    let timers = runSequence();
    const interval = setInterval(() => {
      timers.forEach(clearTimeout);
      timers = runSequence();
    }, 4500);
    
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  const hasCrown = phase === 'idle' || phase === 'sneak';
  const isFrustrated = phase === 'grab' || phase === 'flee' || phase === 'loop';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fonts.display,
        padding: '40px 20px',
        minHeight: '400px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scanlines overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0,255,204,0.015) 0px, rgba(0,255,204,0.015) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      />

      {/* Animation Scene */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        {/* Eye */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <SpirographEye hasCrown={hasCrown} isFrustrated={isFrustrated} />
        </div>

        {/* Cat */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: phase === 'idle' ? '-60px' :
                  phase === 'sneak' ? '60px' :
                  phase === 'grab' ? '140px' :
                  '550px',
            transition: phase === 'idle' ? 'none' : 
                       phase === 'flee' ? 'left 1s ease-in' :
                       'left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: 10,
          }}
        >
          <KawaiiCat 
            phase={phase} 
            holdingCrown={phase === 'grab' || phase === 'flee'} 
            size={70} 
          />
          
          {/* Speech bubbles */}
          {phase === 'sneak' && (
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: fonts.mono,
                fontSize: '10px',
                color: '#F5B366',
                whiteSpace: 'nowrap',
                opacity: 0.9,
              }}
            >
              *tippy taps*
            </div>
          )}
          {phase === 'flee' && (
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%) scaleX(-1)',
                fontFamily: fonts.mono,
                fontSize: '10px',
                color: '#F5B366',
                whiteSpace: 'nowrap',
              }}
            >
              nyoom~! ✧
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 700,
            color: isFrustrated ? colors.coral : colors.trust,
            textShadow: `0 0 40px ${isFrustrated ? colors.coralGlow : colors.trustGlow}`,
            margin: '0 0 8px 0',
            letterSpacing: '0.05em',
            transition: 'color 0.3s ease, text-shadow 0.3s ease',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: fonts.mono,
            fontSize: '12px',
            color: colors.starlightDim,
            maxWidth: '300px',
            lineHeight: 1.6,
            margin: '0 auto',
          }}
        >
          {subtitle}
          <br />
          <span style={{ color: '#F5B366' }}>( or maybe just the crown )</span>
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
