import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { TAROT_CARDS } from '../../../types';
import StatsButton from './StatsButton';
import StatsModal from './StatsModal';
import './CardStack.css';
// Initial stack position
const to = (i) => ({
    x: 0,
    y: i * -4,
    z: 0,
    scale: 1,
    rotX: 0,
    rotY: 0,
    rotZ: -6 + Math.random() * 12,
    opacity: 1,
    delay: i * 100,
});
// Cards fly in from random directions
const from = (i) => {
    const angle = (i * 137.5) % 360; // Golden angle distribution
    const distance = 800;
    return {
        x: Math.cos((angle * Math.PI) / 180) * distance,
        y: Math.sin((angle * Math.PI) / 180) * distance,
        z: -500,
        scale: 0.3,
        rotX: Math.random() * 360,
        rotY: Math.random() * 360,
        rotZ: Math.random() * 360,
        opacity: 0,
    };
};
// 3D transform with full rotation control
const trans = (x, y, z, rotX, rotY, rotZ, s) => `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${s})`;
export default function CardStack({ onCardSelect }) {
    const cards = TAROT_CARDS;
    const [cardStates, setCardStates] = useState(() => cards.map(() => ({ gone: false, distance: 0, angle: 0 })));
    const [showDistance, setShowDistance] = useState(null);
    const [currentManipulation, setCurrentManipulation] = useState(null);
    const [sessionThrows, setSessionThrows] = useState([]);
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [recordToast, setRecordToast] = useState(null);
    const lastTapTime = useRef(0);
    const dragStartPos = useRef({ x: 0, y: 0 });
    // Create card names map for stats display
    const cardNames = new Map(cards.map(card => [card.id, card.id]));
    const [springs, api] = useSprings(cards.length, i => ({
        ...to(i),
        from: from(i),
    }));
    // Haptic feedback
    const haptic = useCallback((ms = 10) => {
        if ('vibrate' in navigator)
            navigator.vibrate(ms);
    }, []);
    // Calculate throw distance based on velocity and angle
    const calculateDistance = (vx, vy) => {
        const totalVelocity = Math.sqrt(vx * vx + vy * vy);
        // Fun physics: distance increases exponentially with velocity
        const baseDistance = totalVelocity * 500;
        const bonus = Math.pow(totalVelocity, 1.5) * 200;
        return Math.floor(baseDistance + bonus);
    };
    const bind = useDrag(({ args: [index], down, movement: [mx, my], velocity: [vx, vy], direction: [xDir, yDir], tap, last, timeStamp, }) => {
        // Double tap detection for card inspection
        const now = timeStamp;
        const timeSinceLast = now - lastTapTime.current;
        if (tap) {
            if (timeSinceLast < 300) {
                // Double tap - open card
                haptic(15);
                onCardSelect(cards[index].id);
                lastTapTime.current = 0;
                return;
            }
            else {
                // Single tap - start manipulation mode
                lastTapTime.current = now;
                setCurrentManipulation(index);
                haptic(8);
                return;
            }
        }
        // Track initial drag position
        if (down && !dragStartPos.current.x && !dragStartPos.current.y) {
            dragStartPos.current = { x: mx, y: my };
        }
        const totalVelocity = Math.sqrt(vx * vx + vy * vy);
        const dragDistance = Math.sqrt(mx * mx + my * my);
        const isThrow = !down && totalVelocity > 0.3 && dragDistance > 50;
        // Calculate throw angle for visual feedback
        const throwAngle = Math.atan2(my, mx) * (180 / Math.PI);
        if (isThrow) {
            // THROW THE CARD
            const distance = calculateDistance(vx, vy);
            const finalX = mx + vx * 800 * xDir;
            const finalY = my + vy * 800 * yDir;
            // Check for new records BEFORE updating history
            // Need to look at persisted localStorage, not sessionThrows
            const stored = localStorage.getItem('card-throw-history');
            const history = stored ? JSON.parse(stored) : [];
            let isNewHigh = false;
            let isNewLow = false;
            if (history.length === 0) {
                // First throw ever - always a record but only show high
                isNewHigh = true;
            }
            else {
                const longestEver = Math.max(...history.map(t => t.distance));
                const shortestEver = Math.min(...history.map(t => t.distance));
                if (distance > longestEver) {
                    isNewHigh = true;
                }
                if (distance < shortestEver) {
                    isNewLow = true;
                }
            }
            // Show toast for actual records only
            if (isNewHigh) {
                setRecordToast({
                    type: 'high',
                    message: `New Record! ${distance.toLocaleString()} ly`,
                });
                setTimeout(() => setRecordToast(null), 3000);
            }
            else if (isNewLow) {
                setRecordToast({
                    type: 'low',
                    message: `New Low: ${distance.toLocaleString()} ly`,
                });
                setTimeout(() => setRecordToast(null), 3000);
            }
            // Update card state
            setCardStates(prev => {
                const newStates = [...prev];
                newStates[index] = { gone: true, distance, angle: throwAngle };
                return newStates;
            });
            // Record throw in session stats
            setSessionThrows(prev => [...prev, {
                    cardId: cards[index].id,
                    distance,
                    angle: throwAngle,
                }]);
            // Show distance indicator
            setShowDistance({ index, distance });
            haptic(40);
            setTimeout(() => setShowDistance(null), 2500);
            // Animate throw
            api.start(i => {
                if (i !== index)
                    return;
                return {
                    x: finalX,
                    y: finalY,
                    z: -1000 - totalVelocity * 500, // Further based on velocity
                    rotX: vy * 200,
                    rotY: vx * 200,
                    rotZ: (mx / 10) * xDir + (my / 10) * yDir,
                    scale: 0.1,
                    opacity: 0,
                    config: { tension: 120, friction: 25 },
                };
            });
        }
        else if (down) {
            // MANIPULATION MODE - free 3D rotation and movement
            const manipulationIntensity = dragDistance / 100;
            // Haptic feedback for manipulation intensity
            if (manipulationIntensity > 1 && dragDistance % 50 < 10) {
                haptic(5);
            }
            api.start(i => {
                if (i !== index)
                    return;
                // Multi-gesture simulation:
                // - Horizontal movement = Y rotation
                // - Vertical movement = X rotation  
                // - Diagonal = Z rotation
                const rotYFromDrag = mx / 3;
                const rotXFromDrag = -my / 3;
                const rotZFromDrag = (mx * my) / 500;
                return {
                    x: mx,
                    y: my,
                    z: -dragDistance / 2, // Pull card forward as you drag
                    rotX: rotXFromDrag,
                    rotY: rotYFromDrag,
                    rotZ: rotZFromDrag,
                    scale: 1 + manipulationIntensity * 0.15,
                    opacity: 1,
                    immediate: true,
                };
            });
        }
        else if (last && !isThrow) {
            // RELEASE without throwing - spring back
            dragStartPos.current = { x: 0, y: 0 };
            setCurrentManipulation(null);
            api.start(i => {
                if (i !== index)
                    return;
                return {
                    ...to(i),
                    config: { tension: 400, friction: 30 },
                };
            });
        }
        // Reset deck when all cards are thrown
        const allGone = cardStates.filter(s => s.gone).length === cards.length - 1 && isThrow;
        if (allGone) {
            setTimeout(() => {
                setCardStates(cards.map(() => ({ gone: false, distance: 0, angle: 0 })));
                api.start(i => ({
                    ...to(i),
                    from: from(i),
                }));
                haptic(30);
            }, 1000);
        }
    }, {
        filterTaps: true,
        threshold: 5,
        rubberband: true,
    });
    return (_jsxs(_Fragment, { children: [_jsx(StatsButton, { onClick: () => setIsStatsOpen(true), throwCount: sessionThrows.length }), _jsx(StatsModal, { isOpen: isStatsOpen, onClose: () => setIsStatsOpen(false), currentSessionThrows: sessionThrows, cardNames: cardNames }), _jsxs("div", { className: "card-stack-container", children: [recordToast && (_jsxs("div", { className: `record-toast ${recordToast.type}`, children: [_jsx("div", { className: "record-supernova", children: _jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", children: [_jsx("circle", { cx: "12", cy: "12", r: "3", fill: "currentColor", opacity: "0.8" }), _jsx("path", { d: "M12 2v4M12 18v4M22 12h-4M6 12H2M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83M19.07 19.07l-2.83-2.83M7.76 7.76L4.93 4.93", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }), _jsx("circle", { cx: "12", cy: "12", r: "8", stroke: "currentColor", strokeWidth: "1", opacity: "0.3", className: "pulse-ring" })] }) }), _jsx("div", { className: "record-text", children: recordToast.message })] })), showDistance && (_jsxs("div", { className: "throw-distance-indicator", children: [_jsx("div", { className: "distance-value", children: showDistance.distance.toLocaleString() }), _jsx("div", { className: "distance-label", children: "light-years into the void" }), _jsx("div", { className: "distance-particles", children: Array.from({ length: 20 }).map((_, i) => (_jsx("div", { className: "particle", style: {
                                        '--particle-delay': `${i * 0.05}s`,
                                        '--particle-angle': `${Math.random() * 360}deg`,
                                    } }, i))) })] })), springs.map((style, i) => {
                        if (cardStates[i].gone)
                            return null;
                        const isManipulating = currentManipulation === i;
                        return (_jsx(animated.div, { className: "card-stack-wrapper", style: {
                                x: style.x,
                                y: style.y,
                                opacity: style.opacity,
                                zIndex: isManipulating ? 1000 : cards.length - i,
                            }, children: _jsxs(animated.div, { ...bind(i), className: `card-stack-card ${isManipulating ? 'manipulating' : ''}`, style: {
                                    transform: interpolate([style.x, style.y, style.z, style.rotX, style.rotY, style.rotZ, style.scale], trans),
                                    backgroundImage: `url(${cards[i].src})`,
                                }, children: [_jsx("div", { className: "card-shine", style: {
                                            '--shine-duration': `${6000 + i * 400}ms`,
                                            '--shine-delay': `${i * 200}ms`,
                                        } }), _jsx("div", { className: "card-glow-border", style: {
                                            '--border-duration': `${5000 + i * 300}ms`,
                                            '--border-delay': `${i * 150}ms`,
                                        } }), isManipulating && (_jsxs("div", { className: "manipulation-hint", children: [_jsx("div", { className: "hint-line", children: "Twist & Spin" }), _jsx("div", { className: "hint-subtext", children: "or throw into the void" })] }))] }) }, cards[i].id));
                    }), _jsxs("div", { className: "card-stack-hint", children: [_jsx("span", { className: "hint-action", children: "Double-tap" }), " to open \u00B7", _jsx("span", { className: "hint-action", children: " Hold & twist" }), " to manipulate \u00B7", _jsx("span", { className: "hint-action", children: " Flick" }), " to throw"] }), cardStates.filter(s => s.gone).length > 0 && !showDistance && (_jsxs("div", { className: "throw-stats", children: [_jsxs("div", { className: "stat-line", children: ["Cards thrown: ", cardStates.filter(s => s.gone).length, "/", cards.length] }), _jsxs("div", { className: "stat-line", children: ["Total distance: ", cardStates.reduce((sum, s) => sum + s.distance, 0).toLocaleString(), " ly"] })] }))] })] }));
}
