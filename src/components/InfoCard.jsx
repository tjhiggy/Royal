import { Link } from 'react-router-dom'

export default function InfoCard({
  title,
  description,
  to,
  badge,
  ctaLabel,
  muted = false,
}) {
  const body = (
    <>
      <div className="card-topline">
        <h3>{title}</h3>
        {badge ? <span className={`status-pill ${muted ? 'status-muted' : ''}`}>{badge}</span> : null}
      </div>
      <p>{description}</p>
      {to ? <span className="card-link">{ctaLabel ?? 'Use this tool'}</span> : <span className="card-link">{ctaLabel ?? 'Coming soon'}</span>}
    </>
  )

  if (!to) {
    return <article className="card info-card muted-card">{body}</article>
  }

  return (
    <Link className="card info-card" to={to}>
      {body}
    </Link>
  )
}
