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
