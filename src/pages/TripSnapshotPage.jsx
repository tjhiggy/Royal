import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import ShareActions from '../components/ShareActions'
import { formatCurrency } from '../utils/formatters'
import { getCurrentShareUrl } from '../utils/share'
import { loadPlannerState, loadRecentTrips, loadSnapshotState } from '../utils/storage'
import {
  buildSnapshotShortShareText,
  buildSnapshotSummaryText,
  buildTripSnapshot,
} from '../utils/tripSnapshot'

const snapshotPlannerDefaults = {
  shipName: '',
}

function SnapshotMetric({ label, value, helper }) {
  return (
    <article className="stat-card stat-card-emphasized">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {helper ? <small className="stat-helper">{helper}</small> : null}
    </article>
  )
}

function SnapshotPrompt({ item }) {
  return (
    <Link className="card info-card snapshot-prompt-card" to={item.to}>
      <span className="step-badge">Next</span>
      <h3>{item.title}</h3>
      <p>{item.copy}</p>
      <span className="card-link">Open tool</span>
    </Link>
  )
}

function buildSnapshotActionItems(snapshot) {
  const actions = []

  if (!snapshot.hasCostData) {
    actions.push({
      title: 'Run real cost first',
      detail: 'Snapshot cannot judge the trip until fare, required costs, travel, and add-ons are in the same room.',
      to: '/tools/cruise-cost',
    })
  }

  if (!snapshot.drinkResults && snapshot.costForm?.drinkPackage) {
    actions.push({
      title: 'Test the drink package',
      detail: 'A drink cost is already in the trip total. Run the package math before calling it done.',
      to: '/tools/drink-package',
    })
  }

  if (!snapshot.diningPackageResults && snapshot.costForm?.dining) {
    actions.push({
      title: 'Test dining spend',
      detail: 'Dining is in the budget. Check the package against your ship context and realistic meal use.',
      to: '/tools/dining-package',
    })
  }

  if (!snapshot.compareSnapshot) {
    actions.push({
      title: 'Compare a leaner version',
      detail: 'Use Compare when the decision is not yes/no, but expensive version versus smarter version.',
      to: '/compare',
    })
  }

  if (snapshot.quickWins[0]) {
    actions.push({
      title: 'Use the best savings move',
      detail: snapshot.quickWins[0],
      to: '/snapshot',
    })
  }

  return actions.slice(0, 3)
}

