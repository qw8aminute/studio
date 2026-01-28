import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Card.css';
export default function Card({ src, alt = '' }) {
    return (_jsxs("div", { className: "card-wrapper", children: [_jsx("img", { src: src, alt: alt, draggable: false }), _jsx("div", { className: "duotone-filter" }), _jsx("div", { className: "card-shine" }), _jsx("div", { className: "card-glow-border" })] }));
}
