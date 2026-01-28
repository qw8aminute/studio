import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import './AboutTerminal.css';
const Icons = {
    user: (_jsxs("svg", { className: "about-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [_jsx("path", { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }), _jsx("circle", { cx: "12", cy: "7", r: "4" })] })),
    location: (_jsxs("svg", { className: "about-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [_jsx("path", { d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" }), _jsx("circle", { cx: "12", cy: "9", r: "2.5" })] })),
    rocket: (_jsxs("svg", { className: "about-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [_jsx("path", { d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" }), _jsx("path", { d: "M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" }), _jsx("path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" })] })),
    chart: (_jsx("svg", { className: "about-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: _jsx("path", { d: "M18 20V10M12 20V4M6 20v-6" }) })),
    sparkle: (_jsx("svg", { className: "about-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: _jsx("path", { d: "M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" }) })),
    code: (_jsxs("svg", { className: "about-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [_jsx("polyline", { points: "16,18 22,12 16,6" }), _jsx("polyline", { points: "8,6 2,12 8,18" })] })),
    heart: (_jsx("svg", { className: "about-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: _jsx("path", { d: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" }) })),
};
const beliefs = [
    { icon: 'rocket', text: 'Strategy means nothing without shipping' },
    { icon: 'chart', text: 'Data should change behavior, not just fill dashboards' },
    { icon: 'sparkle', text: 'The best brand work doesn\'t feel like marketing' },
    { icon: 'code', text: 'Code is a creative tool, not just a technical one' },
];
export default function AboutTerminal() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    return (_jsxs("div", { className: `about-terminal ${mounted ? 'mounted' : ''}`, children: [_jsxs("header", { className: "about-header", children: [_jsx("div", { className: "about-avatar", children: _jsx("img", { src: "/images/quaite.jpg", alt: "Quaite Dodson", className: "about-avatar-img" }) }), _jsxs("div", { className: "about-intro", children: [_jsx("h1", { className: "about-name", children: "Quaite Dodson" }), _jsxs("div", { className: "about-location", children: [Icons.location, _jsx("span", { children: "Albuquerque, NM" })] })] })] }), _jsx("section", { className: "about-section", children: _jsx("p", { className: "about-mission", children: "I find what's slowing down growth, flip the team toward momentum, and build the product/data/brand pieces so it sticks." }) }), _jsxs("section", { className: "about-section", children: [_jsx("h2", { className: "about-section-title", children: "What I believe" }), _jsx("ul", { className: "about-beliefs", children: beliefs.map((belief, idx) => (_jsxs("li", { className: "belief-item", style: { animationDelay: `${idx * 0.1}s` }, children: [_jsx("span", { className: "belief-icon", children: Icons[belief.icon] }), _jsx("span", { className: "belief-text", children: belief.text })] }, idx))) })] }), _jsx("section", { className: "about-section about-personal", children: _jsxs("div", { className: "personal-item", children: [Icons.heart, _jsx("span", { children: "Dad since 2017. Advanced degree in patience, play, and perspective." })] }) }), _jsxs("div", { className: "about-footer", children: [_jsx("span", { className: "prompt-symbol", children: "\u276F" }), _jsx("span", { className: "prompt-path", children: "~/about" }), _jsx("span", { className: "prompt-cursor", children: "_" })] })] }));
}
