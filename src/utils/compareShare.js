import { formatCurrency } from './formatters'

const COMPARE_SHARE_PARAM = 'cmp'

function sanitizeScenario(scenario, template) {
  return Object.fromEntries(
    Object.keys(template).map((key) => [key, scenario?.[key] ?? template[key]]),
  )
}

export function buildCompareSummary(comparison) {
  const totalLine =
    comparison.totalDifference === 0
      ? 'Both scenarios land at about the same total'
      : `${comparison.moreExpensiveScenario} costs about ${formatCurrency(Math.abs(comparison.totalDifference))} more overall`
  const driver = comparison.topDifferenceLines[0]
  const driverLine = driver
    ? `Main driver: ${driver.label} (${driver.value >= 0 ? '+' : '-'}${formatCurrency(Math.abs(driver.value))})`
    : 'Main driver: no single line item is creating a major gap'

  return [
    totalLine,
    driverLine,
    `Nightly difference: about ${formatCurrency(Math.abs(comparison.costPerNightDifference))}`,
    `Add-ons gap: about ${formatCurrency(Math.abs(comparison.addOnsDifference))}`,
  ].join('\n')
}

export function encodeCompareState({ scenarioA, scenarioB }, template) {
  const payload = {
    a: sanitizeScenario(scenarioA, template),
    b: sanitizeScenario(scenarioB, template),
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
