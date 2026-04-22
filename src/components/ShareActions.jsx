import { useEffect, useState } from 'react'
import { copyText, getCurrentShareUrl } from '../utils/share'

export default function ShareActions({
  summary,
  shortSummary,
  getLink = getCurrentShareUrl,
  summaryLabel = 'Copy summary',
  shortSummaryLabel = 'Copy share text',
  linkLabel = 'Copy link',
  compact = false,
}) {
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (!feedback) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setFeedback(''), 2200)
    return () => window.clearTimeout(timeoutId)
  }, [feedback])

  async function handleCopySummary() {
    try {
      const text = typeof summary === 'function' ? summary() : summary
      await copyText(text)
      setFeedback('Summary copied')
    } catch {
      setFeedback('Could not copy summary')
    }
  }

  async function handleCopyShortSummary() {
    try {
      const text = typeof shortSummary === 'function' ? shortSummary() : shortSummary
      await copyText(text)
      setFeedback('Share text copied')
    } catch {
      setFeedback('Could not copy share text')
    }
  }

  async function handleCopyLink() {
    try {
      await copyText(getLink())
      setFeedback('Link copied')
    } catch {
      setFeedback('Could not copy link')
    }
  }

  return (
    <div className={`${compact ? '' : 'card '}share-actions`}>
      <div className="share-button-row">
        <button type="button" className="button button-ghost" onClick={handleCopySummary}>
          {summaryLabel}
        </button>
        {shortSummary ? (
          <button type="button" className="button button-ghost" onClick={handleCopyShortSummary}>
            {shortSummaryLabel}
          </button>
        ) : null}
        <button type="button" className="button button-ghost" onClick={handleCopyLink}>
          {linkLabel}
        </button>
      </div>
      {feedback ? <p className="share-feedback">{feedback}</p> : null}
    </div>
  )
}
