// src/components/Terminal/CardComponents/MachinasContent.tsx
// MACHINAS - 4 embedded projects: DATA, LOYALTY, PRODUCT, CRAYON
import { useState } from 'react';
import './MachinasContent.css';

type Tab = 'data' | 'loyalty' | 'product' | 'crayon';
type ProductDemo = 'clickydemo' | 'noisydemo';

// Custom SVG icons
const CursorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
    <path d="M13.58 13.58L18 18" />
  </svg>
);

const MusicNoteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const MACHINA_URLS = {
  crayon: 'https://crayon.qdfafo.com',
  data: 'https://data.qdfafo.com',
  loyalty: 'https://loyalty.qdfafo.com',
  clickydemo: 'https://demo.thethirdai.org',
  noisydemo: 'https://www.youtube-nocookie.com/embed/NlrsckVSMbY',
};

const tabInfo = {
  data: {
    label: 'DATA',
    desc: 'live executive dashboard ',
    color: 'var(--qd-cyan)',
  },
  loyalty: {
    label: 'LOYALTY',
    desc: 'member journey - loyalty program',
    color: 'var(--qd-violet, #8b5cf6)',
  },
  product: {
    label: 'PRODUCT',
    desc: 'thirdai behavioral intelligence',
    color: 'var(--qd-coral, #f87171)',
  },
  crayon: {
    label: 'crayON',
    desc: 'draw for free',
    color: 'var(--qd-amber, #f59e0b)',
  },
};

// Crayon showcase images
const CRAYON_IMAGES = [
  { src: '/lightdarklight.gif', alt: 'Animated sun and ground' },
  { src: '/lookmom.png', alt: 'Look I made msPaint drawing' },
  { src: '/candleheart.png', alt: 'Neon heart on starry background' },
];

