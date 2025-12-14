import { useEffect, useState } from 'react';
import './ResumeTerminal.css';

type Props = {
  onLinkedIn404?: () => void;
};

// Animated SVG Icons
const Icons = {
  location: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  email: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  ),
  phone: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  linkedin: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  web: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  briefcase: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <path d="M12 12v.01" />
    </svg>
  ),
  rocket: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  chart: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  users: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  code: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16,18 22,12 16,6" />
      <polyline points="8,6 2,12 8,18" />
    </svg>
  ),
  graduation: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 10l-10-5L2 10l10 5 10-5z" />
      <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
      <path d="M22 10v6" />
    </svg>
  ),
  star: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  ),
  brain: (
    <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a4 4 0 00-4 4v1a3 3 0 00-3 3 3 3 0 000 6 3 3 0 003 3v1a4 4 0 008 0v-1a3 3 0 003-3 3 3 0 000-6 3 3 0 00-3-3V6a4 4 0 00-4-4z" />
      <path d="M12 8v8M9 12h6" />
    </svg>
  ),
};

interface ExperienceItem {
  title: string;
  company: string;
  location?: string;
  dates: string;
  bullets: string[];
  icon: keyof typeof Icons;
}

const experiences: ExperienceItem[] = [
  {
    title: 'Founder',
    company: 'thirdAI Cooperative Association',
    dates: 'Sep 2025 – Present',
    icon: 'rocket',
    bullets: [
      'Built privacy-first behavioral awareness product using React, Python, and SQL',
      'Designed device-to-cloud architecture detecting money, time, and behavior patterns',
      'Applied LLMs, NLP, and classification workflows for insights and interventions',
      'Owned product strategy, roadmap, research, UX, and growth loops end-to-end',
    ],
  },
  {
    title: 'VP of Product & VP of Data Insights',
    company: 'Sunward Federal Credit Union',
    dates: 'Oct 2022 – Sep 2025',
    icon: 'chart',
    bullets: [
      'Led end-to-end product management across deposits, cards, and loyalty programs',
      'Launched Sunward+, a rebrand and rewards ecosystem driving ~$500M in new assets',
      'Built customer insights programs, dashboards, and cross-functional KPI frameworks',
      'Developed M&A strategy for Mountain America CU with ~$220M in NM assets',
      'Shipped Simple Spend, Secured Card, IOLTA, and digital experience improvements',
    ],
  },
  {
    title: 'Sr Retention Product Manager',
    company: 'Because Market',
    dates: 'Oct 2021 – Oct 2022',
    icon: 'users',
    bullets: [
      'Led retention, loyalty, and older adult CX strategy for ecommerce subscription brand',
      'Designed lifecycle journeys, messaging, experimentation, and segmentation models',
      'Partnered with Qualtrics to speak on journeys, feedback loops, and NLP insights',
    ],
  },
  {
    title: 'Director of Member Experience',
    company: 'TDECU',
    dates: 'Sep 2020 – Oct 2021',
    icon: 'star',
    bullets: [
      'Built measurement frameworks and automated workflows increasing NPS',
      'Led CX analytics, journey design, and activation for NFL and celebrity partnerships',
    ],
  },
  {
    title: 'Sr Program Manager',
    company: 'First Tech Federal Credit Union',
    dates: 'Dec 2015 – Sep 2020',
    icon: 'briefcase',
    bullets: [
      'Owned member experience tied to NBA partnership and digital journeys',
      'Built compliance and experience infrastructure supporting ~$10B in asset growth',
      'Implemented insights systems reducing complaints, escalations, and regulatory pressure',
    ],
  },
  {
    title: 'Personal Banker',
    company: 'Bank of America & Chase',
    dates: 'Feb 2011 – Dec 2015',
    icon: 'users',
    bullets: [
      'Served consumers, cross-border businesses, military families, and federal personnel',
      'Developed foundational BI instincts seeing how systems, data, and incentives shape behavior',
    ],
  },
];

const skills = [
  { category: 'Product', items: 'Product Management · Roadmap Ownership · Go-to-Market · Experimentation & A/B Testing' },
  { category: 'Growth', items: 'Growth Strategy · Customer Insights · Journey Mapping · Behavioral Design · Loyalty Systems' },
  { category: 'Technical', items: 'React · HTML/CSS · Python · SQL · Full Stack Development · Dashboards & Reporting' },
  { category: 'Leadership', items: 'Cross-Functional Leadership · Stakeholder Management · Brand Positioning · Regulatory Awareness' },
];

