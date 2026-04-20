import ShareActions from './ShareActions'

export default function BrutalSummary({ lines, getLink }) {
  const summary = () => lines.filter(Boolean).join('\n')

  return (
    <section className="card brutal-summary-card">
      <div className="brutal-summary-copy">
        <span className="verdict-kicker">Brutal summary</span>
        <div className="brutal-summary-lines">
          {lines.filter(Boolean).map((line) => (
            <strong key={line}>{line}</strong>
          ))}
        </div>
      </div>
      <ShareActions summary={summary} getLink={getLink} compact />
    </section>
  )
}
