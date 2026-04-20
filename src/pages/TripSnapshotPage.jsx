import { useEffect, useMemo, useState } from 'react'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import { cruiseCostInitialState } from '../data/cruiseCostConfig'
import { activeRoyalShips, royalShipsBySlug } from '../data/royalShips'
import {
  calculateCruiseCost,
  calculateDealEvaluator,
  calculateDrinkPackage,
  calculateTheKey,
  calculateWifiRecommendation,
  compareCruiseCostScenarios,
} from '../utils/calculators'
import { buildDiningStrategy } from '../utils/diningStrategy'
import { formatCurrency } from '../utils/formatters'
import { loadPlannerState, loadRecentTrips } from '../utils/storage'

const snapshotDrinkInputs = {
  cruiseNights: cruiseCostInitialState.cruiseNights,
  packagePricePerPersonPerDay: 80,
  gratuityPercentage: 18,
  alcoholicDrinksPerDay: 4,
  specialtyCoffeesPerDay: 1,
  bottledWatersPerDay: 2,
  sodasMocktailsPerDay: 1,
  alcoholicDrinkPrice: 14,
  specialtyCoffeePrice: 5,
  bottledWaterPrice: 3.5,
  sodaMocktailPrice: 3.5,
}

const snapshotWifiInputs = {
  cruiseNights: cruiseCostInitialState.cruiseNights,
  wifiPricePerDevicePerDay: 20,
  peopleCount: cruiseCostInitialState.travelerCount,
  deviceCount: 2,
  usageType: 'moderate',
  willingToShare: true,
}

const snapshotKeyInputs = {
  cruiseNights: cruiseCostInitialState.cruiseNights,
  theKeyPricePerDay: 38,
  wifiNeeded: true,
  numberOfDevices: '1',
  embarkationLunch: true,
  priorityBoardingImportance: 'medium',
  reservedSeatingImportance: 'medium',
  skipLineImportance: 'low',
}

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

function SnapshotList({ items }) {
  return (
    <div className="explanation-list">
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className="explanation-item">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  )
}

function buildDealFormFromCost(costForm) {
  return {
    cruiseNights: costForm.cruiseNights,
    baseFare: costForm.cruiseFare,
    taxesAndFees: costForm.taxesAndFees,
    drinkPackage: costForm.drinkPackage,
    wifi: costForm.wifi,
    excursions: costForm.excursions,
    specialtyDining: costForm.dining,
    theKey: costForm.theKey,
    flights: costForm.flights,
    hotel: costForm.hotel,
    parkingTransport: costForm.parking,
  }
}

function findRecentTrip(recentTrips, tool) {
  return recentTrips.find((trip) => trip.tool === tool) ?? null
}

