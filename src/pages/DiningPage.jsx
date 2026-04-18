import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
  const includedLead = complimentaryCount - specialtyCount

  if (specialtyCount >= complimentaryCount + 2) {
    return {
      verdict: 'This ship leans more on paid dining options',
      reality: [
        'You can still eat well without paying extra, but the premium venues do more of the heavy lifting here.',
        'If specialty dining matters to you, this ship makes that decision more relevant.',
      ],
      lines: [
        'There are more paid dining draws here than on the ships with the strongest included lineup.',
        'Look closely at the specialty list before pretending you will be satisfied with the base plan alone.',
      ],
    }
  }

  if (hybridCount >= 5 && specialtyCount >= complimentaryCount) {
    return {
      verdict: 'Specialty dining is optional, but the fine print matters',
      reality: [
        'Most meals can still come from included venues, but several dining rules need a quick reality check.',
        'This is the kind of ship where people get tripped up by caveats, not by a lack of food.',
      ],
      lines: [
        'The venue mix is solid, but inclusion is not always as clean as people assume.',
        'Check the fine print before treating every borderline venue like it is fully covered.',
      ],
    }
  }

  if (includedLead >= 3) {
    return {
      verdict: 'You do not need a dining package here',
      reality: [
        'Most of your meals can come from included venues without feeling stuck with scraps.',
        'Specialty dining is a nice extra here, not a requirement to eat well.',
      ],
      lines: [
        'This ship gives you enough included variety that a dining package should be a want, not a reflex purchase.',
        'If you buy specialty meals here, it should be because you want the experience, not because the included lineup is weak.',
      ],
    }
  }

  return {
    verdict: 'Specialty dining is optional, not essential',
    reality: [
      'Most travelers can lean on complimentary dining for the bulk of the trip.',
      'Paid venues are there for variety, not because the included options are falling apart.',
    ],
    lines: [
      'This ship lands in the middle with a respectable included base and enough paid options to tempt people.',
      'You do not need a dining package by default, but you should still read the fine print section.',
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
              <small>Future ship dining data can change before launch.</small>
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
                  <p>{insight.verdict}</p>
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
              title="Included vs paid reality"
              description="The fast answer before you start reading every venue like it is a legal document."
            />
            <div className="reality-copy dining-reality-copy">
              {insight.reality.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>

          <section className="card">
            <SectionHeader
              title="Next step"
              description="Use the ship view here, then move to the money decision that matters next."
            />
            <div className="card-grid dining-next-step-grid">
              <article className="card info-card muted-card dining-next-step-card">
                <div className="card-topline">
                  <h3>Dining Package Calculator</h3>
                  <span className="status-pill status-muted">Soon</span>
                </div>
                <p>Not live yet. This ship data is already set up to support it when we build the real package math.</p>
              </article>
              <Link className="card info-card dining-next-step-card" to="/compare">
                <div className="card-topline">
                  <h3>Compare trip versions</h3>
                  <span className="status-pill">Live</span>
                </div>
                <p>Compare one trip with more paid add-ons against a leaner version before the budget gets stupid.</p>
                <span className="card-link">Compare scenarios</span>
              </Link>
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
              title="Dining fine print that matters"
              description="This is where people get surprised, over-assume, and then argue with the bill later."
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
