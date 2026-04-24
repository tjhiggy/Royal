export default function AssumptionsPanel({ title = 'Assumptions used', items }) {
  return (
    <details className="card assumptions-panel">
      <summary>
        <span>{title}</span>
        <strong>How this estimate works</strong>
      </summary>
      <div className="assumptions-list">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </details>
  )
}