export default function TripSnapshotPage() {
  const [recentTrips, setRecentTrips] = useState([])
  const [plannerState, setPlannerState] = useState(snapshotPlannerDefaults)

  useEffect(() => {
    setRecentTrips(loadRecentTrips())
    setPlannerState(loadPlannerState(snapshotPlannerDefaults))
  }, [])

  const latestCostTrip = findRecentTrip(recentTrips, 'cruise-cost')
  const latestDealTrip = findRecentTrip(recentTrips, 'deal-evaluator')
  const latestCompareTrip = findRecentTrip(recentTrips, 'compare')

  const costForm = useMemo(
    () => ({
      ...cruiseCostInitialState,
      ...(latestCostTrip?.data?.form ?? {}),
    }),
    [latestCostTrip],
  )

  const dealForm = useMemo(
    () => ({
      ...buildDealFormFromCost(costForm),
      ...(latestDealTrip?.data?.form ?? {}),
    }),
    [costForm, latestDealTrip],
  )

  const compareSnapshot = useMemo(() => {
    if (!latestCompareTrip?.data?.scenarioA || !latestCompareTrip?.data?.scenarioB) {
      return null
    }

    const scenarioA = {
      ...cruiseCostInitialState,
      ...latestCompareTrip.data.scenarioA,
    }
    const scenarioB = {
      ...cruiseCostInitialState,
      ...latestCompareTrip.data.scenarioB,
    }
    const resultsA = calculateCruiseCost(scenarioA)
    const resultsB = calculateCruiseCost(scenarioB)
    const comparison = compareCruiseCostScenarios(resultsA, resultsB)
    const scenarioALabel = latestCompareTrip.data.scenarioALabel || 'Scenario A'
    const scenarioBLabel = latestCompareTrip.data.scenarioBLabel || 'Scenario B'

    return {
      comparison,
      scenarioALabel,
      scenarioBLabel,
      pricierLabel:
        comparison.totalDifference === 0
          ? 'Neither scenario'
          : comparison.totalDifference > 0
            ? scenarioBLabel
            : scenarioALabel,
    }
  }, [latestCompareTrip])

  const costResults = useMemo(() => calculateCruiseCost(costForm), [costForm])
  const dealResults = useMemo(() => calculateDealEvaluator(dealForm), [dealForm])
  const drinkResults = useMemo(() => calculateDrinkPackage({
    ...snapshotDrinkInputs,
    cruiseNights: costForm.cruiseNights,
  }), [costForm.cruiseNights])
  const wifiResults = useMemo(() => calculateWifiRecommendation({
    ...snapshotWifiInputs,
    cruiseNights: costForm.cruiseNights,
    peopleCount: costForm.travelerCount,
  }), [costForm.cruiseNights, costForm.travelerCount])
  const keyResults = useMemo(() => calculateTheKey({
    ...snapshotKeyInputs,
    cruiseNights: costForm.cruiseNights,
  }), [costForm.cruiseNights])
  const plannedShipName = plannerState.shipName.trim().toLowerCase()
  const plannerShipMatch = plannedShipName
    ? Object.values(royalShipsBySlug).find((ship) => ship.shipName.toLowerCase() === plannedShipName)
    : null
  const snapshotShip = plannerShipMatch ?? royalShipsBySlug['wonder-of-the-seas'] ?? activeRoyalShips[0]
  const diningStrategy = buildDiningStrategy(snapshotShip)
  const isUsingRecentData = Boolean(latestCostTrip || latestDealTrip || latestCompareTrip)

  const upgradeVerdicts = [
    { label: 'Drink package', value: drinkResults.recommendation },
    { label: 'WiFi', value: wifiResults.recommendation },
    { label: 'The Key', value: keyResults.recommendation },
  ]

  const quickWins = [
    ...costResults.quickWins.map((win) => `${win.title}. ${win.detail}`),
    drinkResults.recommendation === 'Skip it'
      ? `Skip the drink package and avoid about ${formatCurrency(drinkResults.packageTotal)}.`
      : null,
    wifiResults.recommendedPlan === 'one-device'
      ? `Use one WiFi device instead of two and save about ${formatCurrency(wifiResults.twoDeviceCost - wifiResults.oneDeviceCost)}.`
      : null,
    keyResults.recommendation === 'Skip it'
      ? `Skip The Key and avoid about ${formatCurrency(keyResults.keyTotal)}.`
      : null,
  ].filter(Boolean).slice(0, 4)

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Snapshot"
        title="Your trip decision, without the fog machine"
        description="A consolidated view of the major planning outputs: cost, verdicts, drivers, dining strategy, and the cuts that actually matter."
      />

      <section className="card snapshot-hero-card">
        <div>
          <span className="verdict-kicker">Final answer</span>
          <h2>{dealResults.verdict}</h2>
          <p>{dealResults.verdictLines[0]}</p>
          <p className="snapshot-source-note">
            {isUsingRecentData
              ? 'Using your latest saved calculator sessions from this browser.'
              : 'Using sample trip defaults until you run a calculator session.'}
          </p>
        </div>
        <div className="stats-grid snapshot-top-stats">
          <SnapshotMetric
            label="Total trip cost"
            value={formatCurrency(costResults.grandTotal)}
            helper={latestCostTrip ? 'Latest local cost session' : 'Sample cost defaults'}
          />
          <SnapshotMetric label="Cost per night" value={formatCurrency(costResults.costPerNight)} helper="Real total spread across the sailing" />
        </div>
      </section>

      <section className="card">
        <SectionHeader
          title="Upgrade verdicts"
          description="The add-ons get a vote, but not a blank check."
        />
        <SnapshotList items={upgradeVerdicts} />
      </section>

      {compareSnapshot ? (
        <section className="card">
          <SectionHeader
            title="Latest scenario comparison"
            description="The most recent Compare result saved in this browser."
          />
          <div className="verdict-highlight">
            <span>Main takeaway</span>
            <strong>
              {compareSnapshot.comparison.totalDifference === 0
                ? `${compareSnapshot.scenarioALabel} and ${compareSnapshot.scenarioBLabel} are basically tied.`
                : `${compareSnapshot.pricierLabel} costs about ${formatCurrency(compareSnapshot.comparison.absoluteTotalDifference)} more.`}
            </strong>
          </div>
          <div className="stats-grid">
            <SnapshotMetric label="Total gap" value={formatCurrency(compareSnapshot.comparison.absoluteTotalDifference)} />
            <SnapshotMetric label="Nightly gap" value={formatCurrency(compareSnapshot.comparison.absoluteCostPerNightDifference)} />
            <SnapshotMetric label="Add-ons gap" value={formatCurrency(compareSnapshot.comparison.absoluteAddOnsDifference)} />
          </div>
        </section>
      ) : null}

      <section className="card dining-strategy-card">
        <SectionHeader
          title="Dining strategy"
          description={
            plannerShipMatch
              ? `Using ${snapshotShip.shipName} from your Planner as the dining profile.`
              : `Using ${snapshotShip.shipName} as a sample dining profile. Add an exact ship name in Planner for a tighter snapshot.`
          }
        />
        <div className="verdict-highlight dining-strategy-highlight">
          <span>Strategy</span>
          <strong>{diningStrategy.headline}</strong>
        </div>
        <div className="explanation-list">
          <div className="explanation-item">
            <span>Dining package call</span>
            <strong>{diningStrategy.packageVerdict}</strong>
          </div>
          {diningStrategy.strategyLines.map((line) => (
            <div key={line} className="explanation-item">
              <span>{line}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <SectionHeader
          title="Biggest cost drivers"
          description="The biggest add-ons doing the most damage."
        />
        <div className="driver-list">
          {costResults.biggestAddOnDrivers.map((driver, index) => (
            <article key={driver.key} className="driver-item">
              <span className="driver-rank">{index + 1}</span>
              <div className="driver-copy">
                <strong>{driver.label}</strong>
                <span>{costResults.grandTotal ? `${((driver.value / costResults.grandTotal) * 100).toFixed(0)}% of the total` : 'Included in the total'}</span>
              </div>
              <strong className="driver-value">{formatCurrency(driver.value)}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="card callout-card">
        <SectionHeader
          title="Quick wins"
          description="Start here if the total needs to stop being ridiculous."
        />
        <div className="explanation-list">
          {quickWins.map((win) => (
            <div key={win} className="explanation-item">
              <span>{win}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
