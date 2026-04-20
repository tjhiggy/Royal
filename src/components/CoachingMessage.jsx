export default function CoachingMessage({ title = 'Coach says', message }) {
  if (!message) {
    return null
  }

  return (
    <section className="card coaching-card" aria-label={title}>
      <span className="verdict-kicker">{title}</span>
      <strong>{message}</strong>
    </section>
  )
}
