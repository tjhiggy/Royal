import PageHero from '../components/PageHero'

export default function AboutPage() {
  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="About"
        title="Royal is an independent planning tool for Royal Caribbean trips"
        description="It helps you check real costs, compare choices, and keep the trip details in one place without the usual planning mess."
      />

      <section className="card prose-card">
        <p>
          Royal is a hobby project, not an official Royal Caribbean product. The goal is simple: pull the useful math,
          planning details, and decision points into one place so cruise planning does not turn into a scavenger hunt
          across tabs, screenshots, and half-remembered notes.
        </p>
      </section>
    </div>
  )
}
