import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './LiquidTile.css';
export default function LiquidTile({ title, subtitle, videoSrc, themeColor, onClick }) {
    return (_jsxs("div", { className: "liquid-tile", onClick: onClick, style: {
            '--theme-color': themeColor,
            '--fallback-bg': themeColor
        }, children: [_jsx("video", { className: "tile-video", autoPlay: true, loop: true, muted: true, playsInline: true, onError: (e) => {
                    // Hide video on error, show gradient fallback
                    e.currentTarget.style.display = 'none';
                }, children: _jsx("source", { src: videoSrc, type: "video/mp4" }) }), _jsx("div", { className: "tile-fallback" }), _jsx("div", { className: "tile-overlay" }), _jsxs("div", { className: "tile-content", children: [_jsx("h3", { className: "tile-title", children: title }), subtitle && _jsx("p", { className: "tile-subtitle", children: subtitle })] })] }));
}
