import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useMemo, useRef } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import * as d3 from 'd3';
import QSTULogo from '../../Header/QSTULogo/QSTULogo';
import './OmegaloopsTerminal.css';
/* ========== MINI VISUALS ========== */
function ThirdAIVisual() {
    const paths = useMemo(() => {
        const result = [];
        const cx = 150;
        const cy = 100;
        for (let i = 0; i < 8; i++) {
            const a = 2 + (i % 4);
            const b = 3 + ((i + 1) % 5);
            const ampX = 60 + i * 3;
            const ampY = 40 + i * 2.5;
            const rot = (i * Math.PI) / 28;
            let d = 'M ';
            for (let t = 0; t <= 360; t += 2) {
                const rad = (Math.PI * 2 * t) / 360;
                const x0 = ampX * Math.sin(a * rad);
                const y0 = ampY * Math.sin(b * rad + Math.PI / 3);
                const x = x0 * Math.cos(rot) - y0 * Math.sin(rot) + cx;
                const y = x0 * Math.sin(rot) + y0 * Math.cos(rot) + cy;
                d += t === 0 ? `${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
            }
            result.push(d);
        }
        return result;
    }, []);
    return (_jsxs("div", { className: "project-visual thirdai-visual", children: [_jsxs("svg", { viewBox: "0 0 300 200", preserveAspectRatio: "xMidYMid meet", children: [_jsx("path", { d: "M 20 100 Q 150 20 280 100 Q 150 180 20 100 Z", fill: "none", stroke: "rgba(242, 239, 232, 0.9)", strokeWidth: "1.5", opacity: "0.55" }), paths.map((d, idx) => (_jsx("path", { d: d, fill: "none", stroke: "rgba(255, 255, 255, 0.8)", strokeWidth: "1", className: "spiro-path", style: { animationDelay: `${idx * 0.22}s` } }, idx)))] }), _jsx("div", { className: "do-not-press", children: "DO NOT PRESS" })] }));
}
function CalcQonVisual() {
    const containerRef = useRef(null);
    useEffect(() => {
        if (!containerRef.current)
            return;
        const width = 360;
        const height = 220;
        const radius = 2.4;
        const data = [];
        const theta = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < 620; i++) {
            const r = 3.2 * Math.sqrt(i);
            const a = theta * i;
            data.push([width / 2 + r * Math.cos(a), height / 2 + r * Math.sin(a)]);
        }
        d3.select(containerRef.current).selectAll('*').remove();
        let currentTransform = [width / 2, height / 2, height];
        const svg = d3
            .select(containerRef.current)
            .append('svg')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('width', '100%')
            .style('height', '100%');
        const g = svg.append('g');
        g.selectAll('circle')
            .data(data)
            .join('circle')
            .attr('cx', ([x]) => x)
            .attr('cy', ([, y]) => y)
            .attr('r', radius)
            .attr('fill', (_, i) => d3.interpolateWarm(i / data.length))
            .attr('opacity', 0.92);
        function transform([x, y, r]) {
            return `translate(${width / 2}, ${height / 2}) scale(${height / r}) translate(${-x}, ${-y})`;
        }
        let stop = false;
        function transition() {
            if (stop)
                return;
            const d = data[Math.floor(Math.random() * data.length)];
            const target = [d[0], d[1], radius * 2 + 1];
            const i = d3.interpolateZoom(currentTransform, target);
            g.transition()
                .delay(220)
                .duration(i.duration)
                .ease(d3.easeCubicInOut)
                .attrTween('transform', () => (t) => {
                currentTransform = i(t);
                return transform(currentTransform);
            })
                .on('end', transition);
        }
        transition();
        return () => {
            stop = true;
            g.interrupt();
        };
    }, []);
    return _jsx("div", { ref: containerRef, className: "project-visual calcqon-visual" });
}
function DrumCanonVisual() {
    const bars = Array.from({ length: 14 }, (_, i) => i);
    const colors = ['#86efac', '#67e8f9', '#c084fc', '#fb7185'];
    return (_jsx("div", { className: "project-visual drumcanon-visual", children: _jsx("div", { className: "waveform-container", children: bars.map((i) => (_jsx("div", { className: "wave-bar", style: {
                    animationDelay: `${i * 0.075}s`,
                    background: `linear-gradient(180deg, ${colors[i % colors.length]} 0%, rgba(0,0,0,0) 100%)`,
                } }, i))) }) }));
}
const PROJECTS = [
    {
        id: 'thirdai',
        name: 'thirdAI',
        url: 'thethirdai.org',
        fullUrl: 'https://thethirdai.org',
        tagline: 'cooperative association',
        description: 'thirdAI is a cooperative building privacy-first behavioral awareness tools. We help people see their own patterns—spending, screen time, sleep, stress—without selling their data to advertisers. Member-owned, ad-free, built for humans who want to understand themselves better.',
        Visual: ThirdAIVisual,
    },
    {
        id: 'calcqon',
        name: 'calcQon',
        url: 'calcqon.com',
        fullUrl: 'https://calcqon.com',
        tagline: 'quantum problem calculator',
        description: 'calcQon transforms messy regional crises—water rights, housing allocation, energy grids—into structured optimization problems. It picks the right quantum or hybrid solver so teams can test scenarios before committing real dollars.',
        Visual: CalcQonVisual,
    },
    {
        id: 'drumcanon',
        name: 'Drum Canon',
        url: 'drumcanon.org',
        fullUrl: 'https://drumcanon.org',
        tagline: 'music therapy',
        description: "Drum Canon explores rhythm as medicine. Turn any tap, hum, or movement into music—instantly. We're researching how drumming patterns support cognitive health, emotional regulation, and human connection.",
        Visual: DrumCanonVisual,
    },
];
/* ========== MAIN COMPONENT ========== */
export default function ExperimentTerminal() {
    const parallaxRef = useRef(null);
    const totalPages = PROJECTS.length + 1;
    const scrollToPage = (pageIndex) => {
        parallaxRef.current?.scrollTo(pageIndex);
    };
    // Snap to nearest page after user stops scrolling
    useEffect(() => {
        const el = parallaxRef.current?.container?.current;
        if (!el)
            return;
        let timeoutId = null;
        const onScroll = () => {
            if (timeoutId)
                window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                const pageH = el.clientHeight || 1;
                const raw = el.scrollTop / pageH;
                const nearest = Math.round(raw);
                // Only snap if they're meaningfully between pages
                if (Math.abs(raw - nearest) > 0.02) {
                    scrollToPage(nearest);
                }
            }, 120);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            if (timeoutId)
                window.clearTimeout(timeoutId);
            el.removeEventListener('scroll', onScroll);
        };
    }, []);
    return (_jsx("div", { className: "experiment-terminal", children: _jsxs(Parallax, { ref: parallaxRef, pages: totalPages, className: "experiment-parallax", children: [_jsx(ParallaxLayer, { offset: 0, speed: 0, factor: totalPages, className: "layer-stars" }), _jsx(ParallaxLayer, { offset: 0.3, speed: 0.06, factor: totalPages, className: "layer-nebula layer-nebula--purple" }), _jsx(ParallaxLayer, { offset: 0, speed: 0.12, className: "page-layer", children: _jsxs("div", { className: "page-content page-content--intro", children: [_jsx("div", { className: "intro-badge", children: "OMEGALOOPS" }), _jsx("div", { className: "intro-logo", children: _jsx(QSTULogo, {}) }), _jsx("h1", { className: "intro-title", children: "Experiments" }), _jsx("p", { className: "intro-subtitle", children: "Side projects, explorations, and things I'm building in the open." }), _jsx("nav", { className: "intro-nav", children: PROJECTS.map((p, i) => (_jsx("button", { className: "intro-nav-btn", onClick: () => scrollToPage(i + 1), children: p.name }, p.id))) }), _jsx("button", { className: "scroll-cue", onClick: () => scrollToPage(1), "aria-label": "Scroll to first project", children: _jsx("span", { className: "scroll-cue-arrow", children: "\u2193" }) })] }) }), PROJECTS.map((project, index) => {
                    const pageOffset = index + 1;
                    const Visual = project.Visual;
                    return (_jsxs(React.Fragment, { children: [_jsx(ParallaxLayer, { offset: pageOffset, speed: 0.12, className: "page-layer", children: _jsxs("div", { className: "page-content page-content--project", children: [_jsxs("header", { className: "project-header", children: [_jsx("button", { className: "header-back", onClick: () => scrollToPage(0), children: "\u2190 Experiments" }), _jsx("nav", { className: "header-dots", children: PROJECTS.map((_, i) => (_jsx("button", { className: `dot ${i === index ? 'dot--active' : ''}`, onClick: () => scrollToPage(i + 1), "aria-label": `Go to project ${i + 1}` }, i))) })] }), _jsxs("div", { className: "project-grid", children: [_jsxs("div", { className: "project-main", children: [_jsxs("div", { className: "project-copy", children: [_jsx("span", { className: "project-tagline", children: project.tagline }), _jsx("h2", { className: "project-name", children: project.name }), _jsx("p", { className: "project-desc", children: project.description }), _jsxs("a", { href: project.fullUrl, target: "_blank", rel: "noopener noreferrer", className: "project-cta", children: ["Explore ", project.name, " \u2192"] })] }), _jsx("div", { className: "project-visual-wrap", children: _jsx(Visual, {}) })] }), _jsx("div", { className: "project-preview", children: _jsxs("div", { className: "preview-window", children: [_jsxs("div", { className: "preview-titlebar", children: [_jsxs("div", { className: "preview-dots", children: [_jsx("span", { className: "preview-dot preview-dot--red" }), _jsx("span", { className: "preview-dot preview-dot--yellow" }), _jsx("span", { className: "preview-dot preview-dot--green" })] }), _jsx("span", { className: "preview-url", children: project.url })] }), _jsx("iframe", { src: project.fullUrl, title: project.name, className: "preview-iframe", loading: "lazy" }), _jsxs("a", { href: project.fullUrl, target: "_blank", rel: "noopener noreferrer", className: "preview-overlay", children: ["Visit ", project.url, " \u2192"] })] }) })] })] }) }), _jsxs(ParallaxLayer, { offset: pageOffset, speed: -0.04, className: "layer-accent", children: [_jsx("div", { className: "accent-orb accent-orb--1", style: { ['--hue']: index * 40 } }), _jsx("div", { className: "accent-orb accent-orb--2", style: { ['--hue']: index * 40 + 180 } })] })] }, project.id));
                })] }) }));
}
