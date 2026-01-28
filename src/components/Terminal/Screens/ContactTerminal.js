import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import './ContactTerminal.css';
const Icons = {
    user: (_jsxs("svg", { className: "contact-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [_jsx("path", { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }), _jsx("circle", { cx: "12", cy: "7", r: "4" })] })),
    phone: (_jsx("svg", { className: "contact-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: _jsx("path", { d: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" }) })),
    email: (_jsxs("svg", { className: "contact-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [_jsx("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }), _jsx("path", { d: "M22 6l-10 7L2 6" })] })),
    calendar: (_jsxs("svg", { className: "contact-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }), _jsx("path", { d: "M16 2v4M8 2v4M3 10h18" }), _jsx("path", { d: "M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" })] })),
    linkedin: (_jsxs("svg", { className: "contact-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [_jsx("path", { d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" }), _jsx("rect", { x: "2", y: "9", width: "4", height: "12" }), _jsx("circle", { cx: "4", cy: "4", r: "2" })] })),
    send: (_jsx("svg", { className: "contact-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: _jsx("path", { d: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" }) })),
};
export default function ContactTerminal({ onLinkedIn404 }) {
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(null);
    useEffect(() => {
        setMounted(true);
    }, []);
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };
    const contacts = [
        { icon: 'user', label: 'name', value: 'Quaite Dodson' },
        { icon: 'phone', label: 'phone', value: '520.732.5757', href: 'tel:5207325757' },
        { icon: 'email', label: 'email', value: 'q@qdfafo.com', href: 'mailto:q@qdfafo.com' },
        { icon: 'calendar', label: 'calendly', value: 'calendly.com/q-qdfafo', href: 'https://calendly.com/q-qdfafo', external: true },
        { icon: 'linkedin', label: 'linkedin', value: 'linkedin.com/in/qw8', onClick: onLinkedIn404 },
    ];
    return (_jsxs("div", { className: `contact-terminal ${mounted ? 'mounted' : ''}`, children: [_jsxs("header", { className: "contact-header", children: [_jsxs("div", { className: "contact-title-row", children: [Icons.send, _jsx("h1", { className: "contact-title", children: "Get in touch" })] }), _jsx("p", { className: "contact-subtitle", children: "Let's build something together" })] }), _jsx("div", { className: "contact-list", children: contacts.map((contact, idx) => {
                    const content = (_jsxs(_Fragment, { children: [_jsx("span", { className: "contact-icon-wrap", children: Icons[contact.icon] }), _jsx("span", { className: "contact-label", children: contact.label }), _jsx("span", { className: "contact-value", children: contact.value }), copied === contact.label && (_jsx("span", { className: "contact-copied", children: "copied!" }))] }));
                    if (contact.onClick) {
                        return (_jsx("button", { className: "contact-row contact-row-button", onClick: contact.onClick, type: "button", style: { animationDelay: `${idx * 0.05}s` }, children: content }, idx));
                    }
                    if (contact.href) {
                        return (_jsx("a", { className: "contact-row", href: contact.href, target: contact.external ? '_blank' : undefined, rel: contact.external ? 'noopener noreferrer' : undefined, style: { animationDelay: `${idx * 0.05}s` }, children: content }, idx));
                    }
                    return (_jsx("div", { className: "contact-row contact-row-static", onClick: () => copyToClipboard(contact.value, contact.label), style: { animationDelay: `${idx * 0.05}s` }, children: content }, idx));
                }) }), _jsx("div", { className: "contact-cta", children: _jsxs("a", { href: "mailto:q@qdfafo.com", className: "contact-cta-button", children: [Icons.email, _jsx("span", { children: "Send me a message" })] }) }), _jsxs("div", { className: "contact-footer", children: [_jsx("span", { className: "prompt-symbol", children: "\u276F" }), _jsx("span", { className: "prompt-path", children: "~/contact" }), _jsx("span", { className: "prompt-cursor", children: "_" })] })] }));
}
