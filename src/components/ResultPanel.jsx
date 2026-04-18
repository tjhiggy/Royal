import { formatCurrency, formatNumber } from '../utils/formatters'

export default function ResultPanel({ title, stats, note, badge, intro }) {
  return (
    <section className="card results-panel">
      <div className="card-topline">
        <h2>{title}</h2>
        {badge ? <span className={`status-pill ${badge.className ?? ''}`}>{badge.label}</span> : null}
      </div>
      {intro ? <p className="results-intro">{intro}</p> : null}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <article
            key={stat.label}
            className={`stat-card ${stat.emphasized || index === 0 ? 'stat-card-emphasized' : ''}`}
          >
            <span className="stat-label">{stat.label}</span>
            <strong className="stat-value">
              {stat.format === 'number'
                ? formatNumber(stat.value)
                : formatCurrency(stat.value)}
            </strong>
            {stat.helper ? <small className="stat-helper">{stat.helper}</small> : null}
          </article>
        ))}
      </div>
      {note ? <p className="results-note">{note}</p> : null}
    </section>
  )
}
