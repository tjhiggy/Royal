import { NavLink, Outlet } from 'react-router-dom'
import Footer from './Footer'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Tools', to: '/tools' },
  { label: 'Compare', to: '/compare' },
  { label: 'Dining', to: '/dining' },
  { label: 'Packing', to: '/packing' },
  { label: 'Planner', to: '/planner' },
  { label: 'About', to: '/about' },
]

export default function SiteLayout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container nav-bar">
          <NavLink className="brand" to="/">
            <span className="brand-mark">R</span>
            <span className="brand-copy">
              <span className="brand-title">Royal</span>
              <small>Royal Caribbean decision tools</small>
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

      <main className="site-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
