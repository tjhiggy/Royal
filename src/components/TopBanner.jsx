import { useEffect, useState } from 'react'

const STORAGE_KEY = 'royal-top-banner-dismissed'

export default function TopBanner() {
  const [isDismissed, setIsDismissed] = useState(true)

  useEffect(() => {
    setIsDismissed(window.localStorage.getItem(STORAGE_KEY) === 'true')
  }, [])

  function dismissBanner() {
    window.localStorage.setItem(STORAGE_KEY, 'true')
    setIsDismissed(true)
  }

  if (isDismissed) {
    return null
  }

  return (
    <div className="top-banner">
      <div className="container top-banner-inner">
        <span>Most people underestimate their cruise cost by 30–60%</span>
        <button type="button" className="top-banner-dismiss" onClick={dismissBanner} aria-label="Dismiss banner">
          Dismiss
        </button>
      </div>
    </div>
  )
}
