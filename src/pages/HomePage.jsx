import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import { loadRecentTrips } from '../utils/storage'

export default function HomePage() {
  const [recentTrips, setRecentTrips] = useState([])

  useEffect(() => {
    setRecentTrips(loadRecentTrips())
  }, [])

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Royal Caribbean decision engine"
        title="Stop overpaying for your cruise."
        description="See the real cost, cut the overpriced add-ons, and make the right call before you book."
        actions={
          <>
            <Link className="button button-primary" to="/tools/deal-evaluator">
              Check if your deal is actually good
            </Link>
            <Link className="button button-secondary" to="/tools/cruise-cost">
              See what your trip will really cost
            </Link>
          </>
        }
      />

      {recentTrips.length ? (
        <section className="page-section">
          <SectionHeader
            title="Continue where you left off"
            description="Your last calculator sessions from this browser. No account required, because we are not monsters."
          />
          <div className="recent-trip-list">
            {recentTrips.map((trip) => (
              <Link key={trip.id} className="card recent-trip-card" to={`${trip.path}?recent=${trip.id}`}>
                <div>
                  <strong>{trip.label}</strong>
                  <span>{trip.toolLabel}</span>
                </div>
                <small>Updated {new Date(trip.updatedAt).toLocaleDateString()}</small>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="page-section">
        <SectionHeader
          title="Where people get burned"
          description="The fare is only the opening act. The expensive mistakes usually show up after that."
        />
        <div className="card burn-card">
          <ul className="burn-list">
            <li>Drink packages that don’t pay off</li>
            <li>WiFi plans you don’t need</li>
            <li>Dining packages you won’t use</li>
            <li>Cheap fares hiding expensive trips</li>
          </ul>
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="Start here"
          description="Work through the decisions in order. No guessing, no checkout-page panic."
        />
        <div className="decision-flow-grid">
          <Link className="card info-card decision-flow-card" to="/tools/deal-evaluator">
            <span className="step-badge">Step 1</span>
            <h3>Is this a good deal?</h3>
            <p>Test the fare before calling it a bargain.</p>
            <span className="card-link">Evaluate the deal</span>
          </Link>
          <Link className="card info-card decision-flow-card" to="/tools/cruise-cost">
            <span className="step-badge">Step 2</span>
            <h3>What will it really cost?</h3>
            <p>Add fare, taxes, travel, and extras.</p>
            <span className="card-link">Calculate real cost</span>
          </Link>
          <article className="card info-card decision-flow-card">
            <span className="step-badge">Step 3</span>
            <h3>Which upgrades are worth it?</h3>
            <p>Keep the upgrades that earn their keep.</p>
            <div className="inline-link-list" aria-label="Upgrade calculators">
              <Link className="inline-tool-link" to="/tools/drink-package">Drink</Link>
              <Link className="inline-tool-link" to="/tools/dining-package">Dining</Link>
              <Link className="inline-tool-link" to="/tools/wifi">WiFi</Link>
              <Link className="inline-tool-link" to="/tools/the-key">The Key</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="Why this exists"
          description="Cruise pricing is fragmented. The base fare looks fine, then drinks, dining, WiFi, excursions, and travel inflate the trip. This pulls the real cost into one place."
        />
      </section>

      <section className="page-section">
        <SectionHeader
          title="Then refine your plan"
          description="Compare versions and keep the plan organized after the big money calls are clear."
        />
        <div className="card-grid">
          <Link className="card info-card" to="/compare">
            <div className="card-topline">
              <h3>Compare scenarios</h3>
              <span className="status-pill">Live</span>
            </div>
            <p>Put two trip versions side by side.</p>
            <span className="card-link">Compare trip versions</span>
          </Link>
          <Link className="card info-card" to="/planner">
            <div className="card-topline">
              <h3>Planner</h3>
              <span className="status-pill">Live</span>
            </div>
            <p>Keep reservations, notes, and trip details together.</p>
            <span className="card-link">Open the planner</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
