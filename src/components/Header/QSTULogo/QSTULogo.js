import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import GridLayer from './GridLayer';
import MarkLayer from './MarkLayer';
import './QSTULogo.css';
export default function QSTULogo({ onSelect }) {
    const [showMark, setShowMark] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const id = setTimeout(() => setShowMark(true), 2000);
        return () => clearTimeout(id);
    }, []);
    return (_jsx("div", { className: "qstu-root", onPointerDown: (e) => e.stopPropagation(), children: _jsxs("div", { className: "qstu-stage", children: [_jsx("div", { className: "qstu-grid-wrap", children: _jsx(GridLayer, { showSmiley: !showMark || open }) }), _jsx(MarkLayer, { visible: showMark, open: open, setOpen: setOpen, onSelect: onSelect })] }) }));
}
