import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './StatsButton.css';
export default function StatsButton({ onClick, throwCount }) {
    return (_jsxs("button", { className: "stats-button", onClick: onClick, "aria-label": "View throw statistics", children: [_jsx("span", { className: "stats-text", children: "Stats" }), throwCount > 0 && (_jsx("span", { className: "stats-badge", children: throwCount }))] }));
}