export default function MachinasContent() {
  const [activeTab, setActiveTab] = useState<Tab>('data');
  const [productDemo, setProductDemo] = useState<ProductDemo>('clickydemo');

  const getIframeSrc = () => {
    if (activeTab === 'product') {
      return MACHINA_URLS[productDemo];
    }
    if (activeTab === 'crayon') {
      return MACHINA_URLS.crayon;
    }
    return MACHINA_URLS[activeTab];
  };

  // Render Crayon showcase - 2x2 grid with 3 images + live canvas
  const renderCrayonShowcase = () => (
    <div className="crayon-showcase">
      <div className="crayon-header">
        <h3 className="crayon-title">crayON — draw for free</h3>
        <p className="crayon-intro">
          <strong>a free, privacy-first drawing tool</strong> that exists because creative expression
          shouldn't require accounts, subscriptions, or data collection. built for quick sketches,
          ideation, and visual thinking without friction. exports to PNG or animated GIF.
        </p>
      </div>
      <div className="crayon-grid">
        {CRAYON_IMAGES.map((img, idx) => (
          <div key={idx} className="crayon-cell">
            <img src={img.src} alt={img.alt} className="crayon-img" />
          </div>
        ))}
        <div className="crayon-cell crayon-live">
          <iframe
            src={MACHINA_URLS.crayon}
            title="Crayon canvas"
            className="crayon-iframe"
          />
          <a
            href={MACHINA_URLS.crayon}
            target="_blank"
            rel="noopener noreferrer"
            className="crayon-open-btn"
            title="Open in new tab"
          >
            ↗
          </a>
        </div>
      </div>
    </div>
  );

  // Render the clickydemo vertical view
  const renderClickyDemo = () => (
    <div className="clicky-vertical">
      {/* iPhone Mockup - Compact */}
      <div className="iphone-section">
        <div className="iphone-frame">
          <div className="iphone-notch">
            <div className="notch-camera" />
          </div>
          <div className="iphone-screen">
            <iframe
              src={MACHINA_URLS.clickydemo}
              title="thirdAI demo"
              className="iphone-iframe"
            />
          </div>
          <div className="iphone-home-indicator" />
        </div>
      </div>

      {/* Compact Case Study */}
      <div className="case-compact">
        <div className="case-header">
          <div className="case-brand">
            <span className="brand-icon"><EyeIcon /></span>
            <span className="brand-name">thirdAI</span>
            <span className="brand-divider">·</span>
            <span className="brand-tagline">behavioral pattern detection</span>
          </div>
        </div>

        <p className="case-hook">
          see the patterns you can't see. interrupt them if you choose.
        </p>

        <div className="case-stats">
          <div className="stat"><span className="stat-num">8</span> phases</div>
          <div className="stat"><span className="stat-num">12</span> emotions</div>
          <div className="stat"><span className="stat-num">0</span> servers</div>
        </div>

        <div className="case-desc">
          <p>
            <strong>privacy-first behavioral intelligence.</strong> an adaptive AI eye 
            that surfaces unconscious patterns across money, time, and attention. 
            all processing happens locally—no cloud, no surveillance.
          </p>
        </div>

        <div className="case-footer">
          <div className="tech-row">
            <span className="tech-tag">react</span>
            <span className="tech-tag">typescript</span>
            <span className="tech-tag">d3.js</span>
            <span className="tech-tag">canvas</span>
          </div>
          <a 
            href="https://demo.thethirdai.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="case-cta"
          >
            open demo <ArrowIcon />
          </a>
        </div>
      </div>
    </div>
  );

  // Render default iframe view (for DATA, LOYALTY, noisydemo)
  const renderDefaultView = () => (
    <>
      <div className="machinas-preview">
        <div className="preview-chrome">
          <div className="chrome-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="chrome-url">{getIframeSrc().replace('https://', '')}</span>
          <a 
            href={getIframeSrc()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="chrome-external"
          >
            ↗
          </a>
        </div>
        <div className="preview-viewport">
          <iframe
            src={getIframeSrc()}
            title={`${activeTab} preview`}
            className="preview-iframe"
          />
        </div>
      </div>

      <div className="machinas-description">
        {activeTab === 'data' && (
          <p>
            Live API-powered dashboard for executive decision making. 
            React + D3.js with real-time data visualization.
          </p>
        )}
        {activeTab === 'loyalty' && (
          <p>
            The Sunward+ loyalty program that drove ~$500M in new assets. 
            Interactive member journey from awareness through advocacy.
          </p>
        )}
        {activeTab === 'product' && productDemo === 'noisydemo' && (
          <p>
            Blues Traveler inspired audio-reactive experience. 
            Sound-driven visualizations responding to ambient audio.
          </p>
        )}
      </div>
    </>
  );

  return (
    <div className="machinas-content">
      {/* Tab Navigation */}
      <div className="machinas-tabs">
        {(['data', 'loyalty', 'product', 'crayon'] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={`machinas-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ '--tab-color': tabInfo[tab].color } as React.CSSProperties}
          >
            <span className="tab-label">{tabInfo[tab].label}</span>
            <span className="tab-desc">{tabInfo[tab].desc}</span>
          </button>
        ))}
      </div>

      {/* Product Demo Switcher */}
      {activeTab === 'product' && (
        <div className="product-switcher">
          <button
            className={`demo-btn ${productDemo === 'clickydemo' ? 'active' : ''}`}
            onClick={() => setProductDemo('clickydemo')}
          >
            <span className="demo-icon"><CursorIcon /></span>
            clickydemo
          </button>
          <button
            className={`demo-btn ${productDemo === 'noisydemo' ? 'active' : ''}`}
            onClick={() => setProductDemo('noisydemo')}
          >
            <span className="demo-icon"><MusicNoteIcon /></span>
            noisydemo
          </button>
        </div>
      )}

      {/* Content Area */}
      {activeTab === 'crayon' && renderCrayonShowcase()}
      {activeTab === 'product' && productDemo === 'clickydemo' && renderClickyDemo()}
      {(activeTab === 'data' || activeTab === 'loyalty' || (activeTab === 'product' && productDemo === 'noisydemo')) && renderDefaultView()}
    </div>
  );
}