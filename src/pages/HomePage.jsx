import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import { loadRecentTrips } from '../utils/storage'

const caughtExamples = [
  {
    title: 'The fake-cheap fare',
    copy: 'A low cabin price that stops looking low once taxes, travel, and add-ons join the bill.',
  },
  {
    title: 'The package trap',
    copy: 'A drink, dining, WiFi, or Key upgrade that sounds useful but does not earn its keep.',
  },
  {
    title: 'The total that doubles',
    copy: 'A trip that looks manageable until flights, hotel, excursions, and onboard spend land at once.',
  },
]

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
        description="Cheap fares are the bait. This shows the real trip cost, what is actually included, and which upgrades deserve your money before checkout gets cute."
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
            <li>Drink packages that quietly waste hundreds</li>
            <li>WiFi plans you do not need</li>
            <li>Dining packages you will not use enough</li>
            <li>Cheap fares that turn into expensive trips</li>
          </ul>
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="What this catches"
          description="The expensive mistakes usually hide in separate screens. This pulls them into daylight."
        />
        <div className="card-grid">
          {caughtExamples.map((item) => (
            <article key={item.title} className="card info-card catch-card">
              <span className="step-badge">Caught</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="Start here"
          description="Use the tools in the order the money decisions actually happen."
        />
        <div className="decision-flow-grid">
          <Link className="card info-card decision-flow-card decision-flow-card-primary" to="/tools/deal-evaluator">
            <span className="step-badge">Step 1</span>
            <h3>Is this a good deal?</h3>
            <p>Test the fare before you let the word "deal" anywhere near it.</p>
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
            <p>Keep the upgrades that earn their keep. Cut the expensive passengers.</p>
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
          title="Then check the details"
          description="Once the big number makes sense, refine the plan instead of reopening every tab like a raccoon with WiFi."
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
          <Link className="card info-card" to="/dining">
            <div className="card-topline">
              <h3>Dining Explorer</h3>
              <span className="status-pill">Live</span>
            </div>
            <p>Check what is included on your ship before buying dining like a reflex.</p>
            <span className="card-link">Explore ship dining</span>
          </Link>
          <Link className="card info-card" to="/snapshot">
            <div className="card-topline">
              <h3>Trip Snapshot</h3>
              <span className="status-pill">Live</span>
            </div>
            <p>Review the latest saved calculator outputs in one place.</p>
            <span className="card-link">View final answer</span>
          </Link>
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="Lower-priority utilities"
          description="Useful after the money decisions stop wobbling."
        />
        <div className="card-grid">
          <Link className="card info-card" to="/packing">
            <div className="card-topline">
              <h3>Packing</h3>
              <span className="status-pill">Live</span>
            </div>
            <p>Build a list that matches the sailing, not a generic beach vacation.</p>
            <span className="card-link">Build checklist</span>
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
