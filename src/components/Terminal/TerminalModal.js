import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Terminal/TerminalModal.tsx
import { useState } from 'react';
import { useTransition, useSpring, useChain, config, animated, useSpringRef, } from '@react-spring/web';
import './TerminalModal.css';
export default function TerminalModal({ isOpen, onClose, onMinimize, title, children }) {
    const [isMaximized, setIsMaximized] = useState(false);
    const springApi = useSpringRef();
    const modalSpring = useSpring({
        ref: springApi,
        config: config.stiff,
        from: {
            opacity: 0,
            scale: 0.8,
        },
        to: {
            opacity: isOpen ? 1 : 0,
            scale: isOpen ? 1 : 0.8,
        },
    });
    const transApi = useSpringRef();
    const contentTransition = useTransition(isOpen ? [1] : [], {
        ref: transApi,
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.gentle,
    });
    useChain(isOpen ? [springApi, transApi] : [transApi, springApi], [
        0,
        isOpen ? 0.15 : 0.1,
    ]);
    if (!isOpen && modalSpring.opacity.get() === 0)
        return null;
    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };
    const handleMinimize = () => {
        if (onMinimize) {
            onMinimize();
        }
        else {
            onClose();
        }
    };
    return (_jsx("div", { className: "terminal-canvas", children: _jsx(animated.div, { className: `terminal-window ${isMaximized ? 'maximized' : ''}`, style: {
                opacity: modalSpring.opacity,
                transform: modalSpring.scale.to(s => `scale(${s})`),
            }, children: contentTransition((style, item) => item ? (_jsxs(animated.div, { className: "terminal-content", style: style, children: [_jsxs("div", { className: "terminal-header", children: [_jsxs("div", { className: "terminal-controls", children: [_jsx("button", { className: "terminal-btn close", onClick: onClose, title: "Close" }), _jsx("button", { className: "terminal-btn minimize", onClick: handleMinimize, title: "Minimize" }), _jsx("button", { className: "terminal-btn maximize", onClick: handleMaximize, title: isMaximized ? "Restore" : "Maximize" })] }), _jsx("div", { className: "terminal-title", children: title })] }), _jsx("div", { className: "terminal-body", children: children })] })) : null) }) }));
}
