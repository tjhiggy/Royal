import { formatCurrency } from './formatters'
import { getCurrentShareUrl } from './share'

function cleanLines(lines) {
  return lines.filter((line) => typeof line === 'string' && line.trim().length > 0)
}

export function money(value) {
  return formatCurrency(Number(value) || 0)
}

export function buildToolShareSummary({
  title,
  verdict,
  keyFigure,
  mainDriver,
  nextAction,
  url = getCurrentShareUrl(),
}) {
  return cleanLines([
    `Cruise Decision Engine: ${title}`,
    `Verdict: ${verdict}`,
    `Key number: ${keyFigure}`,
    `Main driver: ${mainDriver}`,
    `Next move: ${nextAction}`,
    url,
  ]).join('\n')
}

export function buildToolShortShare({
  title,
  verdict,
  keyFigure,
  nextAction,
  url = getCurrentShareUrl(),
}) {
  return cleanLines([
    `${title}: ${verdict}. ${keyFigure}.`,
    `Next: ${nextAction}`,
    url,
  ]).join('\n')
}

export function buildSavingsLine({ positiveLabel = 'Saves', negativeLabel = 'Overpays', amount }) {
  const numericAmount = Number(amount) || 0
  return numericAmount >= 0
    ? `${positiveLabel} about ${money(numericAmount)}`
    : `${negativeLabel} by about ${money(Math.abs(numericAmount))}`
}
