import QSTULogo from '../Header/QSTULogo/QSTULogo'
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <QSTULogo />
        </div>
        <div className="footer-links">
          <button className="footer-link">About</button>
          <button className="footer-link">Contact</button>
        </div>
        <div className="footer-copyright">
          © 2024 QD Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
