import InfoCard from '../components/InfoCard'
import PageHero from '../components/PageHero'
import { toolCards } from '../data/siteContent'

export default function ToolsPage() {
  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Tools"
        title="Use the calculators before the cruise math gets sloppy"
        description="Start with the live tools that answer the expensive questions first, then use the rest as the site grows."
      />

      <section className="card-grid">
        {toolCards.map((card) => (
          <InfoCard key={card.title} {...card} muted={!card.to} />
        ))}
      </section>
    </div>
  )
}
