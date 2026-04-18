export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0)
}
