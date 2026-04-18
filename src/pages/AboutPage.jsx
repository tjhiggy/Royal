import PageHero from '../components/PageHero'

export default function AboutPage() {
  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="About"
        title="Royal is an independent planning tool for Royal Caribbean travelers."
        description="It is built to simplify decisions, organize cruise planning, and give travelers a calmer way to compare costs, prep smarter, and keep details in one place."
      />

      <section className="card prose-card">
        <p>
          This project is a hobby site MVP, not an official Royal Caribbean product. The point is simple: trim friction,
          surface the boring but useful math, and keep cruise planning from turning into a scavenger hunt across tabs,
          screenshots, and half-remembered notes.
        </p>
      </section>
    </div>
  )
}
