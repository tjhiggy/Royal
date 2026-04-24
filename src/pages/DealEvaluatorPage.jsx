import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AssumptionsPanel from '../components/AssumptionsPanel'
import BrutalSummary from '../components/BrutalSummary'
import CoachingMessage from '../components/CoachingMessage'
import DecisionNextStep from '../components/DecisionNextStep'
import PageHero from '../components/PageHero'
import ResultPanel from '../components/ResultPanel'
import SectionHeader from '../components/SectionHeader'
import ShareActions from '../components/ShareActions'
import { calculateDealEvaluator } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'
import { buildToolShareSummary, buildToolShortShare } from '../utils/shareSummaries'
import { getRecentTripById, saveRecentTrip, saveSnapshotToolState } from '../utils/storage'

const initialState = {
  cruiseNights: 7,
  baseFare: 2200,
  taxesAndFees: 420,
  drinkPackage: 950,
  wifi: 175,
  excursions: 450,
  specialtyDining: 200,
  theKey: 0,
  flights: 640,
  hotel: 220,
  parkingTransport: 120,
}

const dealPresets = [
  {
    label: 'Couple (moderate)',
    description: 'Two-adult trip with normal packages and travel costs.',
    values: {
      cruiseNights: 7,
      baseFare: 2400,
      taxesAndFees: 460,
      drinkPackage: 950,
      wifi: 180,
      excursions: 450,
      specialtyDining: 250,
      theKey: 0,
      flights: 650,
      hotel: 220,
      parkingTransport: 120,
    },
  },
  {
    label: 'Family (2 adults + 2 kids)',
    description: 'Higher fare, bigger excursion spend, and fewer premium adult add-ons.',
    values: {
      cruiseNights: 7,
      baseFare: 4200,
      taxesAndFees: 760,
      drinkPackage: 900,
      wifi: 240,
      excursions: 850,
      specialtyDining: 180,
      theKey: 0,
      flights: 1200,
      hotel: 320,
      parkingTransport: 160,
    },
  },
  {
    label: 'Budget traveler',
    description: 'Low add-ons, drive-to-port energy, and fewer self-inflicted wounds.',
    values: {
      cruiseNights: 5,
      baseFare: 1500,
      taxesAndFees: 320,
      drinkPackage: 0,
      wifi: 0,
      excursions: 150,
      specialtyDining: 0,
      theKey: 0,
      flights: 0,
      hotel: 0,
      parkingTransport: 120,
    },
  },
  {
    label: 'First cruise',
    description: 'A safer starter setup with the usual forgotten costs included before they ambush you.',
    values: {
      cruiseNights: 6,
      baseFare: 2100,
      taxesAndFees: 430,
      drinkPackage: 0,
      wifi: 140,
      excursions: 350,
      specialtyDining: 150,
      theKey: 0,
      flights: 500,
      hotel: 220,
      parkingTransport: 120,
    },
  },
  {
    label: 'Vacation mode',
    description: 'The full send: drinks, dining, excursions, and travel all joining the party.',
    values: {
      cruiseNights: 7,
      baseFare: 3200,
      taxesAndFees: 560,
      drinkPackage: 1250,
      wifi: 280,
      excursions: 900,
      specialtyDining: 500,
      theKey: 532,
      flights: 850,
      hotel: 350,
      parkingTransport: 180,
    },
  },
]