export default function ResumeTerminal({ onLinkedIn404 }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`resume-terminal ${mounted ? 'mounted' : ''}`}>
      {/* Header */}
      <header className="resume-header">
        <div className="resume-header-left">
          <div className="resume-avatar">
            <img 
              src="/images/quaite.jpg" 
              alt="Quaite Dodson" 
              className="resume-avatar-img"
            />
          </div>
          <div className="resume-name-block">
            <h1 className="resume-name">QUAITE DODSON</h1>
            <p className="resume-tagline">Product Leader · Growth Strategist · Builder</p>
          </div>
        </div>
        <div className="resume-contact">
          <a href="mailto:q@qdfafo.com" className="contact-item">
            {Icons.email}
            <span>q@qdfafo.com</span>
          </a>
          <a href="tel:5207325757" className="contact-item">
            {Icons.phone}
            <span>520.732.5757</span>
          </a>
          <span className="contact-item">
            {Icons.location}
            <span>Albuquerque, NM</span>
          </span>
          <button 
            type="button" 
            className="contact-item contact-item-button" 
            onClick={onLinkedIn404}
          >
            {Icons.linkedin}
            <span>linkedin.com/in/qw8</span>
          </button>
          <a href="https://qdfafo.com" target="_blank" rel="noopener noreferrer" className="contact-item">
            {Icons.web}
            <span>qdfafo.com</span>
          </a>
        </div>
      </header>

      {/* Summary */}
      <section className="resume-section">
        <div className="section-header">
          {Icons.brain}
          <h2>Summary</h2>
        </div>
        <p className="summary-text">
          I make growth feel inevitable. I spot the drag in journeys, fix the product and data loop, 
          and ship experiences that actually move metrics. Strong in product management, growth strategy, 
          customer insights, data analytics, and cross-functional leadership. Experienced with roadmap 
          ownership, experimentation, and creating clarity in ambiguity.
        </p>
      </section>

      {/* Experience */}
      <section className="resume-section">
        <div className="section-header">
          {Icons.briefcase}
          <h2>Experience</h2>
        </div>
        <div className="experience-list">
          {experiences.map((exp, idx) => (
            <div key={idx} className="experience-item" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="exp-header">
                <div className="exp-icon">{Icons[exp.icon]}</div>
                <div className="exp-title-block">
                  <h3 className="exp-title">{exp.title}</h3>
                  <span className="exp-company">{exp.company}</span>
                </div>
                <span className="exp-dates">{exp.dates}</span>
              </div>
              <ul className="exp-bullets">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="resume-section">
        <div className="section-header">
          {Icons.code}
          <h2>Skills</h2>
        </div>
        <div className="skills-grid">
          {skills.map((skill, idx) => (
            <div key={idx} className="skill-block" style={{ animationDelay: `${idx * 0.1}s` }}>
              <span className="skill-category">{skill.category}</span>
              <span className="skill-items">{skill.items}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="resume-section">
        <div className="section-header">
          {Icons.graduation}
          <h2>Education</h2>
        </div>
        <div className="education-item">
          <div className="edu-main">
            <h3>Bachelor of Science, Management Information Systems</h3>
            <span className="edu-school">Western Governors University</span>
          </div>
          <div className="edu-details">
            <span>Sales Management Focus</span>
            <span className="edu-gpa">GPA 4.0</span>
            <span>2015 – 2019</span>
          </div>
        </div>
      </section>

      {/* Additional */}
      <section className="resume-section resume-additional">
        <div className="section-header">
          {Icons.star}
          <h2>Additional</h2>
        </div>
        <p className="additional-text">
          Heavy user of LLMs including OpenAI and Anthropic models for analysis, ideation, and tooling. 
          Experience with NLP workflows, prototyping, rapid iteration, and applied behavior models. 
          Comfortable moving between creative and analytical work and leading cross-functional teams.
        </p>
      </section>

      {/* Terminal prompt footer */}
      <div className="resume-footer">
        <span className="prompt-symbol">❯</span>
        <span className="prompt-path">~/career</span>
        <span className="prompt-cursor">_</span>
      </div>
    </div>
  );
}