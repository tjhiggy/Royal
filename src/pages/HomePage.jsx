import { Link } from 'react-router-dom'
import InfoCard from '../components/InfoCard'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import { featureList, toolCards } from '../data/siteContent'

export default function HomePage() {
  const primaryCards = toolCards.slice(0, 3)
  const secondaryCards = toolCards.slice(3)

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Royal Caribbean decision engine"
        title="See the real trip. Make the smarter call."
        description="Cruise fares hide the expensive part. Royal shows what is included, what costs extra, and which upgrades are actually worth paying for before the budget gets away from you."
        actions={
          <>
            <Link className="button button-primary" to="/tools/deal-evaluator">
              Is this a good deal?
            </Link>
            <Link className="button button-secondary" to="/tools/cruise-cost">
              What will it really cost?
            </Link>
          </>
        }
      />

      <section className="page-section">
        <SectionHeader
          title="Start here"
          description="Do these in order if you want the fast version without the expensive mistakes."
        />
        <div className="feature-list">
          <article className="card feature-card">
            <h3>1. Is this a good deal?</h3>
            <p>Start with the Deal Evaluator before a low fare tricks you into calling an overpriced trip a bargain.</p>
          </article>
          <article className="card feature-card">
            <h3>2. What will it really cost?</h3>
            <p>Use the Cruise Cost Calculator to pull fare, extras, and travel into one honest total.</p>
          </article>
          <article className="card feature-card">
            <h3>3. Which upgrades are worth it?</h3>
            <p>Then check packages and add-ons so you stop paying premium prices for average decisions.</p>
          </article>
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="Use these first"
          description="These are the calls that move the budget, not the nice-to-have cleanup tasks."
        />
        <div className="card-grid">
          {primaryCards.map((card) => (
            <InfoCard key={card.title} {...card} muted={!card.to} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="Then check the details"
          description="Once the big money decisions are under control, use the ship and scenario tools to tighten the plan."
        />
        <div className="card-grid">
          {secondaryCards.map((card) => (
            <InfoCard key={card.title} {...card} muted={!card.to} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="Why this exists"
          description="Cruise pricing is fragmented on purpose. The base fare looks manageable, then dining, drinks, WiFi, excursions, and travel quietly turn it into a much more expensive trip. Royal pulls those decisions into one place so you can see the real cost before you commit."
        />
      </section>

      <section className="page-section">
        <SectionHeader
          title="Lower-priority utilities"
          description="Useful, yes. The first thing you should do, absolutely not."
        />
        <div className="card-grid">
          <Link className="card info-card" to="/packing">
            <div className="card-topline">
              <h3>Packing Generator</h3>
              <span className="status-pill">Live</span>
            </div>
            <p>Build a packing list once the real trip decisions are settled and you are done pretending chargers pack themselves.</p>
            <span className="card-link">Build your packing list</span>
          </Link>
          <Link className="card info-card" to="/planner">
            <div className="card-topline">
              <h3>Planner</h3>
              <span className="status-pill">Live</span>
            </div>
            <p>Keep reservations, notes, and trip details in one place after the budget math stops moving around.</p>
            <span className="card-link">Open the planner</span>
          </Link>
        </div>

        <div className="feature-list">
          {featureList.slice(0, 3).map((feature) => (
            <article key={feature} className="card feature-card">
              <p>{feature}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
