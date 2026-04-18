import { useMemo, useState } from 'react'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import { activeRoyalShips, futureRoyalShips, royalShipsBySlug } from '../data/royalShips'

const sortedActiveShips = [...activeRoyalShips].sort((left, right) =>
  left.shipName.localeCompare(right.shipName),
)
const sortedFutureShips = [...futureRoyalShips].sort((left, right) =>
  left.shipName.localeCompare(right.shipName),
)

const defaultShipSlug = sortedActiveShips[0]?.shipSlug ?? sortedFutureShips[0]?.shipSlug ?? ''

function buildShipInsight(ship) {
  const complimentaryCount = ship.complimentaryDining.length
  const specialtyCount = ship.specialtyDining.length
  const hybridCount = ship.hybridDining.length

  if (hybridCount >= 5 && specialtyCount >= complimentaryCount) {
    return {
      label: 'Several important caveats',
      lines: [
        'This ship has a strong venue mix, but the fine print matters more than usual.',
        'Check the hybrid notes before assuming a venue is fully included or package-friendly.',
      ],
    }
  }

  if (specialtyCount > complimentaryCount) {
    return {
      label: 'Specialty-heavy lineup',
      lines: [
        'There is a lot to eat here, but more of the headline venues land in the extra-cost bucket.',
        'This is not the ship to pick if you want the broadest included dining with the fewest catches.',
      ],
    }
  }

  if (complimentaryCount >= specialtyCount + 3) {
    return {
      label: 'Strong included dining',
      lines: [
        'You have a healthy included lineup before paying for specialty restaurants.',
        'That makes this ship easier to enjoy without turning every dinner into an upcharge decision.',
      ],
    }
  }

  return {
    label: 'Balanced dining mix',
    lines: [
      'This ship sits in the middle. You get a solid included base, plus enough specialty spots to tempt you.',
      'Read the hybrid rules so you know where the pricing gets slippery.',
    ],
  }
}

function VenueList({ venues, hybrid = false }) {
  if (!venues.length) {
    return (
      <div className="venue-item-card">
        <strong>No entries listed</strong>
        <span>Nothing to show here for this ship right now.</span>
      </div>
    )
  }

  return (
    <div className="venue-grid">
      {venues.map((item) => (
        <article
          key={item.venue}
          className={hybrid ? 'venue-item-card venue-item-hybrid' : 'venue-item-card'}
        >
          <strong>{item.venue}</strong>
          {item.rule ? <span>{item.rule}</span> : null}
        </article>
      ))}
    </div>
  )
}

export default function DiningPage() {
  const [includeFutureShips, setIncludeFutureShips] = useState(false)
  const [selectedShipSlug, setSelectedShipSlug] = useState(defaultShipSlug)

  const shipOptions = useMemo(() => {
    const options = [
      {
        label: 'Active ships',
        ships: sortedActiveShips,
      },
    ]

    if (includeFutureShips && sortedFutureShips.length) {
      options.push({
        label: 'Future ships',
        ships: sortedFutureShips,
      })
    }

    return options
  }, [includeFutureShips])

  const selectedShip =
    royalShipsBySlug[selectedShipSlug] ??
    shipOptions[0]?.ships[0] ??
    sortedFutureShips[0] ??
    null

  const insight = selectedShip ? buildShipInsight(selectedShip) : null

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Dining"
        title="See what dining is actually included on your ship"
        description="Pick a ship and get the clean version: what is included, what costs extra, and where Royal's dining fine print gets annoying."
      />

      <section className="card">
        <SectionHeader
          title="Choose your ship"
          description="Start with active ships by default. Turn on future ships if you are planning ahead instead of just daydreaming aggressively."
        />
        <div className="dining-selector-row">
          <label className="field dining-selector-field">
            <span className="field-label">Ship</span>
            <select
              className="field-input"
              value={selectedShipSlug}
              onChange={(event) => setSelectedShipSlug(event.target.value)}
            >
              {shipOptions.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.ships.map((ship) => (
                    <option key={ship.shipSlug} value={ship.shipSlug}>
                      {ship.shipName}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="toggle-field dining-selector-toggle">
            <input
              type="checkbox"
              checked={includeFutureShips}
              onChange={(event) => {
                const nextValue = event.target.checked
                setIncludeFutureShips(nextValue)

                if (!nextValue && selectedShip && selectedShip.status !== 'active') {
                  setSelectedShipSlug(defaultShipSlug)
                }
              }}
            />
            <span className="toggle-copy">
              <strong>Include future ships</strong>
              <small>Shows ships like Legend and Hero, clearly marked as future.</small>
            </span>
          </label>
        </div>
      </section>

      {selectedShip ? (
        <>
          <section className="card verdict-card">
            <div className="verdict-kicker">Dining summary</div>
            <div className="verdict-headline-row">
              <div>
                <h2 className="verdict-headline dining-page-headline">{selectedShip.shipName}</h2>
                <div className="verdict-copy">
                  <p>{insight.label}</p>
                  {insight.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <span
                className={`status-pill verdict-pill ${selectedShip.status === 'active' ? '' : 'status-muted'}`}
              >
                {selectedShip.status}
              </span>
            </div>
          </section>

          <section className="card">
            <SectionHeader
              title="Ship basics"
              description="The basics you actually care about before getting lost in venue names."
            />
            <div className="stats-grid">
              <article className="stat-card">
                <span className="stat-label">Class</span>
                <strong className="stat-value">{selectedShip.className}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-label">Launch year</span>
                <strong className="stat-value">{selectedShip.launchYear}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-label">Status</span>
                <strong className="stat-value">{selectedShip.status}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-label">Amplified</span>
                <strong className="stat-value">{selectedShip.amplified ? 'Yes' : 'No'}</strong>
                {selectedShip.amplifiedNotes ? (
                  <span className="stat-helper">{selectedShip.amplifiedNotes}</span>
                ) : null}
              </article>
            </div>
          </section>

          <div className="two-column-layout dining-layout">
            <section className="card">
              <SectionHeader
                title="Complimentary Dining"
                description="Included spots first, because that is usually the part people want the truth about."
              />
              <VenueList venues={selectedShip.complimentaryDining} />
            </section>

            <section className="card">
              <SectionHeader
                title="Specialty Dining"
                description="These are the venues more likely to hit your onboard bill."
              />
              <VenueList venues={selectedShip.specialtyDining} />
            </section>
          </div>

          <section className="card callout-card">
            <SectionHeader
              title="Important Notes / Hybrid Rules"
              description="This is the part Royal makes fuzzier than it needs to be."
            />
            <VenueList venues={selectedShip.hybridDining} hybrid />
            {selectedShip.notes.length ? (
              <div className="dining-ship-notes">
                {selectedShip.notes.map((note) => (
                  <div key={note} className="explanation-item">
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </>
      ) : null}
    </div>
  )
}
