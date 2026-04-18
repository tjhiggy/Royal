import { Link } from 'react-router-dom'
import InfoCard from '../components/InfoCard'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import { featureList, toolCards } from '../data/siteContent'

export default function HomePage() {
  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Cruise planning without the spreadsheet spiral"
        title="Plan your Royal Caribbean cruise without guessing the cost"
        description="Most cruise prices look cheap until you add drinks, WiFi, excursions, and travel. Royal shows you what the trip actually costs and whether the upgrades are worth it."
        actions={
          <>
            <Link className="button button-primary" to="/tools/cruise-cost">
              Check your real cost
            </Link>
            <Link className="button button-secondary" to="/tools/drink-package">
              Is the drink package worth it?
            </Link>
          </>
        }
      />

      <section className="page-section">
        <SectionHeader
          title="Start with these before you book anything"
          description="Most people make these calls half-blind, then act surprised when the total gets ugly."
        />
        <div className="card-grid">
          {toolCards.slice(0, 3).map((card) => (
            <InfoCard key={card.title} {...card} muted={!card.to} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="Why this exists"
          description="Cruise pricing is fragmented by design. The fare looks manageable, then drinks, WiFi, excursions, gratuities, and travel pile on. Royal pulls those costs into one place so you can make the expensive decisions with your eyes open."
        />
      </section>

      <section className="page-section">
        <SectionHeader title="Use these now" description="Start with the money decisions, then clean up the rest of the trip." />
        <div className="feature-list">
          {featureList.map((feature) => (
            <article key={feature} className="card feature-card">
              <p>{feature}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
