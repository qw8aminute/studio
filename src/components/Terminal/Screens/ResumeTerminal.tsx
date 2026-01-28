import { useRef, useEffect, useState } from 'react';
import './ResumeTerminal.css';

type Props = {
  onLinkedIn404?: () => void;
};

export default function ResumeTerminal({ onLinkedIn404 }: Props) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExportPDF = () => {
  setExporting(true);
  
  // Set document title for PDF filename
  const originalTitle = document.title;
  document.title = 'quAiTeS resume';
  
  setTimeout(() => {
    window.print();
    document.title = originalTitle;
    setExporting(false);
  }, 100);
  };

  return (
    <div className={`resume-terminal ${mounted ? 'mounted' : ''}`}>
      {/* Action Bar */}
      <div className="resume-action-bar">
        <button 
          onClick={handleExportPDF}
          className="resume-download-btn"
          disabled={exporting}
        >
          {exporting ? (
            <>
              <span className="spinner" />
              Downloading...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="download-icon">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="resume-paper" ref={resumeRef}>
        <div className="resume-content">
          
          {/* ============ HEADER ============ */}
          <header className="resume-header">
            <div className="resume-avatar">
              <img src="/images/quaite.jpg" alt="Quaite Dodson" />
            </div>
            <div className="resume-header-text">
              <h1 className="resume-name">quaite dodson</h1>
              <p className="resume-tagline">product leader · growth strategist · builder</p>
              <div className="resume-contact">
                <a href="mailto:q@qdfafo.com">q@qdfafo.com</a>
                <span className="contact-sep">·</span>
                <a href="tel:5207325757">520.732.5757</a>
                <span className="contact-sep">·</span>
                <span>Albuquerque, NM</span>
                <span className="contact-sep">·</span>
                <button type="button" onClick={onLinkedIn404} className="contact-link">
                  linkedin.com/in/qw8
                </button>
                <span className="contact-sep">·</span>
                <a href="https://qdfafo.com" target="_blank" rel="noopener noreferrer">qdfafo.com</a>
              </div>
            </div>
          </header>

          {/* ============ SUMMARY ============ */}
          <section className="resume-section">
            <h2 className="section-title">Summary</h2>
            <p className="summary-text">
              I'm a product and growth executive with 10+ years leading strategy and execution across fintech, credit unions, and consumer platforms. I've built a proven track record scaling products for 100K+ users, driving $500M+ in new asset growth, and improving retention through data-driven systems. I'm strong in roadmap ownership, behavioral design, and cross-functional leadership in complex, regulated environments. I'm equally effective at setting high-level strategy and shipping hands-on, code-informed solutions.
            </p>
          </section>

          {/* ============ EXPERIENCE ============ */}
          <section className="resume-section">
            <h2 className="section-title">Experience</h2>
            
            {/* Founder */}
            <div className="exp-card" data-accent="teal">
              <div className="exp-header">
                <div className="exp-title-block">
                  <h3 className="exp-title">Founder</h3>
                  <span className="exp-company">thirdAI Cooperative Association</span>
                </div>
                <span className="exp-dates">Sep 2025 – Present</span>
              </div>
              <ul className="exp-bullets">
                <li>Built a privacy-first behavioral insights tool to help members track and improve financial and digital habits</li>
                <li>Designed on-device architecture to detect spending, time, and behavior patterns with real time alerts</li>
                <li>Leveraged NLP, classification models, and LLMs to deliver personalized, actionable recommendations aligned with wellness goals</li>
                <li>Led end to end product strategy, research, UX, roadmap execution, and member and investor growth campaigns</li>
              </ul>
            </div>

            {/* VP - Sunward */}
            <div className="exp-card" data-accent="violet">
              <div className="exp-header">
                <div className="exp-title-block">
                  <h3 className="exp-title">VP of Product & VP of Data Insights</h3>
                  <span className="exp-company">Sunward Federal Credit Union</span>
                </div>
                <span className="exp-dates">Oct 2022 – Sep 2025</span>
              </div>
              <ul className="exp-bullets">
                <li>Led end-to-end product management across deposits, cards, and loyalty programs serving 100K+ members</li>
                <li>Launched Sunward+, a complete rebrand and rewards ecosystem driving ~$500M in new assets within 18 months</li>
                <li>Built customer insights programs, real-time dashboards, and cross-functional KPI frameworks</li>
                <li>Developed M&A strategy for Mountain America CU with ~$220M in NM assets</li>
              </ul>
            </div>

            {/* Sr PM - Because Market */}
            <div className="exp-card" data-accent="coral">
              <div className="exp-header">
                <div className="exp-title-block">
                  <h3 className="exp-title">Sr Retention Product Manager</h3>
                  <span className="exp-company">Because Market</span>
                </div>
                <span className="exp-dates">Oct 2021 – Oct 2022</span>
              </div>
              <ul className="exp-bullets">
                <li>Led retention, loyalty, and older adult CX strategy for ecommerce subscription brand</li>
                <li>Designed lifecycle journeys, messaging frameworks, and A/B experimentation roadmaps improving retention 15%+</li>
                <li>Built segmentation models leveraging behavioral and transactional data to personalize communications at scale</li>
              </ul>
            </div>

            {/* Director - TDECU */}
            <div className="exp-card" data-accent="cyan">
              <div className="exp-header">
                <div className="exp-title-block">
                  <h3 className="exp-title">Director of Member Experience</h3>
                  <span className="exp-company">Texas Dow Employees Credit Union</span>
                </div>
                <span className="exp-dates">Sep 2020 – Oct 2021</span>
              </div>
              <ul className="exp-bullets">
                <li>Built measurement frameworks and automated feedback workflows increasing NPS scores</li>
                <li>Led CX analytics, journey design, and activation for NFL and celebrity partnerships</li>
                <li>Implemented Voice of Customer program synthesizing feedback into product improvements</li>
              </ul>
            </div>

            {/* Sr PM - First Tech */}
            <div className="exp-card" data-accent="amber">
              <div className="exp-header">
                <div className="exp-title-block">
                  <h3 className="exp-title">Sr Program Manager</h3>
                  <span className="exp-company">First Tech Federal Credit Union</span>
                </div>
                <span className="exp-dates">Dec 2015 – Sep 2020</span>
              </div>
              <ul className="exp-bullets">
                <li>Owned member experience strategy tied to NBA partnership and digital journey optimization</li>
                <li>Built compliance and experience infrastructure supporting ~$10B in asset growth</li>
                <li>Managed cross-functional teams across marketing, operations, and technology</li>
              </ul>
            </div>

            {/* Banking */}
            <div className="exp-card" data-accent="slate">
              <div className="exp-header">
                <div className="exp-title-block">
                  <h3 className="exp-title">Personal Banker</h3>
                  <span className="exp-company">Bank of America & Chase</span>
                </div>
                <span className="exp-dates">Feb 2011 – Dec 2015</span>
              </div>
              <ul className="exp-bullets">
                <li>Provided personalized financial services to consumers, cross-border businesses, and military families</li>
                <li>Built foundational business intelligence instincts seeing how large-scale systems and incentives shape behavior</li>
                <li>Developed empathy, risk awareness, and customer insight that fuel product work today</li>
              </ul>
            </div>
          </section>

          {/* ============ SKILLS ============ */}
          <section className="resume-section">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              <div className="skill-card" data-accent="teal">
                <span className="skill-label">Product</span>
                <span className="skill-items">Product Management · Roadmap Ownership · Go-to-Market · Experimentation</span>
              </div>
              <div className="skill-card" data-accent="violet">
                <span className="skill-label">Growth</span>
                <span className="skill-items">Growth Strategy · Customer Insights · Journey Mapping · Behavioral Design</span>
              </div>
              <div className="skill-card" data-accent="coral">
                <span className="skill-label">Technical</span>
                <span className="skill-items">React · Python · SQL · Full Stack · Dashboards & Reporting</span>
              </div>
              <div className="skill-card" data-accent="amber">
                <span className="skill-label">Leadership</span>
                <span className="skill-items">Cross-Functional Leadership · Stakeholder Management · Brand Positioning</span>
              </div>
            </div>
          </section>

          {/* ============ EDUCATION ============ */}
          <section className="resume-section">
            <h2 className="section-title">Education</h2>
            <div className="edu-card">
              <div className="edu-main">
                <h3 className="edu-degree">Bachelor of Science, Management Information Systems</h3>
                <span className="edu-school">Western Governors University</span>
              </div>
              <div className="edu-meta">
                <span>Sales Management Focus</span>
                <span className="meta-sep">·</span>
                <span>GPA 4.0</span>
                <span className="meta-sep">·</span>
                <span>2015 – 2019</span>
              </div>
            </div>
          </section>

          {/* ============ FOOTER ============ */}
          <div className="resume-footer">
            <span className="prompt-symbol">❯</span>
            <span className="prompt-path">~/resume</span>
            <span className="prompt-cursor">_</span>
          </div>

        </div>
      </div>
    </div>
  );
}