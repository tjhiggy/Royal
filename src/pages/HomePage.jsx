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
        title="Plan your Royal Caribbean trip without guessing, overspending, or forgetting the obvious."
        description="Royal is a clean cruise planning hub with practical calculators, a smart packing generator, and a trip planner that actually remembers your work."
        actions={
          <>
            <Link className="button button-primary" to="/tools">
              Explore tools
            </Link>
            <Link className="button button-secondary" to="/planner">
              Open planner
            </Link>
          </>
        }
      />

      <section className="page-section">
        <SectionHeader
          title="Start Here"
          description="The MVP focuses on the core pain points most cruise planners hit first: budget, package value, packing, and remembering all the logistics."
        />
        <div className="card-grid">
          {toolCards.slice(0, 3).map((card) => (
            <InfoCard key={card.title} {...card} muted={!card.to} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader title="Included in Version 1" description="Useful now, easy to extend later." />
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
