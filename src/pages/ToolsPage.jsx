import InfoCard from '../components/InfoCard'
import PageHero from '../components/PageHero'
import { toolCards } from '../data/siteContent'

export default function ToolsPage() {
  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Tools"
        title="Cruise calculators that are useful on day one."
        description="The live tools focus on price clarity and trip planning. The placeholders are there so the site can grow without turning into a tangled mess later."
      />

      <section className="card-grid">
        {toolCards.map((card) => (
          <InfoCard key={card.title} {...card} muted={!card.to} />
        ))}
      </section>
    </div>
  )
}
