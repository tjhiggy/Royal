import { NavLink, Outlet } from 'react-router-dom'
import DecisionProgress from './DecisionProgress'
import Footer from './Footer'
import TopBanner from './TopBanner'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Guided Start', to: '/start' },
  { label: 'Deal', to: '/tools/deal-evaluator' },
  { label: 'Cost', to: '/tools/cruise-cost' },
  { label: 'Upgrades', to: '/tools' },
  { label: 'Dining', to: '/dining' },
  { label: 'Compare', to: '/compare' },
  { label: 'Snapshot', to: '/snapshot' },
]

export default function SiteLayout() {
  return (
    <div className="site-shell">
      <TopBanner />
      <header className="site-header">
        <div className="container nav-bar">
          <NavLink className="brand" to="/">
            <span className="brand-mark">CDE</span>
            <span className="brand-copy">
              <span className="brand-title">Cruise Decision Engine</span>
              <small>Guided calls for Royal Caribbean trips</small>
            </span>
          </NavLink>

          <nav className="nav-links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-active' : 'nav-link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <DecisionProgress />

      <main className="site-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
