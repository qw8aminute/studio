import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import QSTULogo from './QSTULogo/QSTULogo';
import ForceGraph from '../Hero/ForceGraph';
import './Header.css';
export default function Header({ transparent = false, onOpenPanel }) {
    const openFromNode = (id) => {
        if (id === 'ABOUT')
            onOpenPanel?.('about');
        if (id === 'CONTACT')
            onOpenPanel?.('contact');
        if (id === 'RESUME')
            onOpenPanel?.('resume');
    };
    return (_jsxs("header", { className: `header ${transparent ? 'transparent' : ''}`, children: [_jsx("div", { className: "header-logo", children: _jsx(QSTULogo, { onSelect: onOpenPanel }) }), _jsx("div", { className: "header-motif", children: _jsx(ForceGraph, { onNodeSelect: openFromNode }) })] }));
}
