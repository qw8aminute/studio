import { useEffect, useState } from 'react';
import './ContactTerminal.css';

const Icons = {
  user: (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  phone: (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  email: (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  ),
  calendar: (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  ),
  linkedin: (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  send: (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
};

type Props = {
  onLinkedIn404: () => void;
};

interface ContactItem {
  icon: keyof typeof Icons;
  label: string;
  value: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
}

export default function ContactTerminal({ onLinkedIn404 }: Props) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const contacts: ContactItem[] = [
    { icon: 'user', label: 'name', value: 'Quaite Dodson' },
    { icon: 'phone', label: 'phone', value: '520.732.5757', href: 'tel:5207325757' },
    { icon: 'email', label: 'email', value: 'q@qdfafo.com', href: 'mailto:q@qdfafo.com' },
    { icon: 'calendar', label: 'calendly', value: 'calendly.com/q-qdfafo', href: 'https://calendly.com/q-qdfafo', external: true },
    { icon: 'linkedin', label: 'linkedin', value: 'linkedin.com/in/qw8', onClick: onLinkedIn404 },
  ];

  return (
    <div className={`contact-terminal ${mounted ? 'mounted' : ''}`}>
      {/* Header */}
      <header className="contact-header">
        <div className="contact-title-row">
          {Icons.send}
          <h1 className="contact-title">Get in touch</h1>
        </div>
        <p className="contact-subtitle">Let's build something together</p>
      </header>

      {/* Contact list */}
      <div className="contact-list">
        {contacts.map((contact, idx) => {
          const content = (
            <>
              <span className="contact-icon-wrap">
                {Icons[contact.icon]}
              </span>
              <span className="contact-label">{contact.label}</span>
              <span className="contact-value">{contact.value}</span>
              {copied === contact.label && (
                <span className="contact-copied">copied!</span>
              )}
            </>
          );

          if (contact.onClick) {
            return (
              <button
                key={idx}
                className="contact-row contact-row-button"
                onClick={contact.onClick}
                type="button"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {content}
              </button>
            );
          }

          if (contact.href) {
            return (
              <a
                key={idx}
                className="contact-row"
                href={contact.href}
                target={contact.external ? '_blank' : undefined}
                rel={contact.external ? 'noopener noreferrer' : undefined}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={idx}
              className="contact-row contact-row-static"
              onClick={() => copyToClipboard(contact.value, contact.label)}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {content}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="contact-cta">
        <a href="mailto:q@qdfafo.com" className="contact-cta-button">
          {Icons.email}
          <span>Send me a message</span>
        </a>
      </div>

      {/* Terminal prompt */}
      <div className="contact-footer">
        <span className="prompt-symbol">❯</span>
        <span className="prompt-path">~/contact</span>
        <span className="prompt-cursor">_</span>
      </div>
    </div>
  );
}