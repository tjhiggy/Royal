import { Link } from 'react-router-dom'

export default function DecisionNextStep({ title, description, links }) {
  return (
    <section className="card decision-next-card">
      <div className="decision-next-copy">
        <span className="verdict-kicker">Next step</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="decision-next-links">
        {links.map((link, index) => (
          <Link key={link.to} className={`button ${index === 0 ? 'button-primary' : 'button-secondary'}`} to={link.to}>
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
