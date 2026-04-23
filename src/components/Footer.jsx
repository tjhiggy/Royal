import { Link } from 'react-router-dom'
import { releaseInfo } from '../data/releaseInfo'

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Guided Start', to: '/start' },
  { label: 'Deal', to: '/tools/deal-evaluator' },
  { label: 'Cost', to: '/tools/cruise-cost' },
  { label: 'Upgrades', to: '/tools' },
  { label: 'Dining', to: '/dining' },
  { label: 'Compare', to: '/compare' },
  { label: 'Snapshot', to: '/snapshot' },
  { label: 'Packing', to: '/packing' },
  { label: 'Planner', to: '/planner' },
  { label: 'About', to: '/about' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-brand-block">
          <div className="footer-brand-row">
            <strong className="footer-brand">Cruise Decision Engine</strong>
            <span className="footer-product-tag">Version 2.0 guided decision system</span>
          </div>
          <p className="footer-statement">
            Price the full trip, challenge the upgrades, compare the options, then leave with one clean answer.
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
