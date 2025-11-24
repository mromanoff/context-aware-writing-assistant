import './Footer.css'

export interface FooterProps {
  /** Application name */
  appName?: string
  /** Version number */
  version?: string
  /** Year for copyright */
  year?: number
}

export function Footer({
  appName = 'Context-Aware Writing Assistant',
  version,
  year = new Date().getFullYear(),
}: FooterProps) {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          {/* App Info */}
          <div className="footer-section">
            <div className="footer-brand">
              <span className="footer-title">{appName}</span>
              {version && <span className="footer-version">v{version}</span>}
            </div>
            <p className="footer-description">
              Improve your writing with context-aware suggestions and real-time analysis.
            </p>
          </div>

          {/* Links Section */}
          <nav className="footer-nav" aria-label="Footer navigation">
            <div className="footer-links">
              <h3 className="footer-heading">Resources</h3>
              <ul className="footer-list">
                <li>
                  <a href="#docs" className="footer-link">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#guide" className="footer-link">
                    User Guide
                  </a>
                </li>
                <li>
                  <a href="#api" className="footer-link">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-links">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-list">
                <li>
                  <a href="#help" className="footer-link">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#contact" className="footer-link">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#feedback" className="footer-link">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-links">
              <h3 className="footer-heading">Legal</h3>
              <ul className="footer-list">
                <li>
                  <a href="#privacy" className="footer-link">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="footer-link">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {year} {appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
