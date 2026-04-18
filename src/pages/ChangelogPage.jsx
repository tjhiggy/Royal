import PageHero from '../components/PageHero'
import { releaseInfo } from '../data/releaseInfo'

export default function ChangelogPage() {
  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Changelog"
        title="Recent changes to Royal"
        description="Use this page to confirm what shipped, when it landed, and whether the latest deployment is actually live."
      />

      <section className="page-section">
        {releaseInfo.changelogEntries.map((entry) => (
          <article key={entry.version} className="card changelog-card">
            <div className="card-topline">
              <h2>{entry.version}</h2>
              <span className="status-pill">{entry.date}</span>
            </div>
            <ul className="changelog-list">
              {entry.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  )
}
