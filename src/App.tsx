// src/App.tsx
import { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import DualityCanvas from './components/Background/DualityCanvas';
import Home from './pages/Home';
import TerminalModal from './components/Terminal/TerminalModal';
import { AboutTerminal, ContactTerminal, ResumeTerminal } from './components/Terminal/Screens';

type Panel = 'about' | 'contact' | 'resume' | 'linkedin404' | null;

export default function App() {
  const [panel, setPanel] = useState<Panel>(null);

  const title = useMemo(() => {
    if (panel === 'about') return 'ORIGIN';
    if (panel === 'contact') return 'SIGNAL';
    if (panel === 'resume') return 'PROOF';
    if (panel === 'linkedin404') return '404 NO LINK';
    return '';
  }, [panel]);

  const closePanel = () => setPanel(null);

  return (
    <Router>
      <DualityCanvas />

      <Header
        transparent
        onOpenPanel={(p) => setPanel(p)}
      />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      {/* Header panels - About, Contact, Resume */}
      <TerminalModal
        isOpen={panel !== null}
        title={title}
        onClose={closePanel}
        onMinimize={closePanel}
      >
        {panel === 'about' && <AboutTerminal />}
        {panel === 'contact' && (
          <ContactTerminal onLinkedIn404={() => setPanel('linkedin404')} />
        )}
        {panel === 'resume' && (
          <ResumeTerminal onLinkedIn404={() => setPanel('linkedin404')} />
        )}
        {panel === 'linkedin404' && (
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
            }}>
              404 no link
            </div>
            <div style={{
              marginTop: '14px',
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid rgba(110,224,255,0.18)',
              background: 'rgba(0,0,0,0.18)'
            }}>
              <div style={{ opacity: 0.75 }}>$msft didnt pay me ¯\_(ツ)_/¯</div>
              <div style={{ marginTop: '18px', color: 'rgba(110,224,255,0.75)' }}>qdfafo ~ %</div>
            </div>
          </div>
        )}
      </TerminalModal>
    </Router>
  );
}
