import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import {
  clearRecentTrips,
  loadRecentTrips,
  removeRecentTripById,
  renameRecentTrip,
  toggleRecentTripPin,
} from '../utils/storage'

const decisionPath = [
  {
    step: '01',
    label: 'Guided Start',
    title: 'Give the engine the trip shape',
    copy: 'Start with nights, travelers, fare, and the costs every other decision leans on.',
    to: '/start',
    cta: 'Start guided plan',
  },
  {
    step: '02',
    label: 'Deal',
    title: 'Expose fake-cheap pricing',
    copy: 'A low fare is not a deal until travel, taxes, and extras survive inspection.',
    to: '/tools/deal-evaluator',
    cta: 'Check the deal',
  },
  {
    step: '03',
    label: 'Cost',
    title: 'Build the real number',
    copy: 'Fare, gratuities, flights, hotel, excursions, parking, packages, and the other little budget knives.',
    to: '/tools/cruise-cost',
    cta: 'Calculate real cost',
  },
  {
    step: '04',
    label: 'Upgrades',
    title: 'Make packages earn their seat',
    copy: 'Drinks, dining, WiFi, and The Key get verdicts. Vibes do not get a purchase order.',
    to: '/tools',
    cta: 'Test upgrades',
  },
  {
    step: '05',
    label: 'Book',
    title: 'Make the booking call',
    copy: 'Use the flagship verdict to decide whether this is Book Now, Wait, or Walk Away.',
    to: '/should-i-book',
    cta: 'Get booking verdict',
  },
  {
    step: '06',
    label: 'Snapshot',
    title: 'Leave with the final answer',
    copy: 'Review the verdict, biggest drivers, upgrade calls, quick wins, and share text in one place.',
    to: '/snapshot',
    cta: 'View Snapshot',
  },
]

const priorityTools = [
  { title: 'Deal Evaluator', copy: 'Decide whether the sailing is actually worth chasing.', to: '/tools/deal-evaluator' },
  { title: 'Cruise Cost', copy: 'Turn the fare into the full trip total.', to: '/tools/cruise-cost' },
  { title: 'Should I Book?', copy: 'Get the blunt Book, Wait, or Walk Away call.', to: '/should-i-book' },
  { title: 'Upgrade Checks', copy: 'Challenge drinks, dining, WiFi, and The Key.', to: '/tools' },
  { title: 'Trip Snapshot', copy: 'Copy the final call for the travel group.', to: '/snapshot' },
]

const caughtExamples = [
  {
    label: 'Fake-cheap fare',
    before: '$2,200 fare',
    after: '$4,900 real trip',
    copy: 'Flights, hotel, gratuities, excursions, and package spend turned the headline fare into a very different animal.',
  },
  {
    label: 'Drink package overbuy',
    before: '$950 package',
    after: '$380 habit',
    copy: 'The package only works when the daily drink pace is real, not a vacation persona with a receipt printer.',
  },
  {
    label: 'WiFi creep',
    before: '2 devices',
    after: '1 shared plan',
    copy: 'A second device can be convenience spend masquerading as need. Sometimes the smart answer is boring. Good.',
  },
  {
    label: 'Dining package reflex',
    before: '$630 package',
    after: '2 real meals',
    copy: 'If the ship already has enough included dining, the package has to beat actual meal plans, not menu browsing.',
  },
]

const trustPoints = [
  'Built around real cruise pricing patterns: fare, fees, travel, add-ons, and onboard spend.',
  'Uses editable assumptions so you can replace defaults with the numbers you are actually seeing.',
  'Runs locally in your browser with no account, backend, or sales funnel lurking behind the curtain.',
  'Independent tool. Not affiliated with Royal Caribbean.',
]

function formatRecentTripTime(updatedAt) {
  if (!updatedAt) {
    return 'Unknown time'
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(updatedAt))
}

function getRecentTripTitle(trip) {
  if (trip.customLabel) {
    return trip.customLabel
  }

  if (trip.tool === 'compare') {
    return `Compare: ${trip.label}`
  }

  if (trip.tool === 'snapshot') {
    return `Snapshot: ${trip.label}`
  }

  return trip.label || `${trip.toolLabel} session`
}

