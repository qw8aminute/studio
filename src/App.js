import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
import { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import DualityCanvas from './components/Background/DualityCanvas';
import Home from './pages/Home';
import TerminalModal from './components/Terminal/TerminalModal';
import { AboutTerminal, ContactTerminal, ResumeTerminal } from './components/Terminal/Screens';
export default function App() {
    const [panel, setPanel] = useState(null);
    const title = useMemo(() => {
        if (panel === 'about')
            return 'ORIGIN';
        if (panel === 'contact')
            return 'SIGNAL';
        if (panel === 'resume')
            return 'PROOF';
        if (panel === 'linkedin404')
            return '404 NO LINK';
        return '';
    }, [panel]);
    const closePanel = () => setPanel(null);
    return (_jsxs(Router, { children: [_jsx(DualityCanvas, {}), _jsx(Header, { transparent: true, onOpenPanel: (p) => setPanel(p) }), _jsx(Routes, { children: _jsx(Route, { path: "/", element: _jsx(Home, {}) }) }), _jsxs(TerminalModal, { isOpen: panel !== null, title: title, onClose: closePanel, onMinimize: closePanel, children: [panel === 'about' && _jsx(AboutTerminal, {}), panel === 'contact' && (_jsx(ContactTerminal, { onLinkedIn404: () => setPanel('linkedin404') })), panel === 'resume' && (_jsx(ResumeTerminal, { onLinkedIn404: () => setPanel('linkedin404') })), panel === 'linkedin404' && (_jsxs("div", { style: {
                            padding: '2rem',
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                            color: 'rgba(210,245,255,0.92)',
                        }, children: [_jsx("div", { style: {
                                    color: 'rgba(110,224,255,0.85)',
                                    letterSpacing: '0.16em',
                                    textTransform: 'uppercase',
                                    fontSize: '0.82rem',
                                }, children: "404 no link" }), _jsxs("div", { style: {
                                    marginTop: '14px',
                                    padding: '14px',
                                    borderRadius: '14px',
                                    border: '1px solid rgba(110,224,255,0.18)',
                                    background: 'rgba(0,0,0,0.18)'
                                }, children: [_jsx("div", { style: { opacity: 0.75 }, children: "$msft didnt pay me \u00AF\\_(\u30C4)_/\u00AF" }), _jsx("div", { style: { marginTop: '18px', color: 'rgba(110,224,255,0.75)' }, children: "qdfafo ~ %" })] })] }))] })] }));
}
