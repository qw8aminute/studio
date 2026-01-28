import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import './StatsModal.css';
const THROWS_PER_SET = 6;
const SETS_PER_ROUND = 3;
const THROWS_PER_ROUND = THROWS_PER_SET * SETS_PER_ROUND; // 18
export default function StatsModal({ isOpen, onClose, currentSessionThrows, cardNames }) {
    const [allThrows, setAllThrows] = useState([]);
    const [allRounds, setAllRounds] = useState([]);
    const [shareStatus, setShareStatus] = useState('idle');
    // Load and process data
    useEffect(() => {
        if (!isOpen)
            return;
        // Load historical data
        const storedThrows = localStorage.getItem('card-throw-history');
        const storedRounds = localStorage.getItem('card-rounds-history');
        const historical = storedThrows ? JSON.parse(storedThrows) : [];
        const historicalRounds = storedRounds ? JSON.parse(storedRounds) : [];
        // Convert current session to records
        const sessionRecords = currentSessionThrows.map(t => ({
            id: `${Date.now()}-${Math.random()}`,
            cardName: cardNames.get(t.cardId) || 'Unknown Card',
            distance: t.distance,
            timestamp: Date.now(),
            angle: t.angle,
        }));
        // Merge and save throws
        const combined = [...historical, ...sessionRecords];
        setAllThrows(combined);
        localStorage.setItem('card-throw-history', JSON.stringify(combined));
        // Process rounds
        const allRoundsData = [...historicalRounds];
        // Check if we need to create a new round from session
        if (sessionRecords.length >= THROWS_PER_ROUND) {
            const roundThrows = sessionRecords.slice(-THROWS_PER_ROUND);
            const totalDistance = roundThrows.reduce((sum, t) => sum + t.distance, 0);
            const distances = roundThrows.map(t => t.distance);
            const newRound = {
                id: `round-${Date.now()}`,
                totalDistance,
                longestThrow: Math.max(...distances),
                shortestThrow: Math.min(...distances),
                timestamp: Date.now(),
                throws: THROWS_PER_ROUND,
            };
            allRoundsData.push(newRound);
        }
        setAllRounds(allRoundsData);
        localStorage.setItem('card-rounds-history', JSON.stringify(allRoundsData));
    }, [isOpen, currentSessionThrows, cardNames]);
    // Calculate stats
    const stats = useMemo(() => {
        const totalThrows = allThrows.length;
        const totalDistance = allThrows.reduce((sum, t) => sum + t.distance, 0);
        const averageDistance = totalThrows > 0 ? Math.floor(totalDistance / totalThrows) : 0;
        // Current round progress
        const currentRoundThrows = currentSessionThrows.length % THROWS_PER_ROUND || 0;
        const currentRoundDistance = currentSessionThrows
            .slice(-currentRoundThrows || -THROWS_PER_ROUND)
            .reduce((sum, t) => sum + t.distance, 0);
        const currentLongest = currentRoundThrows > 0
            ? Math.max(...currentSessionThrows.slice(-currentRoundThrows).map(t => t.distance))
            : 0;
        const currentShortest = currentRoundThrows > 0
            ? Math.min(...currentSessionThrows.slice(-currentRoundThrows).map(t => t.distance))
            : 0;
        // All-time bests
        const allTimeBestDistance = allRounds.length > 0
            ? Math.max(...allRounds.map(r => r.totalDistance))
            : 0;
        const allTimeLongest = allThrows.length > 0
            ? Math.max(...allThrows.map(t => t.distance))
            : 0;
        const allTimeShortest = allThrows.length > 0
            ? Math.min(...allThrows.map(t => t.distance))
            : Infinity;
        return {
            totalThrows,
            totalDistance,
            averageDistance,
            currentRoundThrows,
            currentRoundDistance,
            currentLongest,
            currentShortest,
            allTimeBestDistance,
            allTimeLongest,
            allTimeShortest: allTimeShortest === Infinity ? 0 : allTimeShortest,
        };
    }, [allThrows, allRounds, currentSessionThrows]);
    const topRounds = useMemo(() => {
        return [...allRounds]
            .sort((a, b) => b.totalDistance - a.totalDistance)
            .slice(0, 3);
    }, [allRounds]);
    const handleShare = async () => {
        const bestRoundDistance = allRounds.length > 0
            ? Math.max(...allRounds.map(r => r.totalDistance))
            : 0;
        const shareText = `I've thrown ${stats.totalThrows} cards ${stats.totalDistance.toLocaleString()} light-years into the void.

Best Round: ${bestRoundDistance.toLocaleString()} ly
Longest Throw: ${stats.allTimeLongest.toLocaleString()} ly
Shortest Throw: ${stats.allTimeShortest.toLocaleString()} ly

Can you beat my distance? qdfafo.com (mobile only)`;
        if (navigator.share) {
            try {
                setShareStatus('sharing');
                await navigator.share({ text: shareText });
                setShareStatus('idle');
            }
            catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard(shareText);
                }
                setShareStatus('idle');
            }
        }
        else {
            copyToClipboard(shareText);
        }
    };
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setShareStatus('copied');
            setTimeout(() => setShareStatus('idle'), 2000);
        }
        catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    const clearHistory = () => {
        if (confirm('Clear all throw history and rounds? This cannot be undone.')) {
            localStorage.removeItem('card-throw-history');
            localStorage.removeItem('card-rounds-history');
            setAllThrows([]);
            setAllRounds([]);
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "stats-modal-overlay", onClick: onClose, children: _jsxs("div", { className: "stats-modal-content", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "stats-modal-header", children: [_jsx("h2", { className: "stats-modal-title", children: "Stats" }), _jsx("button", { className: "stats-modal-close", onClick: onClose, "aria-label": "Close", children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }) })] }), _jsxs("div", { className: "stats-summary", children: [_jsxs("div", { className: "stat-cell", children: [_jsx("div", { className: "stat-value", children: stats.totalThrows }), _jsx("div", { className: "stat-label", children: "Total Throws" })] }), _jsxs("div", { className: "stat-cell", children: [_jsx("div", { className: "stat-value", children: stats.totalDistance.toLocaleString() }), _jsx("div", { className: "stat-label", children: "Total Light-Years" })] }), _jsxs("div", { className: "stat-cell", children: [_jsx("div", { className: "stat-value", children: stats.averageDistance.toLocaleString() }), _jsx("div", { className: "stat-label", children: "Avg Distance" })] })] }), stats.currentRoundThrows > 0 && (_jsxs("div", { className: "stats-section current-round", children: [_jsxs("h3", { className: "stats-section-title", children: ["Current Round (", stats.currentRoundThrows, "/", THROWS_PER_ROUND, ")"] }), _jsxs("div", { className: "round-stats", children: [_jsxs("div", { className: "round-stat-row", children: [_jsx("span", { className: "round-stat-label", children: "Total Distance" }), _jsxs("div", { className: "round-stat-values", children: [_jsx("span", { className: "round-stat-current", children: stats.currentRoundDistance.toLocaleString() }), stats.allTimeBestDistance > 0 && (_jsxs("span", { className: "round-stat-best", children: ["Best: ", stats.allTimeBestDistance.toLocaleString()] }))] })] }), _jsxs("div", { className: "round-stat-row", children: [_jsx("span", { className: "round-stat-label", children: "Longest Throw" }), _jsxs("div", { className: "round-stat-values", children: [_jsx("span", { className: "round-stat-current", children: stats.currentLongest.toLocaleString() }), stats.allTimeLongest > 0 && (_jsxs("span", { className: "round-stat-best", children: ["Best: ", stats.allTimeLongest.toLocaleString()] }))] })] }), _jsxs("div", { className: "round-stat-row", children: [_jsx("span", { className: "round-stat-label", children: "Shortest Throw" }), _jsxs("div", { className: "round-stat-values", children: [_jsx("span", { className: "round-stat-current", children: stats.currentShortest.toLocaleString() }), stats.allTimeShortest > 0 && (_jsxs("span", { className: "round-stat-best", children: ["Low: ", stats.allTimeShortest.toLocaleString()] }))] })] })] })] })), topRounds.length > 0 && (_jsxs("div", { className: "stats-section", children: [_jsx("h3", { className: "stats-section-title", children: "Top 3 Rounds All Time" }), _jsx("div", { className: "podium", children: topRounds.map((round, idx) => (_jsxs("div", { className: `podium-place place-${idx + 1}`, children: [_jsx("div", { className: "podium-icon", children: _jsxs("svg", { width: "32", height: "32", viewBox: "0 0 32 32", fill: "none", children: [idx === 0 && (_jsxs(_Fragment, { children: [_jsx("rect", { x: "6", y: "12", width: "20", height: "16", fill: "rgba(6, 182, 212, 0.2)", stroke: "rgba(6, 182, 212, 0.6)", strokeWidth: "2", rx: "2" }), _jsx("circle", { cx: "16", cy: "8", r: "5", fill: "rgba(6, 182, 212, 0.3)", stroke: "rgba(6, 182, 212, 0.8)", strokeWidth: "2" })] })), idx === 1 && (_jsxs(_Fragment, { children: [_jsx("rect", { x: "7", y: "16", width: "18", height: "12", fill: "rgba(6, 182, 212, 0.15)", stroke: "rgba(6, 182, 212, 0.5)", strokeWidth: "2", rx: "2" }), _jsx("circle", { cx: "16", cy: "11", r: "4", fill: "rgba(6, 182, 212, 0.2)", stroke: "rgba(6, 182, 212, 0.6)", strokeWidth: "2" })] })), idx === 2 && (_jsxs(_Fragment, { children: [_jsx("rect", { x: "8", y: "20", width: "16", height: "8", fill: "rgba(6, 182, 212, 0.1)", stroke: "rgba(6, 182, 212, 0.4)", strokeWidth: "2", rx: "2" }), _jsx("circle", { cx: "16", cy: "15", r: "3", fill: "rgba(6, 182, 212, 0.15)", stroke: "rgba(6, 182, 212, 0.5)", strokeWidth: "2" })] }))] }) }), _jsxs("div", { className: "podium-rank", children: ["#", idx + 1] }), _jsxs("div", { className: "podium-distance", children: [round.totalDistance.toLocaleString(), " ly"] }), _jsxs("div", { className: "podium-meta", children: [_jsxs("span", { children: ["Longest: ", round.longestThrow.toLocaleString()] }), _jsxs("span", { children: ["Shortest: ", round.shortestThrow.toLocaleString()] })] })] }, round.id))) })] })), allThrows.length === 0 && (_jsxs("div", { className: "empty-state", children: ["Throw ", THROWS_PER_ROUND, " cards to complete a round"] })), _jsxs("div", { className: "stats-actions", children: [_jsxs("button", { className: "share-button", onClick: handleShare, disabled: allThrows.length === 0, children: [_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "18", cy: "5", r: "3" }), _jsx("circle", { cx: "6", cy: "12", r: "3" }), _jsx("circle", { cx: "18", cy: "19", r: "3" }), _jsx("path", { d: "M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" })] }), shareStatus === 'copied' ? 'Copied!' : shareStatus === 'sharing' ? 'Sharing...' : 'Share Stats'] }), _jsx("button", { className: "clear-button", onClick: clearHistory, disabled: allThrows.length === 0, children: "Clear History" })] })] }) }));
}
