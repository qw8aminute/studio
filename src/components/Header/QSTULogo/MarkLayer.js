import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { animated, useSpring } from '@react-spring/web';
const isCoarsePointer = () => typeof window !== 'undefined' &&
    window.matchMedia?.('(pointer: coarse)').matches;
export default function MarkLayer({ visible, open, setOpen, onSelect }) {
    const fade = useSpring({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px) scale(1)' : 'translateY(6px) scale(0.985)',
        config: { tension: 260, friction: 26 },
    });
    const menu = useSpring({
        opacity: open ? 1 : 0,
        maxHeight: open ? 240 : 0,
        transform: open ? 'translateY(0px) scale(1)' : 'translateY(-10px) scale(0.985)',
        config: { tension: 320, friction: 26 },
    });
    const onPointerDown = (e) => {
        // tap-to-toggle only on coarse pointer devices (mobile/tablet)
        if (!isCoarsePointer())
            return;
        e.preventDefault();
        e.stopPropagation();
        setOpen(!open);
    };
    const onMouseEnter = () => {
        // hover-to-open only on fine pointers (desktop/laptop)
        if (isCoarsePointer())
            return;
        setOpen(true);
    };
    const onMouseLeave = () => {
        if (isCoarsePointer())
            return;
        setOpen(false);
    };
    const pick = (panel) => {
        onSelect?.(panel);
        setOpen(false);
    };
    return (_jsx(animated.div, { className: "qstu-mark-layer", style: fade, children: _jsxs("div", { className: "qstu-mark", role: "button", tabIndex: 0, "aria-expanded": open, onPointerDown: onPointerDown, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onKeyDown: (e) => {
                if (e.key === 'Escape')
                    setOpen(false);
                if (e.key === 'Enter' || e.key === ' ')
                    setOpen(!open);
            }, children: [_jsxs("div", { className: `qstu-text ${open ? 'is-hidden' : ''}`, children: [_jsx("div", { children: "QS" }), _jsx("div", { children: "TU" })] }), _jsx(animated.div, { className: `qstu-menu ${open ? 'is-open' : ''}`, style: menu, "aria-hidden": !open, onPointerDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: _jsxs("div", { className: "menu-inner", children: [_jsx("button", { className: "menu-item", type: "button", onClick: () => pick('about'), children: "About" }), _jsx("button", { className: "menu-item", type: "button", onClick: () => pick('contact'), children: "Contact" }), _jsx("button", { className: "menu-item", type: "button", onClick: () => pick('resume'), children: "Resume" })] }) })] }) }));
}
