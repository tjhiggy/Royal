import { cruiseCostInitialState } from '../data/cruiseCostConfig'
import { activeRoyalShips, royalShipsBySlug } from '../data/royalShips'
import {
  calculateCruiseCost,
  calculateDealEvaluator,
  calculateDiningPackage,
  calculateDrinkPackage,
  calculateTheKey,
  calculateWifiRecommendation,
  compareCruiseCostScenarios,
} from './calculators'
import { buildDiningStrategy } from './diningStrategy'
import { formatCurrency } from './formatters'
import { getCurrentShareUrl } from './share'

function latestRecentTrip(recentTrips, tool) {
  return recentTrips.find((trip) => trip.tool === tool) ?? null
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

function buildCostFormFromDeal(dealForm) {
  return {
    ...cruiseCostInitialState,
    cruiseNights: dealForm.cruiseNights,
    cruiseFare: dealForm.baseFare,
    taxesAndFees: dealForm.taxesAndFees,
    drinkPackage: dealForm.drinkPackage,
    wifi: dealForm.wifi,
    excursions: dealForm.excursions,
    dining: dealForm.specialtyDining,
    theKey: dealForm.theKey,
    flights: dealForm.flights,
    hotel: dealForm.hotel,
    parking: dealForm.parkingTransport,
  }
}

function findShipFromPlanner(plannerState) {
  const plannedShipName = plannerState?.shipName?.trim().toLowerCase()

  if (!plannedShipName) {
    return null
  }

  return Object.values(royalShipsBySlug).find((ship) => ship.shipName.toLowerCase() === plannedShipName) ?? null
}

function uniqueLines(lines) {
  return Array.from(new Set(lines.filter(Boolean)))
}

export function buildTripSnapshot({ snapshotState = {}, recentTrips = [], plannerState = {} }) {
  const recentCostTrip = latestRecentTrip(recentTrips, 'cruise-cost')
  const recentDealTrip = latestRecentTrip(recentTrips, 'deal-evaluator')
  const recentCompareTrip = latestRecentTrip(recentTrips, 'compare')

  const savedCostForm = snapshotState.cost?.form ?? recentCostTrip?.data?.form ?? null
  const savedDealForm = snapshotState.deal?.form ?? recentDealTrip?.data?.form ?? null
  const costForm = savedCostForm
    ? { ...cruiseCostInitialState, ...savedCostForm }
    : savedDealForm
      ? buildCostFormFromDeal(savedDealForm)
      : null
  const dealForm = savedDealForm
    ? savedDealForm
    : costForm
      ? buildDealFormFromCost(costForm)
      : null

  const costResults = costForm ? calculateCruiseCost(costForm) : null
  const dealResults = dealForm ? calculateDealEvaluator(dealForm) : null

  const drinkResults = snapshotState.drink?.form
    ? calculateDrinkPackage(snapshotState.drink.form)
    : null
  const wifiResults = snapshotState.wifi?.form
    ? calculateWifiRecommendation(snapshotState.wifi.form)
    : null
  const keyResults = snapshotState.key?.form
    ? calculateTheKey(snapshotState.key.form)
    : null
  const diningPackageResults = snapshotState.diningPackage?.form
    ? calculateDiningPackage(snapshotState.diningPackage.form)
    : null

  const selectedShip =
    (snapshotState.dining?.shipSlug ? royalShipsBySlug[snapshotState.dining.shipSlug] : null) ??
    findShipFromPlanner(plannerState)
  const fallbackShip = royalShipsBySlug['wonder-of-the-seas'] ?? activeRoyalShips[0] ?? null
  const diningShip = selectedShip ?? fallbackShip
  const diningStrategy = diningShip ? buildDiningStrategy(diningShip) : null

  const compareSource = snapshotState.compare ?? recentCompareTrip?.data ?? null
  const compareSnapshot = compareSource?.scenarioA && compareSource?.scenarioB
    ? buildCompareSnapshot(compareSource)
    : null

  const upgradeVerdicts = buildUpgradeVerdicts({
    costForm,
    drinkResults,
    wifiResults,
    keyResults,
    diningPackageResults,
    diningStrategy,
    hasUserShip: Boolean(selectedShip),
  })

  const quickWins = buildQuickWins({
    costResults,
    drinkResults,
    wifiResults,
    keyResults,
    diningPackageResults,
    diningStrategy,
    hasUserShip: Boolean(selectedShip),
  })

  const mainWarning =
    drinkResults?.recommendation === 'Skip it'
      ? 'Biggest waste risk: drink package'
      : costResults?.biggestAddOnDrivers?.[0]
        ? `Biggest cost driver: ${costResults.biggestAddOnDrivers[0].label}`
        : compareSnapshot
          ? `${compareSnapshot.pricierLabel} is the pricier scenario`
          : 'Finish a cost tool to expose the biggest warning.'

  const keyMetrics = costResults && dealResults
    ? [
        { label: 'Base fare', value: formatCurrency(dealResults.baseFare ?? costResults.fare), helper: 'The number that usually looks harmless' },
        { label: 'Real trip cost', value: formatCurrency(costResults.grandTotal), helper: 'Fare plus the stuff that actually hits the budget' },
        { label: 'Cost per night', value: formatCurrency(costResults.costPerNight), helper: 'The cleanest way to judge the full trip' },
        { label: 'Add-ons share', value: `${costResults.extrasShare.toFixed(0)}%`, helper: 'Everything besides base fare' },
        { label: 'Travel share', value: `${costResults.travelShare.toFixed(0)}%`, helper: 'Flights, hotel, parking, and getting there' },
      ]
    : []

  const nextSteps = [
    !dealResults ? { to: '/tools/deal-evaluator', title: 'Complete Deal Evaluator', copy: 'Start here if you have not tested whether the fare is actually good.' } : null,
    !costResults ? { to: '/tools/cruise-cost', title: 'Check real trip cost', copy: 'Snapshot needs the full cost before it can be brutally useful.' } : null,
    !drinkResults ? { to: '/tools/drink-package', title: 'Check drink package', copy: 'Run the package math before it becomes a very expensive hunch.' } : null,
    !wifiResults ? { to: '/tools/wifi', title: 'Check WiFi', copy: 'See whether one device is enough before buying extra internet.' } : null,
    !keyResults ? { to: '/tools/the-key', title: 'Check The Key', copy: 'Test whether the perks are usable value or just a shiny label.' } : null,
    !selectedShip ? { to: '/dining', title: 'Pick your ship dining profile', copy: 'Dining strategy gets sharper once Snapshot knows the ship.' } : null,
    !compareSnapshot ? { to: '/compare', title: 'Compare two scenarios', copy: 'Use this when the decision is between two versions of the trip.' } : null,
  ].filter(Boolean).slice(0, 4)

  return {
    hasCostData: Boolean(costResults),
    hasDealData: Boolean(dealResults),
    hasUserShip: Boolean(selectedShip),
    costForm,
    dealForm,
    costResults,
    dealResults,
    drinkResults,
    wifiResults,
    keyResults,
    diningPackageResults,
    diningShip,
    diningStrategy,
    compareSnapshot,
    mainVerdict: dealResults?.verdict ?? 'Snapshot needs trip data',
    mainWarning,
    mainLine: dealResults?.verdictLines?.[0] ?? 'Run the Deal Evaluator or Cruise Cost Calculator so this page can stop guessing.',
    sourceLine: costResults
      ? 'Using the latest local calculator data saved in this browser.'
      : 'No full trip cost saved yet. The good news: this is fixable, not mysterious.',
    keyMetrics,
    upgradeVerdicts,
    costDrivers: costResults?.biggestAddOnDrivers?.slice(0, 4) ?? [],
    quickWins,
    nextSteps,
  }
}

function buildCompareSnapshot(compareSource) {
  const scenarioA = {
    ...cruiseCostInitialState,
    ...compareSource.scenarioA,
  }
  const scenarioB = {
    ...cruiseCostInitialState,
    ...compareSource.scenarioB,
  }
  const resultsA = calculateCruiseCost(scenarioA)
  const resultsB = calculateCruiseCost(scenarioB)
  const comparison = compareCruiseCostScenarios(resultsA, resultsB)
  const scenarioALabel = compareSource.scenarioALabel || 'Scenario A'
  const scenarioBLabel = compareSource.scenarioBLabel || 'Scenario B'

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
}

function buildUpgradeVerdicts({
  costForm,
  drinkResults,
  wifiResults,
  keyResults,
  diningPackageResults,
  diningStrategy,
  hasUserShip,
}) {
  return [
    drinkResults
      ? {
          label: 'Drink package',
          value: drinkResults.recommendation,
          detail: drinkResults.netSavings >= 0
            ? `Save about ${formatCurrency(drinkResults.netSavings)}.`
            : `Overpay by about ${formatCurrency(Math.abs(drinkResults.netSavings))}.`,
        }
      : {
          label: 'Drink package',
          value: costForm?.drinkPackage ? 'Needs check' : 'Not in current plan',
          detail: costForm?.drinkPackage ? 'A drink cost is in the trip total, but the package math has not been run.' : 'No drink package cost is currently in the trip total.',
        },
    wifiResults
      ? {
          label: 'WiFi',
          value: wifiResults.recommendation,
          detail: wifiResults.wastedSpendMessage,
        }
      : {
          label: 'WiFi',
          value: costForm?.wifi ? 'Needs check' : 'Not in current plan',
          detail: costForm?.wifi ? 'WiFi cost is included, but device needs have not been tested.' : 'No WiFi cost is currently in the trip total.',
        },
    keyResults
      ? {
          label: 'The Key',
          value: keyResults.recommendation,
          detail: keyResults.netValue >= 0
            ? `Value beats cost by ${formatCurrency(keyResults.netValue)}.`
            : `Overpay by about ${formatCurrency(Math.abs(keyResults.netValue))}.`,
        }
      : {
          label: 'The Key',
          value: costForm?.theKey ? 'Needs check' : 'Not in current plan',
          detail: costForm?.theKey ? 'The Key cost is included, but the perk value has not been tested.' : 'No Key cost is currently in the trip total.',
        },
    diningPackageResults
      ? {
          label: 'Dining package',
          value: diningPackageResults.recommendation,
          detail: diningPackageResults.netSavings >= 0
            ? `Save about ${formatCurrency(diningPackageResults.netSavings)}.`
            : `Overpay by about ${formatCurrency(Math.abs(diningPackageResults.netSavings))}.`,
        }
      : {
          label: 'Dining',
          value: hasUserShip ? diningStrategy?.packageVerdict ?? 'Ship profile ready' : 'Choose ship',
          detail: hasUserShip
            ? diningStrategy?.headline ?? 'Dining strategy is available for this ship.'
            : 'Pick a ship in Dining Explorer or Planner for a real dining strategy.',
        },
  ]
}

function buildQuickWins({ costResults, drinkResults, wifiResults, keyResults, diningPackageResults, diningStrategy, hasUserShip }) {
  return uniqueLines([
    ...(costResults?.quickWins ?? []).map((win) => `${win.title}. ${win.detail}`),
    drinkResults?.recommendation === 'Skip it'
      ? `Skip the drink package -> avoid about ${formatCurrency(drinkResults.packageTotal)}.`
      : null,
    wifiResults?.recommendedPlan === 'one-device'
      ? `Use one WiFi device instead of two -> save about ${formatCurrency(wifiResults.twoDeviceCost - wifiResults.oneDeviceCost)}.`
      : null,
    wifiResults?.recommendedPlan === 'no-wifi'
      ? `Skip WiFi -> avoid about ${formatCurrency(wifiResults.oneDeviceCost)}.`
      : null,
    keyResults?.recommendation === 'Skip it'
      ? `Skip The Key -> avoid about ${formatCurrency(keyResults.keyTotal)}.`
      : null,
    diningPackageResults?.recommendation === 'Skip it'
      ? `Skip the dining package -> avoid about ${formatCurrency(diningPackageResults.packageTotal)}.`
      : null,
    hasUserShip && diningStrategy?.packageVerdict
      ? `Dining move: ${diningStrategy.packageVerdict}.`
      : null,
  ]).slice(0, 5)
}

export function buildSnapshotSummaryText(snapshot, url = getCurrentShareUrl()) {
  const lines = [
    'Cruise Decision Engine summary',
    '',
    `${snapshot.mainVerdict}.`,
    snapshot.mainLine,
  ]

  if (snapshot.costResults) {
    lines.push(
      '',
      `Base fare: ${formatCurrency(snapshot.costResults.fare)}`,
      `Real trip cost: ${formatCurrency(snapshot.costResults.grandTotal)}`,
      `Cost per night: ${formatCurrency(snapshot.costResults.costPerNight)}`,
    )
  }

  if (snapshot.costDrivers.length) {
    lines.push('', 'Biggest cost drivers:')
    snapshot.costDrivers.slice(0, 3).forEach((driver) => {
      lines.push(`- ${driver.label}: ${formatCurrency(driver.value)}`)
    })
  }

  if (snapshot.upgradeVerdicts.length) {
    lines.push('', 'Upgrade verdicts:')
    snapshot.upgradeVerdicts.forEach((item) => {
      lines.push(`- ${item.label}: ${item.value}`)
    })
  }

  if (snapshot.quickWins.length) {
    lines.push('', 'Best savings move:', snapshot.quickWins[0])
  }

  lines.push('', `Check your trip here: ${url}`)
  return lines.join('\n')
}

export function buildSnapshotShortShareText(snapshot, url = getCurrentShareUrl()) {
  const costLine = snapshot.costResults
    ? `We are not booking a ${formatCurrency(snapshot.costResults.fare)} cruise.\nWe are booking a ${formatCurrency(snapshot.costResults.grandTotal)} trip.`
    : 'We still need the real trip cost before booking.'

  return [
    costLine,
    '',
    snapshot.mainWarning,
    snapshot.quickWins[0] ? `Best move: ${snapshot.quickWins[0]}` : 'Best move: finish the cost check first.',
    '',
    url,
  ].join('\n')
}
