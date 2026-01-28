import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/shared/ComingSoon.tsx
// Coming soon animation with spirograph eye and kawaii cat stealing crown
import { useState, useEffect, useMemo } from 'react';
import { colors, fonts } from '../../styles/tokens';
import { KawaiiCat } from './KawaiiCat';
// Spirograph path generator
const generateSpiroPaths = (count, cx, cy, scale = 1) => {
    const paths = [];
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
const SpirographEye = ({ hasCrown, isFrustrated }) => {
    const paths = useMemo(() => generateSpiroPaths(8, 100, 55, 1), []);
    return (_jsxs("svg", { width: "200", height: "110", viewBox: "0 0 200 110", style: { filter: 'drop-shadow(0 0 20px rgba(0, 255, 204, 0.2))' }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "crownGoldEye", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#FFE066" }), _jsx("stop", { offset: "50%", stopColor: "#FFD700" }), _jsx("stop", { offset: "100%", stopColor: "#E6B800" })] }), _jsxs("filter", { id: "eyeGlow", children: [_jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }), _jsxs("feMerge", { children: [_jsx("feMergeNode", { in: "coloredBlur" }), _jsx("feMergeNode", { in: "SourceGraphic" })] })] })] }), _jsx("path", { d: "M 10 55 Q 100 5 190 55 Q 100 105 10 55 Z", fill: "none", stroke: colors.starlight, strokeWidth: "1.5", opacity: "0.4" }), paths.map((d, idx) => (_jsx("path", { d: d, fill: "none", stroke: isFrustrated ? colors.coral : "rgba(0, 255, 204, 0.7)", strokeWidth: "1", style: {
                    mixBlendMode: 'screen',
                    opacity: 0.6,
                    transition: 'stroke 0.3s ease',
                } }, idx))), hasCrown && (_jsxs("g", { transform: "translate(100, 8)", filter: "url(#eyeGlow)", children: [_jsx("path", { d: "M -18 15 L -22 -6 L -11 5 L 0 -11 L 11 5 L 22 -6 L 18 15 Z", fill: "url(#crownGoldEye)", stroke: "#DAA520", strokeWidth: "1.5" }), _jsx("rect", { x: "-18", y: "12", width: "36", height: "7", rx: "2", fill: "#DAA520" }), _jsx("circle", { cx: "-9", cy: "15", r: "2.5", fill: colors.trust }), _jsx("circle", { cx: "0", cy: "15", r: "2.5", fill: colors.violet }), _jsx("circle", { cx: "9", cy: "15", r: "2.5", fill: colors.signal }), _jsx("circle", { cx: "-22", cy: "-6", r: "3", fill: "#FFE066", stroke: "#DAA520", strokeWidth: "1" }), _jsx("circle", { cx: "0", cy: "-11", r: "3.5", fill: "#FFE066", stroke: "#DAA520", strokeWidth: "1" }), _jsx("circle", { cx: "22", cy: "-6", r: "3", fill: "#FFE066", stroke: "#DAA520", strokeWidth: "1" })] })), isFrustrated && (_jsxs(_Fragment, { children: [_jsx("line", { x1: "60", y1: "35", x2: "80", y2: "45", stroke: colors.coral, strokeWidth: "3", strokeLinecap: "round", children: _jsx("animate", { attributeName: "y1", values: "35;33;35", dur: "0.5s", repeatCount: "indefinite" }) }), _jsx("line", { x1: "140", y1: "35", x2: "120", y2: "45", stroke: colors.coral, strokeWidth: "3", strokeLinecap: "round", children: _jsx("animate", { attributeName: "y1", values: "35;33;35", dur: "0.5s", repeatCount: "indefinite" }) })] }))] }));
};
export const ComingSoon = ({ title = 'coming soon', subtitle = 'looks like someone made off with this page...' }) => {
    const [phase, setPhase] = useState('idle');
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
    return (_jsxs("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fonts.display,
            padding: '40px 20px',
            minHeight: '400px',
            position: 'relative',
            overflow: 'hidden',
        }, children: [_jsx("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'repeating-linear-gradient(0deg, rgba(0,255,204,0.015) 0px, rgba(0,255,204,0.015) 1px, transparent 1px, transparent 3px)',
                    pointerEvents: 'none',
                    zIndex: 100,
                } }), _jsxs("div", { style: {
                    position: 'relative',
                    width: '100%',
                    maxWidth: '500px',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '32px',
                }, children: [_jsx("div", { style: { position: 'relative', zIndex: 1 }, children: _jsx(SpirographEye, { hasCrown: hasCrown, isFrustrated: isFrustrated }) }), _jsxs("div", { style: {
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
                        }, children: [_jsx(KawaiiCat, { phase: phase, holdingCrown: phase === 'grab' || phase === 'flee', size: 70 }), phase === 'sneak' && (_jsx("div", { style: {
                                    position: 'absolute',
                                    top: '-24px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontFamily: fonts.mono,
                                    fontSize: '10px',
                                    color: '#F5B366',
                                    whiteSpace: 'nowrap',
                                    opacity: 0.9,
                                }, children: "*tippy taps*" })), phase === 'flee' && (_jsx("div", { style: {
                                    position: 'absolute',
                                    top: '-24px',
                                    left: '50%',
                                    transform: 'translateX(-50%) scaleX(-1)',
                                    fontFamily: fonts.mono,
                                    fontSize: '10px',
                                    color: '#F5B366',
                                    whiteSpace: 'nowrap',
                                }, children: "nyoom~! \u2727" }))] })] }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("h2", { style: {
                            fontFamily: fonts.display,
                            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                            fontWeight: 700,
                            color: isFrustrated ? colors.coral : colors.trust,
                            textShadow: `0 0 40px ${isFrustrated ? colors.coralGlow : colors.trustGlow}`,
                            margin: '0 0 8px 0',
                            letterSpacing: '0.05em',
                            transition: 'color 0.3s ease, text-shadow 0.3s ease',
                        }, children: title }), _jsxs("p", { style: {
                            fontFamily: fonts.mono,
                            fontSize: '12px',
                            color: colors.starlightDim,
                            maxWidth: '300px',
                            lineHeight: 1.6,
                            margin: '0 auto',
                        }, children: [subtitle, _jsx("br", {}), _jsx("span", { style: { color: '#F5B366' }, children: "( or maybe just the crown )" })] })] })] }));
};
export default ComingSoon;