export default function DealEvaluatorPage() {
  const location = useLocation()
  const sessionId = useRef(`deal-${Date.now()}`)
  const [form, setForm] = useState(initialState)
  const [activePreset, setActivePreset] = useState('')
  const results = useMemo(() => calculateDealEvaluator(form), [form])
  const statusClassName =
    results.verdict === 'Solid deal'
      ? 'status-worth-it'
      : results.verdict === 'Mixed deal'
        ? 'status-borderline'
        : 'status-skip-it'
  const coachingMessage =
    results.costPerNight >= 900
      ? 'This is a premium-priced sailing once everything is included.'
      : results.addOnsShare > 55
        ? 'The add-ons are doing more damage than the fare wants you to notice.'
        : results.travelShare >= 25
          ? 'Travel costs are big enough to change whether this deal is actually good.'
          : 'This deal is not automatically bad, but the full trip total gets the final vote.'

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setActivePreset('')
  }

  function applyPreset(preset) {
    setForm((current) => ({ ...current, ...preset.values }))
    setActivePreset(preset.label)
  }

  useEffect(() => {
    const recentId = new URLSearchParams(location.search).get('recent')
    const recentTrip = recentId ? getRecentTripById(recentId) : null

    if (recentTrip?.tool === 'deal-evaluator' && recentTrip.data?.form) {
      sessionId.current = recentTrip.id
      setForm({ ...initialState, ...recentTrip.data.form })
      setActivePreset('')
    }
  }, [location.search])

  useEffect(() => {
    saveRecentTrip({
      id: sessionId.current,
      tool: 'deal-evaluator',
      toolLabel: 'Deal Evaluator',
      label: `${results.verdict} | ${formatCurrency(results.total)}`,
      path: '/tools/deal-evaluator',
      data: { form },
    })
    saveSnapshotToolState('deal', { form })
  }, [form, results.total, results.verdict])

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Tool"
        title="Deal Evaluator"
        description="Check whether a cruise is actually a good deal once the real trip cost shows up."
      />

      <section className="card">
        <SectionHeader
          title="Smart presets"
          description="Start from a realistic trip profile, then edit the messy details. Because your trip will absolutely have messy details."
        />
        <div className="preset-grid">
          {dealPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={`preset-card ${activePreset === preset.label ? 'preset-card-active' : ''}`}
              aria-pressed={activePreset === preset.label}
              onClick={() => applyPreset(preset)}
            >
              <strong>{preset.label}</strong>
              <span>{preset.description}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader
            title="Cruise"
            description="Start with the fare and the required charges."
          />
          <div className="form-grid">
            <label className="field">
              <span className="field-label">Cruise nights</span>
              <input className="field-input" type="number" min="1" name="cruiseNights" value={form.cruiseNights} onChange={handleChange} inputMode="numeric" />
              <small className="field-helper">Needed for the per-night reality check.</small>
            </label>
            <label className="field">
              <span className="field-label">Base fare</span>
              <input className="field-input" type="number" min="0" name="baseFare" value={form.baseFare} onChange={handleChange} inputMode="decimal" />
              <small className="field-helper">The cabin price before the extras start circling.</small>
            </label>
            <label className="field field-full">
              <span className="field-label">Taxes &amp; fees</span>
              <input className="field-input" type="number" min="0" name="taxesAndFees" value={form.taxesAndFees} onChange={handleChange} inputMode="decimal" />
              <small className="field-helper">Port charges and required fees.</small>
            </label>
          </div>
        </section>

        <section className="card">
          <SectionHeader
            title="Add-ons"
            description="These are the upgrades that quietly turn the deal into something else."
          />
          <div className="form-grid">
            {[
              ['drinkPackage', 'Drink package'],
              ['wifi', 'WiFi'],
              ['excursions', 'Excursions'],
              ['specialtyDining', 'Specialty dining'],
              ['theKey', 'The Key'],
            ].map(([name, label]) => (
              <label key={name} className="field">
                <span className="field-label">{label}</span>
                <input className="field-input" type="number" min="0" name={name} value={form[name]} onChange={handleChange} inputMode="decimal" />
                <small className="field-helper">Enter the full trip cost for this item.</small>
              </label>
            ))}
          </div>
        </section>
      </div>

      <section className="card">
        <SectionHeader
          title="Travel"
          description="Getting there counts. The cruise line brochure does not get to pretend otherwise."
        />
        <div className="form-grid">
          {[
            ['flights', 'Flights'],
            ['hotel', 'Hotel'],
            ['parkingTransport', 'Parking / transport'],
          ].map(([name, label]) => (
            <label key={name} className="field">
              <span className="field-label">{label}</span>
              <input className="field-input" type="number" min="0" name={name} value={form[name]} onChange={handleChange} inputMode="decimal" />
              <small className="field-helper">Use the full trip estimate, not the optimistic version.</small>
            </label>
          ))}
        </div>
      </section>

      <section className="card reality-card">
        <div className="verdict-kicker">Deal verdict</div>
        <div className="verdict-headline-row">
          <div>
            <h2 className="reality-headline">{results.verdict}</h2>
            <div className="reality-copy">
              {results.verdictLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <span className={`status-pill ${statusClassName}`}>{results.verdict}</span>
        </div>
      </section>

      <ShareActions
        summary={() => buildToolShareSummary({
          title: 'Deal Evaluator',
          verdict: results.verdict,
          keyFigure: `Real trip cost ${formatCurrency(results.total)}`,
          mainDriver: results.costDrivers[0]?.label ?? 'No major cost driver yet',
          nextAction: 'Run the full Cruise Cost Calculator before booking.',
        })}
        shortSummary={() => buildToolShortShare({
          title: 'Deal Evaluator',
          verdict: results.verdict,
          keyFigure: `Real trip cost ${formatCurrency(results.total)}`,
          nextAction: 'Check the full cost next.',
        })}
      />

      <CoachingMessage message={coachingMessage} />

      <section className="card callout-card">
        <SectionHeader
          title="Reality breakdown"
          description="This is the part the headline fare never tells you."
        />
        <div className="explanation-list">
          <div className="explanation-item">
            <span>Base fare vs total trip</span>
            <strong>{formatCurrency(Number(form.baseFare) || 0)} vs {formatCurrency(results.total)}</strong>
          </div>
          <div className="explanation-item">
            <span>You are not buying a {formatCurrency(Number(form.baseFare) || 0)} cruise. You are taking a {formatCurrency(results.total)} trip.</span>
          </div>
        </div>
      </section>

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader
            title="Add-on pressure"
            description="This shows how much the extras are pushing the deal around."
          />
          <div className="explanation-list">
            <div className="explanation-item">
              <span>Add-ons subtotal</span>
              <strong>{formatCurrency(results.addOnsOnlySubtotal)}</strong>
            </div>
            <div className="explanation-item">
              <span>Travel subtotal</span>
              <strong>{formatCurrency(results.travelSubtotal)}</strong>
            </div>
            <div className="explanation-item">
              <span>Add-ons share of total</span>
              <strong>{results.addOnsShare.toFixed(0)}%</strong>
            </div>
            <div className="explanation-item">
              <span>{results.addOnPressureMessage}</span>
            </div>
          </div>
        </section>

        <section className="card">
          <SectionHeader
            title="Biggest cost drivers"
            description="This is where your controllable spend is actually going."
          />
          <div className="driver-list">
            {results.costDrivers.map((driver, index) => (
              <article key={driver.key} className="driver-item">
                <span className="driver-rank">{index + 1}</span>
                <div className="driver-copy">
                  <strong>{driver.label}</strong>
                  <span>{results.total ? `${((driver.value / results.total) * 100).toFixed(0)}% of the total` : 'Included in the total'}</span>
                </div>
                <strong className="driver-value">{formatCurrency(driver.value)}</strong>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="card comparison-band-card">
        <SectionHeader
          title="How this compares"
          description="The nightly number is the fastest way to tell if a cheap-looking fare is lying."
        />
        <div className="explanation-list">
          <div className="explanation-item">
            <span>Cost per night</span>
            <strong>{formatCurrency(results.costPerNight)}</strong>
          </div>
          <div className="explanation-item">
            <span>{results.nightlyBand.lines[0]}</span>
          </div>
          <div className="explanation-item">
            <span>{results.nightlyBand.lines[1]}</span>
          </div>
        </div>
      </section>

      <ResultPanel
        title="Supporting numbers"
        intro="This is the math behind the verdict after the nicer story falls apart."
        stats={[
          { label: 'Total trip cost', value: results.total, emphasized: true, helper: 'Your full estimated trip cost' },
          { label: 'Cost per night', value: results.costPerNight, helper: 'What the real trip looks like when spread across each night' },
          { label: 'Add-ons subtotal', value: results.addOnsOnlySubtotal, helper: 'Package upgrades and extra onboard spend' },
          { label: 'Travel subtotal', value: results.travelSubtotal, helper: 'Flights, hotel, and parking or transport' },
        ]}
      />

      <section className="card">
        <SectionHeader
          title="Quick wins"
          description="These are the cleanest places to cut cost without pretending the fare is the problem you can control."
        />
        <div className="explanation-list">
          {results.quickWins.map((win) => (
            <div key={win} className="explanation-item">
              <span>
                <strong>{win.title}</strong>
                <br />
                {win.detail}
              </span>
            </div>
          ))}
        </div>
      </section>

      <DecisionNextStep
        title="Next: price the real trip"
        description="If the deal survives the first sniff test, run the full cost next. That is where the quiet little add-ons stop being quiet."
        links={[{ to: '/tools/cruise-cost', label: 'Open Cruise Cost Calculator' }]}
      />

      <AssumptionsPanel
        items={[
          'This estimates the full trip by combining fare, required charges, add-ons, and travel costs you enter.',
          'Actual pricing can vary by sailing, cabin, guest count, sale timing, and what Royal shows in the app or website.',
          'This site is independent and not affiliated with Royal Caribbean. Verify current prices in Royal Caribbean official app or site before booking.',
        ]}
      />

      <BrutalSummary
        lines={[
          `${results.verdict}.`,
          `Base fare: ${formatCurrency(Number(form.baseFare) || 0)}`,
          `Real cost: ${formatCurrency(results.total)}`,
          `Biggest mistake: ${results.costDrivers[0]?.label ?? 'No obvious mistake'}`,
        ]}
      />
    </div>
  )
}
