import { useMemo, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import DualityCanvas from './components/Background/DualityCanvas'
import Home from './pages/Home'
import TheTemplates from './components/Terminal/TheTemplates/TheTemplates'
import {
  TuneUpLanding,
  BrandEngineLanding,
  MicroTeachingLanding,
  ABQVisualsLanding,
  ExperimentsLanding,
} from './pages/sections'

import TerminalModal from './components/Terminal/TerminalModal'
import AboutTerminal from './components/Terminal/Screens/AboutTerminal'
import ContactTerminal from './components/Terminal/Screens/ContactTerminal'
import ResumeTerminal from './components/Terminal/Screens/ResumeTerminal'
import MiniTemplatesLanding from './pages/sections/MiniTemplatesLanding'

type Panel = 'about' | 'contact' | 'resume' | 'templates' | 'linkedin404' | null

export default function App() {
  const [panel, setPanel] = useState<Panel>(null)

  const title = useMemo(() => {
    if (panel === 'about') return 'ABOUT ME'
    if (panel === 'contact') return 'CONTACT'
    if (panel === 'resume') return 'RESUME'
    if (panel === 'templates') return 'THE TEMPLATES'
    if (panel === 'linkedin404') return '404 NO LINK'
    return ''
  }, [panel])

  const closePanel = () => setPanel(null)

  return (
    <Router>
      <DualityCanvas />

      <Header
        transparent
        onOpenPanel={(p) => setPanel(p)}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<MiniTemplatesLanding />} />
        <Route path="/tuneup" element={<TuneUpLanding />} />
        <Route path="/brand-engine" element={<BrandEngineLanding />} />
        <Route path="/micro-teaching" element={<MicroTeachingLanding />} />
        <Route path="/abq-visuals" element={<ABQVisualsLanding />} />
        <Route path="/experiments" element={<ExperimentsLanding />} />
      </Routes>

      {/* Global terminal shell for header panels */}
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
        {panel === 'resume' && <ResumeTerminal />}
        {panel === 'templates' && <TheTemplates />}
        {panel === 'linkedin404' && (
          <div style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "SF Mono", "Courier New", monospace',
            color: 'rgba(210,245,255,0.92)',
            letterSpacing: '0.02em',
            lineHeight: 1.35,
          }}>
            <div style={{ color: 'rgba(110,224,255,0.85)', letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.82rem' }}>
              404 no link
            </div>
            <div style={{ marginTop: 14, padding: 14, borderRadius: 14, border: '1px solid rgba(110,224,255,0.18)', background: 'rgba(0,0,0,0.18)' }}>
              <div style={{ opacity: 0.75 }}>$msft didnt pay me ¯\_(ツ)_/¯</div>
              <div style={{ marginTop: 18, color: 'rgba(110,224,255,0.75)' }}>qdfafo ~ %</div>
            </div>
          </div>
        )}
      </TerminalModal>
    </Router>
  )
}