import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'

export default function AboutPage() {
  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="About"
        title="Built to help you not overpay for a cruise"
        description="Cruise pricing looks simple until drinks, WiFi, excursions, gratuities, flights, and hotel costs start piling on. Royal exists to show the real cost before the booking flow gets cute."
      />

      <section className="card prose-card">
        <SectionHeader
          title="Why this exists"
          description="Cruise pricing is fragmented on purpose. The base fare looks reasonable, then the expensive part shows up later in drinks, WiFi, excursions, flights, hotel nights, and everything else around the sailing. Most people make those decisions without seeing the full picture first."
        />
      </section>

      <section className="card prose-card">
        <SectionHeader title="What this site actually does" />
        <ul className="changelog-list">
          <li>Shows the real trip cost, not the brochure price.</li>
          <li>Compares two trip versions side by side.</li>
          <li>Checks whether add-ons like drink packages or The Key are actually worth it.</li>
          <li>Keeps trip details, notes, and planning in one place.</li>
        </ul>
      </section>

      <section className="card prose-card">
        <SectionHeader title="What it is not" />
        <ul className="changelog-list">
          <li>Not affiliated with Royal Caribbean.</li>
          <li>Not a booking site.</li>
          <li>Not trying to sell you anything.</li>
        </ul>
      </section>

      <section className="card prose-card">
        <p>
          This is built to help you make expensive decisions with your eyes open.
        </p>
      </section>
    </div>
  )
}
