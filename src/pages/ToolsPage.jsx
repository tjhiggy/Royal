import InfoCard from '../components/InfoCard'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import { toolCards } from '../data/siteContent'

const moneyOrder = [
  'Deal Evaluator',
  'Cruise Cost Calculator',
  'Drink Package Calculator',
  'Dining Package Calculator',
  'WiFi Calculator',
  'The Key Calculator',
]

const planningOrder = [
  'Dining Explorer',
  'Compare Scenarios',
  'Trip Snapshot',
  'Packing Generator',
  'Planner',
]

function getCards(names) {
  return names
    .map((name) => toolCards.find((card) => card.title === name))
    .filter(Boolean)
}

export default function ToolsPage() {
  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Upgrades and tools"
        title="Challenge the expensive stuff"
        description="The tool catalog still exists, but the hierarchy is clearer now: deal, cost, upgrade verdicts, dining, compare, Snapshot. Wild idea, putting the important decisions first."
      />

      <section className="page-section">
        <SectionHeader
          title="Primary money decisions"
          description="Use these before checkout turns optional upgrades into a personality test."
        />
        <div className="card-grid tool-priority-grid">
          {getCards(moneyOrder).map((card, index) => (
            <InfoCard key={card.title} {...card} muted={!card.to} priorityLabel={`Step ${index + 3}`} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="Planning and final answer"
          description="Use these after the big money calls are visible."
        />
        <div className="card-grid">
          {getCards(planningOrder).map((card) => (
            <InfoCard key={card.title} {...card} muted={!card.to} />
          ))}
        </div>
      </section>
    </div>
  )
}
