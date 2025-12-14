import type { LiquidTileProps } from '../../types';
import './LiquidTile.css';

export default function LiquidTile({ 
  title, 
  subtitle, 
  videoSrc, 
  themeColor, 
  onClick 
}: LiquidTileProps) {
  return (
    <div 
      className="liquid-tile" 
      onClick={onClick}
      style={{ 
        '--theme-color': themeColor,
        '--fallback-bg': themeColor 
      } as React.CSSProperties}
    >
      <video 
        className="tile-video" 
        autoPlay 
        loop 
        muted 
        playsInline
        onError={(e) => {
          // Hide video on error, show gradient fallback
          e.currentTarget.style.display = 'none';
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="tile-fallback" />
      <div className="tile-overlay" />
      <div className="tile-content">
        <h3 className="tile-title">{title}</h3>
        {subtitle && <p className="tile-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
