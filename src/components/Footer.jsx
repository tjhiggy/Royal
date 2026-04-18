import { Link } from 'react-router-dom'
import { releaseInfo } from '../data/releaseInfo'

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Tools', to: '/tools' },
  { label: 'Compare', to: '/compare' },
  { label: 'Dining', to: '/dining' },
  { label: 'About', to: '/about' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-brand-block">
          <div className="footer-brand-row">
            <strong className="footer-brand">Cruise Decision Engine</strong>
            <span className="footer-product-tag">Royal Caribbean trip decision tools</span>
          </div>
          <p className="footer-statement">
            See the real trip cost, sort the worthwhile upgrades from the nonsense, and make the expensive calls with your eyes open.
          </p>
          <p className="footer-disclaimer">
            Independent tool. Not affiliated with Royal Caribbean.
          </p>
        </div>

        <div className="footer-nav-block">
          <span className="footer-heading">Explore</span>
          <nav className="footer-nav" aria-label="Footer navigation">
            {footerLinks.map((item) => (
              <Link key={item.to} className="footer-link" to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-meta">
          <span className="footer-heading">Release</span>
          <Link className="footer-link footer-changelog-link" to="/changelog">
            View changelog
          </Link>
          <div className="footer-release">
            <span>{releaseInfo.currentVersion}</span>
            <span>Updated {releaseInfo.updatedDate}</span>
            <span>Build {releaseInfo.buildId}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
