import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import { activeRoyalShips, futureRoyalShips, royalShipsBySlug } from '../data/royalShips'
import { buildDiningStrategy } from '../utils/diningStrategy'
import { saveSnapshotToolState } from '../utils/storage'

const sortedActiveShips = [...activeRoyalShips].sort((left, right) =>
  left.shipName.localeCompare(right.shipName),
)
const sortedFutureShips = [...futureRoyalShips].sort((left, right) =>
  left.shipName.localeCompare(right.shipName),
)

const defaultShipSlug = sortedActiveShips[0]?.shipSlug ?? sortedFutureShips[0]?.shipSlug ?? ''

function isIncludedWithCaveat(rule) {
  const normalizedRule = rule.toLowerCase()

  return (
    normalizedRule.includes('complimentary') ||
    normalizedRule.includes('included') ||
    normalizedRule.includes('suite guests') ||
    normalizedRule.includes('breakfast') ||
    normalizedRule.includes('lunch')
  )
}

function splitHybridVenues(hybridDining) {
  return hybridDining.reduce(
    (groups, venue) => {
      if (isIncludedWithCaveat(venue.rule)) {
        groups.includedWithCaveat.push(venue)
      } else {
        groups.extraOrNuance.push(venue)
      }

      return groups
    },
    {
      includedWithCaveat: [],
      extraOrNuance: [],
    },
  )
}

function buildShipInsight(ship) {
  const complimentaryCount = ship.complimentaryDining.length
  const specialtyCount = ship.specialtyDining.length
  const hybridCount = ship.hybridDining.length
  const { includedWithCaveat, extraOrNuance } = splitHybridVenues(ship.hybridDining)
  const includedLead = complimentaryCount - specialtyCount

  if (specialtyCount >= complimentaryCount + 2) {
    return {
      verdict: 'This ship makes specialty dining worth a serious look',
      reality: [
        'You can still eat without paying extra, but the stronger lineup sits on the paid side more than usual.',
        'If specialty dining matters to you, this is one of the ships where that choice deserves actual consideration.',
      ],
      lines: [
        'There are more paid dining draws here than on ships with the strongest included lineup.',
        'Do not assume the included side will feel equally strong if food variety is a big part of the trip for you.',
      ],
    }
  }

  if (extraOrNuance.length >= 4 && specialtyCount >= complimentaryCount) {
    return {
      verdict: 'You can skip the package, but read the fine print first',
      reality: [
        'Most meals can still come from the included side, but several venues come with caveats or policy weirdness.',
        'This is the kind of ship where people get tripped up by exceptions, not by a lack of food.',
      ],
      lines: [
        'The dining lineup is usable without a package, but you need to know which borderline venues are not straightforward.',
        'Read the caveat list before you assume every semi-included spot works the way you want it to.',
      ],
    }
  }

  if (includedLead >= 3 && includedWithCaveat.length <= 3) {
    return {
      verdict: 'You probably do not need a dining package here',
      reality: [
        'Most of your meals can come from included venues without feeling like you settled.',
        'Specialty dining is a bonus here, not a fix for a weak food lineup.',
      ],
      lines: [
        'This ship gives you enough included variety that a dining package should be a want, not a reflex buy.',
        'If you pay for specialty meals here, it should be because you want the experience, not because the included lineup is failing you.',
      ],
    }
  }

  return {
    verdict: 'Specialty dining is optional, not essential here',
    reality: [
      'Most travelers can lean on included dining for the bulk of the trip.',
      'Paid venues are there for variety, not because the included options collapse without them.',
    ],
    lines: [
      'This ship lands in the middle with a respectable included base and enough paid options to tempt people.',
      'You do not need a dining package by default, but you should still check the caveats before you book around one borderline venue.',
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
  const diningStrategy = selectedShip ? buildDiningStrategy(selectedShip) : null
  const hybridGroups = selectedShip
    ? splitHybridVenues(selectedShip.hybridDining)
    : { includedWithCaveat: [], extraOrNuance: [] }

  useEffect(() => {
    if (selectedShip?.shipSlug) {
      saveSnapshotToolState('dining', { shipSlug: selectedShip.shipSlug })
    }
  }, [selectedShip])

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
            <div className="verification-note">
              Venue policies can change before launch and sometimes before your sailing. Always double-check the latest ship details before you spend around one dining assumption.
            </div>
            <div className="dining-verdict-stats" aria-label="Dining mix summary">
              <span>{selectedShip.complimentaryDining.length} included venues</span>
              <span>{selectedShip.specialtyDining.length} specialty venues</span>
              <span>{hybridGroups.includedWithCaveat.length + hybridGroups.extraOrNuance.length} caveats or watchouts</span>
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

          <section className="card dining-strategy-card">
            <SectionHeader
              title="Dining Strategy"
              description="The practical move for this ship, not just a venue inventory with nicer shoes."
            />
            <div className="verdict-highlight dining-strategy-highlight">
              <span>Strategy</span>
              <strong>{diningStrategy.headline}</strong>
            </div>
            <div className="explanation-list">
              {diningStrategy.strategyLines.map((line) => (
                <div key={line} className="explanation-item">
                  <span>{line}</span>
                </div>
              ))}
              <div className="explanation-item">
                <span>Should you buy a dining package?</span>
                <strong>{diningStrategy.packageVerdict}</strong>
              </div>
            </div>
          </section>

          <section className="card">
            <SectionHeader
              title="Next step"
              description="Use the ship view here, then move to the money decision that matters next."
            />
            <div className="card-grid dining-next-step-grid">
              <Link className="card info-card dining-next-step-card" to="/tools/dining-package">
                <div className="card-topline">
                  <h3>Dining Package Calculator</h3>
                  <span className="status-pill">Live</span>
                </div>
                <p>Run the actual package math instead of guessing from menus and wishful thinking.</p>
                <span className="card-link">Check dining package</span>
              </Link>
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
              {hybridGroups.includedWithCaveat.length ? (
                <div className="dining-subsection">
                  <h3>Included with caveat</h3>
                  <p>These still matter for planning, but they are not clean no-questions-asked inclusions.</p>
                  <VenueList venues={hybridGroups.includedWithCaveat} hybrid />
                </div>
              ) : null}
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
              description="Included does not always mean simple. This is the stuff to check before buying around one venue."
            />
            {hybridGroups.includedWithCaveat.length ? (
              <div className="dining-fine-print-group">
                <h3>Included with caveat</h3>
                <VenueList venues={hybridGroups.includedWithCaveat} hybrid />
              </div>
            ) : null}
            {hybridGroups.extraOrNuance.length ? (
              <div className="dining-fine-print-group">
                <h3>Extra cost or policy nuance</h3>
                <VenueList venues={hybridGroups.extraOrNuance} hybrid />
              </div>
            ) : null}
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
