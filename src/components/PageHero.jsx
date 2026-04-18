export default function PageHero({ eyebrow, title, description, actions }) {
  return (
    <section className="hero card hero-card">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      <p className="hero-copy">{description}</p>
      {actions ? <div className="hero-actions">{actions}</div> : null}
    </section>
  )
}
