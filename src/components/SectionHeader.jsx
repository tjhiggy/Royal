export default function SectionHeader({ title, description }) {
  return (
    <div className="section-header">
      <div className="section-title-row">
        <span className="section-icon" aria-hidden="true">{title.slice(0, 1)}</span>
        <h2>{title}</h2>
      </div>
      {description ? <p>{description}</p> : null}
    </div>
  )
}
