import { formatCurrency } from './formatters'

const COMPARE_SHARE_PARAM = 'cmp'

function sanitizeScenario(scenario, template) {
  return Object.fromEntries(
    Object.keys(template).map((key) => [key, scenario?.[key] ?? template[key]]),
  )
}

export function buildCompareSummary(comparison, labels = { scenarioA: 'Scenario A', scenarioB: 'Scenario B' }) {
  const scenarioAName = labels.scenarioA || 'Scenario A'
  const scenarioBName = labels.scenarioB || 'Scenario B'
  const totalLine =
    comparison.totalDifference === 0
      ? `${scenarioAName} and ${scenarioBName} land at about the same total`
      : `${comparison.totalDifference > 0 ? scenarioBName : scenarioAName} costs about ${formatCurrency(comparison.absoluteTotalDifference)} more overall`
  const driver = comparison.topDifferenceLines[0]
  const driverLine = driver
    ? `Main driver: ${driver.label} (+${formatCurrency(driver.amount)} in ${driver.higherIn.replace('Scenario A', scenarioAName).replace('Scenario B', scenarioBName)})`
    : 'Main driver: no single line item is creating a major gap'

  return [
    totalLine,
    driverLine,
    `Nightly difference: about ${formatCurrency(comparison.absoluteCostPerNightDifference)}`,
    `Add-ons gap: about ${formatCurrency(comparison.absoluteAddOnsDifference)}`,
  ].join('\n')
}

export function encodeCompareState({ scenarioA, scenarioB, scenarioALabel, scenarioBLabel }, template) {
  const payload = {
    a: sanitizeScenario(scenarioA, template),
    b: sanitizeScenario(scenarioB, template),
    al: scenarioALabel || 'Scenario A',
    bl: scenarioBLabel || 'Scenario B',
  }

  const json = JSON.stringify(payload)
  return btoa(unescape(encodeURIComponent(json)))
}

export function decodeCompareState(encoded, template) {
  try {
    const json = decodeURIComponent(escape(atob(encoded)))
    const parsed = JSON.parse(json)

    if (!parsed || typeof parsed !== 'object' || !parsed.a || !parsed.b) {
      return null
    }

    return {
      scenarioA: sanitizeScenario(parsed.a, template),
      scenarioB: sanitizeScenario(parsed.b, template),
      scenarioALabel: parsed.al || 'Scenario A',
      scenarioBLabel: parsed.bl || 'Scenario B',
    }
  } catch {
    return null
  }
}

export function getCompareShareState(search, template) {
  const params = new URLSearchParams(search)
  const encoded = params.get(COMPARE_SHARE_PARAM)

  if (!encoded) {
    return null
  }

  return decodeCompareState(encoded, template)
}

export function buildCompareShareUrl(encodedState) {
  return `${window.location.origin}${window.location.pathname}#/compare?${COMPARE_SHARE_PARAM}=${encodeURIComponent(encodedState)}`
}