export default function HomePage() {
  const [recentTrips, setRecentTrips] = useState([])

  useEffect(() => {
    setRecentTrips(loadRecentTrips())
  }, [])

  function removeRecentTrip(id) {
    setRecentTrips(removeRecentTripById(id))
  }

  function clearAllRecentTrips() {
    setRecentTrips(clearRecentTrips())
  }

  function renameTrip(trip) {
    const nextName = window.prompt('Rename this saved trip session:', getRecentTripTitle(trip))
    if (nextName === null) {
      return
    }

    setRecentTrips(renameRecentTrip(trip.id, nextName))
  }

  function togglePin(trip) {
    setRecentTrips(toggleRecentTripPin(trip.id))
  }

  return (
    <div className="container page-stack">
      <section className="home-command hero-card card">
        <div className="home-command-copy">
          <p className="eyebrow">Cruise Decision Engine 2.0</p>
          <h1>Book the trip you meant to buy.</h1>
          <p className="hero-copy">
            Royal Caribbean pricing gets fragmented fast. This turns the fare, real cost, upgrades, dining caveats, comparisons, and final shareable answer into one guided decision system.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/start">
              Start Guided Plan
            </Link>
            <Link className="button button-secondary" to="/tools/deal-evaluator">
              Check Deal First
            </Link>
            <Link className="button button-ghost" to="/should-i-book">
              Should I Book?
            </Link>
            <Link className="button button-ghost" to="/snapshot">
              View Snapshot
            </Link>
          </div>
        </div>

        <div className="home-engine-panel" aria-label="Cruise Decision Engine preview">
          <div className="engine-panel-header">
            <span>Decision route</span>
            <strong>Home to Snapshot</strong>
          </div>
          <div className="engine-route-list">
            {['Home', 'Guided', 'Deal', 'Cost', 'Upgrades', 'Dining', 'Compare', 'Book', 'Snapshot'].map((item, index) => (
              <span key={item} className={index === 8 ? 'engine-route-active' : ''}>
                {item}
              </span>
            ))}
          </div>
          <div className="snapshot-preview-card">
            <span className="verdict-kicker">Sample final-answer preview</span>
            <strong>Real cost beats headline fare.</strong>
            <div className="snapshot-preview-grid">
              <span>
                <small>Real trip cost</small>
                <b>$5,420</b>
              </span>
              <span>
                <small>Cost per night</small>
                <b>$774</b>
              </span>
            </div>
            <div className="engine-chip-row">
              <span>Driver: drinks</span>
              <span>Dining: check ship</span>
              <span>Share ready</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-header-with-action">
          <SectionHeader
            title="Continue where you left off"
            description="Your last 3 decision sessions from this browser. Pin the important one, rename the messy one, reopen the work."
          />
          {recentTrips.length ? (
            <button type="button" className="button button-ghost" onClick={clearAllRecentTrips}>
              Clear all
            </button>
          ) : null}
        </div>
        {recentTrips.length ? (
          <div className="recent-trip-list">
            {recentTrips.map((trip) => (
              <article key={trip.id} className={`card recent-trip-card ${trip.isPinned ? 'recent-trip-card-pinned' : ''}`}>
                <Link className="recent-trip-main" to={`${trip.path}?recent=${trip.id}`}>
                  <div>
                    <strong>{getRecentTripTitle(trip)}</strong>
                    <span>{trip.toolLabel}</span>
                  </div>
                  <small>{trip.isPinned ? 'Pinned' : 'Updated'} {formatRecentTripTime(trip.updatedAt)}</small>
                </Link>
                <div className="recent-trip-actions">
                  <button type="button" className="recent-trip-control" onClick={() => togglePin(trip)}>
                    {trip.isPinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button type="button" className="recent-trip-control" onClick={() => renameTrip(trip)}>
                    Rename
                  </button>
                  <button type="button" className="recent-trip-remove" onClick={() => removeRecentTrip(trip.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card recent-empty-card">
            <div>
              <span className="verdict-kicker">No recent trips yet</span>
              <h3>Start once, then this becomes your return lane.</h3>
              <p>Recent sessions save locally in this browser for Deal, Cost, Compare, and Snapshot. No account. No sales funnel. Just your last few decisions waiting here.</p>
            </div>
            <div className="hero-actions">
              <Link className="button button-primary" to="/start">
                Start guided plan
              </Link>
              <Link className="button button-secondary" to="/tools/cruise-cost">
                Add trip cost
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="page-section">
        <SectionHeader
          title="Why use this before booking?"
          description="Because the number that sells the cruise is rarely the number that funds the trip. Cute trick. Expensive trick."
        />
        <div className="home-priority-grid">
          {priorityTools.map((tool) => (
            <Link key={tool.title} className="card info-card home-priority-card" to={tool.to}>
              <h3>{tool.title}</h3>
              <p>{tool.copy}</p>
              <span className="card-link">Open</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="Run the decision path"
          description="Use the site in the order the money decisions actually happen. Revolutionary, apparently."
        />
        <div className="engine-timeline">
          {decisionPath.map((item) => (
            <Link key={item.step} className="engine-timeline-item" to={item.to}>
              <span className="engine-step-number">{item.step}</span>
              <span className="engine-step-copy">
                <small>{item.label}</small>
                <strong>{item.title}</strong>
                <em>{item.copy}</em>
              </span>
              <span className="engine-step-cta">{item.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="What this catches"
          description="Illustrative examples, not user data. The point is to catch the expensive pattern before checkout smiles at you."
        />
        <div className="caught-example-grid">
          {caughtExamples.map((example) => (
            <article key={example.label} className="card caught-example-card">
              <span className="step-badge">Example</span>
              <h3>{example.label}</h3>
              <div className="caught-example-swing">
                <span>{example.before}</span>
                <strong>{example.after}</strong>
              </div>
              <p>{example.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card trust-card">
        <SectionHeader
          title="How this works"
          description="Short version: it forces the real trip cost into the open before the booking flow gets persuasive."
        />
        <div className="trust-point-grid">
          {trustPoints.map((point) => (
            <div key={point} className="trust-point">
              <span aria-hidden="true">OK</span>
              <p>{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card home-final-band">
        <div>
          <span className="verdict-kicker">The point</span>
          <h2>Snapshot is the finish line, not another dashboard.</h2>
          <p>
            Run the key decisions, then Snapshot gives you the verdict, real cost, cost per night, biggest drivers, upgrade calls, quick wins, and copyable text for the person who has to hear the number.
          </p>
        </div>
        <Link className="button button-primary" to="/snapshot">
          Get final answer
        </Link>
      </section>
    </div>
  )
}
