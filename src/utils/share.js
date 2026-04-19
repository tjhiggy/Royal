export const SITE_URL = 'https://tjhiggy.github.io/Royal/'

export function getCurrentShareUrl() {
  if (typeof window === 'undefined') {
    return SITE_URL
  }

  return window.location.href || SITE_URL
}

export async function copyText(text) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    throw new Error('Clipboard is not available')
  }

  await navigator.clipboard.writeText(text)
}

export function appendShareUrl(lines, url = getCurrentShareUrl()) {
  return [...lines, '', `Check your trip here: ${url}`].join('\n')
}
