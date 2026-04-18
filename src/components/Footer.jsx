import { Link } from 'react-router-dom'
import { releaseInfo } from '../data/releaseInfo'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-brand-block">
          <strong>Royal</strong>
          <p>Independent cruise planning tools for Royal Caribbean travelers.</p>
          <div className="footer-release">
            <span>{releaseInfo.currentVersion}</span>
            <span>Updated {releaseInfo.updatedDate}</span>
            <span>Build {releaseInfo.buildId}</span>
          </div>
        </div>
        <div className="footer-meta">
          <p className="footer-note">Built for practical trip planning, not pointless digital glitter.</p>
          <Link className="footer-link" to="/changelog">
            View changelog
          </Link>
        </div>
      </div>
    </footer>
  )
}
