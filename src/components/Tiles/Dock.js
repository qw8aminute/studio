import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { animated, useSprings } from '@react-spring/web';
import Card from '../Tiles/Card';
import './Dock.css';
function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}
export default function Dock({ items }) {
    const dockRef = useRef(null);
    const [isCoarse, setIsCoarse] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia?.('(pointer: coarse)');
        const update = () => setIsCoarse(Boolean(mq?.matches));
        update();
        mq?.addEventListener?.('change', update);
        return () => mq?.removeEventListener?.('change', update);
    }, []);
    const [springs, api] = useSprings(items.length, () => ({
        scale: 1,
        y: 0,
        config: { tension: 520, friction: 32 },
    }));
    const update = (clientX) => {
        if (!dockRef.current)
            return;
        const nodes = Array.from(dockRef.current.querySelectorAll('[data-dock-item]'));
        const centers = nodes.map((el) => {
            const r = el.getBoundingClientRect();
            return r.left + r.width / 2;
        });
        api.start((i) => {
            if (isCoarse || clientX == null)
                return { scale: 1, y: 0 };
            const d = Math.abs(clientX - centers[i]);
            const influence = 220;
            const t = clamp(1 - d / influence, 0, 1);
            return {
                scale: 1 + t * 0.55,
                y: -t * 14,
            };
        });
    };
    return (_jsx("div", { className: "dock-container", children: _jsx("div", { ref: dockRef, className: "dock", onMouseMove: (e) => update(e.clientX), onMouseLeave: () => update(null), "aria-label": "Dock", children: springs.map((s, i) => (_jsx(animated.button, { type: "button", className: "dock-card", "data-dock-item": true, onClick: items[i].onClick, style: {
                    transform: s.scale.to((k) => `translateY(${s.y.get()}px) scale(${k})`),
                }, "aria-label": items[i].alt ?? items[i].id, children: _jsx(Card, { src: items[i].src, alt: items[i].alt ?? '' }) }, items[i].id))) }) }));
}
