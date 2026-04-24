import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import ShareActions from '../components/ShareActions'
import { formatCurrency } from '../utils/formatters'
import { getCurrentShareUrl } from '../utils/share'
import { loadPlannerState, loadRecentTrips, loadSnapshotState } from '../utils/storage'
import { buildTripBriefText, buildTripSnapshot } from '../utils/tripSnapshot'

const snapshotPlannerDefaults = {
  shipName: '',
}

function BriefMetric({ label, value, helper }) {
  return (
    <article className="brief-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <small>{helper}</small> : null}
    </article>
  )
}

export default function TripBriefPage() {
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
  const briefText = () => buildTripBriefText(snapshot, getCurrentShareUrl())

  function handlePrint() {
    window.print()
  }

  return (
    <div className="container page-stack brief-page">
      <section className="brief-shell">
        <div className="brief-header">
          <div>
            <span className="verdict-kicker">My Trip Brief</span>
            <h1>{snapshot.hasCostData ? 'The booking call, without the fluff' : 'Finish the cost check before booking'}</h1>
            <p>
              {snapshot.hasCostData
                ? 'Built from the latest calculator data saved in this browser. Good enough to send to the group, blunt enough to be useful.'
                : 'This brief needs Deal or Cruise Cost data before it can do the job.'}
            </p>
          </div>
          <div className="brief-actions">
            <ShareActions
              summary={briefText}
              getLink={getCurrentShareUrl}
              summaryLabel="Copy brief"
              linkLabel="Copy brief link"
              compact
            />
            <button type="button" className="button button-secondary" onClick={handlePrint}>
              Print brief
            </button>
          </div>
        </div>

        <div className="brief-verdict">
          <span className="verdict-kicker">Trip verdict</span>
          <strong>{snapshot.mainVerdict}</strong>
          <p>{snapshot.mainLine}</p>
          <div className="verdict-highlight snapshot-warning">
            <span>Biggest mistake risk</span>
            <strong>{snapshot.mainWarning}</strong>
          </div>
        </div>

        {snapshot.costResults ? (
          <div className="brief-metric-grid">
            <BriefMetric label="Real cost" value={formatCurrency(snapshot.costResults.grandTotal)} helper="Full trip estimate" />
            <BriefMetric label="Cost per night" value={formatCurrency(snapshot.costResults.costPerNight)} helper="Best comparison number" />
            <BriefMetric label="Add-ons share" value={`${snapshot.costResults.extrasShare.toFixed(0)}%`} helper="Where upgrades hit" />
          </div>
        ) : (
          <div className="brief-empty">
            <strong>No real trip total yet.</strong>
            <p>Run Cruise Cost first. A brief without total cost is just vibes in a nice jacket.</p>
            <Link className="button button-primary" to="/tools/cruise-cost">
              Add real trip cost
            </Link>
          </div>
        )}

        <div className="brief-section-grid">
          <section>
            <SectionHeader title="Top cost drivers" description="The numbers most likely to change the decision." />
            <div className="brief-list">
              {snapshot.costDrivers.length ? snapshot.costDrivers.slice(0, 4).map((driver) => (
                <div key={driver.key} className="brief-list-item">
                  <span>{driver.label}</span>
                  <strong>{formatCurrency(driver.value)}</strong>
                </div>
              )) : (
                <p className="brief-muted">Cost drivers appear after Cruise Cost has saved a trip total.</p>
              )}
            </div>
          </section>

          <section>
            <SectionHeader title="Upgrade calls" description="Keep, question, or cut the packages." />
            <div className="brief-list">
              {snapshot.upgradeVerdicts.map((item) => (
                <div key={item.label} className="brief-list-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <small>{item.detail}</small>
                </div>
              ))}
            </div>
          </section>
        </div>

        {snapshot.diningStrategy ? (
          <section className="brief-dining">
            <SectionHeader
              title="Dining stance"
              description={snapshot.hasUserShip ? `Using ${snapshot.diningShip.shipName}.` : `Sample context: ${snapshot.diningShip.shipName}. Pick your ship for a firmer call.`}
            />
            <strong>{snapshot.diningStrategy.packageVerdict}</strong>
            <p>{snapshot.diningStrategy.strategyLines[0]}</p>
          </section>
        ) : null}

        <section>
          <SectionHeader title="Quick wins" description="The clean moves before anyone starts rationalizing checkout." />
          <div className="brief-list">
            {snapshot.quickWins.length ? snapshot.quickWins.slice(0, 4).map((win) => (
              <div key={win} className="brief-list-item brief-win">
                <span>{win}</span>
              </div>
            )) : (
              <p className="brief-muted">Run the missing package checks to expose quick wins.</p>
            )}
          </div>
        </section>
      </section>
    </div>
  )
}