export default function TripSnapshotPage() {
  const [recentTrips, setRecentTrips] = useState([])
  const [plannerState, setPlannerState] = useState(snapshotPlannerDefaults)
  const [snapshotState, setSnapshotState] = useState({})

  useEffect(() => {
    setRecentTrips(loadRecentTrips())
    setPlannerState(loadPlannerState(snapshotPlannerDefaults))
    setSnapshotState(loadSnapshotState({}))
  }, [])

  const snapshot = useMemo(
    () => buildTripSnapshot({ snapshotState, recentTrips, plannerState }),
    [snapshotState, recentTrips, plannerState],
  )

  const shareUrl = () => getCurrentShareUrl()
  const fullSummary = () => buildSnapshotSummaryText(snapshot, shareUrl())
  const shortSummary = () => buildSnapshotShortShareText(snapshot, shareUrl())
  const [bestQuickWin, ...otherQuickWins] = snapshot.quickWins
  const completionItems = [
    { label: 'Deal', complete: snapshot.hasDealData },
    { label: 'Cost', complete: snapshot.hasCostData },
    { label: 'Upgrades', complete: snapshot.upgradeVerdicts.some((item) => !['Needs check', 'Not in current plan', 'Choose ship'].includes(item.value)) },
    { label: 'Dining', complete: snapshot.hasUserShip },
    { label: 'Compare', complete: Boolean(snapshot.compareSnapshot) },
  ]
  const completionCount = completionItems.filter((item) => item.complete).length
  const actionItems = buildSnapshotActionItems(snapshot)

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Trip Snapshot"
        title="The final answer before booking"
        description="Real cost, cost per night, biggest drivers, upgrade verdicts, dining caveats, quick wins, and share text. One page. Finally."
      />

      <section className="card snapshot-hero-card">
        <div className="snapshot-verdict-panel">
          <span className="verdict-kicker">Final answer</span>
          <h2>{snapshot.mainVerdict}</h2>
          <p>{snapshot.mainLine}</p>
          <div className="verdict-highlight snapshot-warning">
            <span>Main warning</span>
            <strong>{snapshot.mainWarning}</strong>
          </div>
          <p className="snapshot-source-note">{snapshot.sourceLine}</p>
          <div className="snapshot-readiness">
            <div>
              <span>Decision readiness</span>
              <strong>{completionCount} of {completionItems.length} checks complete</strong>
            </div>
            <div className="engine-chip-row">
              {completionItems.map((item) => (
                <span key={item.label} className={item.complete ? 'engine-chip-complete' : ''}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <div className="snapshot-share-card">
            <div>
              <strong>Share this call</strong>
              <span>Copy the clean version for whoever has to approve this bill.</span>
            </div>
            <ShareActions
              summary={fullSummary}
              shortSummary={shortSummary}
              getLink={shareUrl}
              compact
            />
          </div>
          <div className="snapshot-copy-preview">
            <span>Copy preview</span>
            <p>{shortSummary().split('\n').filter(Boolean).slice(0, 3).join(' ')}</p>
          </div>
        </div>

        {snapshot.keyMetrics.length ? (
          <div className="stats-grid snapshot-top-stats">
            {snapshot.keyMetrics.map((metric) => (
              <SnapshotMetric key={metric.label} {...metric} />
            ))}
          </div>
        ) : (
          <div className="card callout-card snapshot-empty-card">
            <strong>No real trip total yet.</strong>
            <p>Run Deal Evaluator or Cruise Cost Calculator first. Snapshot gets much sharper once it has actual cost data.</p>
            <div className="snapshot-empty-actions">
              <Link className="button button-primary" to="/tools/deal-evaluator">
                Start with deal check
              </Link>
              <Link className="button button-secondary" to="/tools/cruise-cost">
                Add real trip cost
              </Link>
            </div>
          </div>
        )}
      </section>

      {snapshot.upgradeVerdicts.length ? (
        <section className="card">
          <SectionHeader
            title="Upgrade verdicts"
            description="The package decisions in one place. No upgrade gets to hide behind vibes."
          />
          <div className="snapshot-verdict-grid">
            {snapshot.upgradeVerdicts.map((item) => (
              <article key={item.label} className="verdict-highlight snapshot-upgrade-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {actionItems.length ? (
        <section className="card snapshot-action-brief">
          <SectionHeader
            title="Action brief"
            description="The short version of what to do next. Useful because nobody needs another decorative dashboard pretending to help."
          />
          <div className="snapshot-action-list">
            {actionItems.map((item, index) => (
              <Link key={item.title} className="snapshot-action-item" to={item.to}>
                <span className="driver-rank">{index + 1}</span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {snapshot.compareSnapshot ? (
        <section className="card comparison-band-card">
          <SectionHeader
            title="Scenario comparison"
            description="The latest saved Compare result from this browser."
          />
          <div className="verdict-highlight">
            <span>Main takeaway</span>
            <strong>
              {snapshot.compareSnapshot.comparison.totalDifference === 0
                ? `${snapshot.compareSnapshot.scenarioALabel} and ${snapshot.compareSnapshot.scenarioBLabel} are basically tied.`
                : `${snapshot.compareSnapshot.pricierLabel} costs about ${formatCurrency(snapshot.compareSnapshot.comparison.absoluteTotalDifference)} more.`}
            </strong>
          </div>
          <div className="stats-grid">
            <SnapshotMetric label="Total gap" value={formatCurrency(snapshot.compareSnapshot.comparison.absoluteTotalDifference)} />
            <SnapshotMetric label="Nightly gap" value={formatCurrency(snapshot.compareSnapshot.comparison.absoluteCostPerNightDifference)} />
            <SnapshotMetric label="Add-ons gap" value={formatCurrency(snapshot.compareSnapshot.comparison.absoluteAddOnsDifference)} />
          </div>
        </section>
      ) : null}

      {snapshot.diningStrategy ? (
        <section className="card dining-strategy-card">
          <SectionHeader
            title="Dining strategy"
            description={
              snapshot.hasUserShip
                ? `Using ${snapshot.diningShip.shipName} from your local planning data.`
                : `Using ${snapshot.diningShip.shipName} only as a sample. Pick your ship for a real dining call.`
            }
          />
          <div className="verdict-highlight dining-strategy-highlight">
            <span>Dining call</span>
            <strong>{snapshot.diningStrategy.packageVerdict}</strong>
          </div>
          <div className="explanation-list">
            {snapshot.diningStrategy.strategyLines.slice(0, 2).map((line) => (
              <div key={line} className="explanation-item">
                <span>{line}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {snapshot.costDrivers.length ? (
        <section className="card">
          <SectionHeader
            title="Biggest cost drivers"
            description="Actionable spend gets priority here. The base fare already did its damage."
          />
          <div className="driver-list">
            {snapshot.costDrivers.map((driver, index) => (
              <article key={driver.key} className="driver-item">
                <span className="driver-rank">{index + 1}</span>
                <div className="driver-copy">
                  <strong>{driver.label}</strong>
                  <span>{snapshot.costResults?.grandTotal ? `${((driver.value / snapshot.costResults.grandTotal) * 100).toFixed(0)}% of the real total` : 'Included in the total'}</span>
                </div>
                <strong className="driver-value">{formatCurrency(driver.value)}</strong>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {snapshot.quickWins.length ? (
        <section className="card callout-card">
          <SectionHeader
            title="Quick wins"
            description="The best savings moves based on the data Snapshot has right now."
          />
          <div className="verdict-highlight snapshot-best-win">
            <span>Best savings move</span>
            <strong>{bestQuickWin}</strong>
          </div>
          <div className="explanation-list">
            {otherQuickWins.map((win) => (
              <div key={win} className="explanation-item">
                <span>{win}</span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="card callout-card snapshot-empty-card">
          <SectionHeader
            title="Quick wins"
            description="No savings moves yet because Snapshot does not have enough cost or upgrade data."
          />
          <div className="snapshot-empty-actions">
            <Link className="button button-primary" to="/tools/cruise-cost">
              Add trip costs
            </Link>
            <Link className="button button-secondary" to="/tools/drink-package">
              Check upgrades
            </Link>
          </div>
        </section>
      )}

      {snapshot.nextSteps.length ? (
        <section className="page-section">
          <SectionHeader
            title="What to do next"
            description="Missing data is not a moral failure. It just means Snapshot is not done sharpening the knife."
          />
          <div className="card-grid">
            {snapshot.nextSteps.map((item) => (
              <SnapshotPrompt key={item.to} item={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
