import { Link } from 'react-router-dom'

export default function InfoCard({
  title,
  description,
  to,
  badge,
  ctaLabel,
  icon,
  muted = false,
  priorityLabel,
}) {
  const body = (
    <>
      <div className="card-topline">
        <div className="info-card-title-row">
          <span className="tool-icon" aria-hidden="true">{icon ?? title.slice(0, 1)}</span>
          <h3>{title}</h3>
        </div>
        {priorityLabel ? <span className="step-badge">{priorityLabel}</span> : badge ? <span className={`status-pill ${muted ? 'status-muted' : ''}`}>{badge}</span> : null}
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
