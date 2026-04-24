import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AssumptionsPanel from '../components/AssumptionsPanel'
import BrutalSummary from '../components/BrutalSummary'
import CoachingMessage from '../components/CoachingMessage'
import DecisionNextStep from '../components/DecisionNextStep'
import ForgottenCosts from '../components/ForgottenCosts'
import FormField from '../components/FormField'
import PageHero from '../components/PageHero'
import ResultPanel from '../components/ResultPanel'
import SectionHeader from '../components/SectionHeader'
import ShareActions from '../components/ShareActions'
import { cruiseCostFields, cruiseCostInitialState } from '../data/cruiseCostConfig'
import { calculateCruiseCost } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'
import { buildToolShareSummary, buildToolShortShare } from '../utils/shareSummaries'
import { getRecentTripById, saveRecentTrip, saveSnapshotToolState } from '../utils/storage'

const cruiseCostPresets = [
  {
    label: 'Couple (moderate)',
    description: 'Two adults, balanced extras, and a normal amount of vacation optimism.',
    values: {
      cruiseFare: 2400,
      taxesAndFees: 460,
      prepaidGratuities: 260,
      drinkPackage: 950,
      wifi: 180,
      dining: 250,
      excursions: 450,
      theKey: 0,
      hotel: 220,
      flights: 650,
      parking: 100,
      travelExtras: 120,
      miscellaneous: 100,
      travelerCount: 2,
      cruiseNights: 7,
    },
  },
  {
    label: 'Family (2 adults + 2 kids)',
    description: 'Four travelers, more excursions, less bar math. Sanity sold separately.',
    values: {
      cruiseFare: 4200,
      taxesAndFees: 760,
      prepaidGratuities: 520,
      drinkPackage: 900,
      wifi: 240,
      dining: 180,
      excursions: 850,
      theKey: 0,
      hotel: 320,
      flights: 1200,
      parking: 140,
      travelExtras: 220,
      miscellaneous: 250,
      travelerCount: 4,
      cruiseNights: 7,
    },
  },
  {
    label: 'Budget traveler',
    description: 'Lean extras, fewer splurges, and fewer ways for checkout to mug you.',
    values: {
      cruiseFare: 1500,
      taxesAndFees: 320,
      prepaidGratuities: 180,
      drinkPackage: 0,
      wifi: 0,
      dining: 0,
      excursions: 150,
      theKey: 0,
      hotel: 0,
      flights: 0,
      parking: 120,
      travelExtras: 80,
      miscellaneous: 75,
      travelerCount: 2,
      cruiseNights: 5,
    },
  },
  {
    label: 'First cruise',
    description: 'A starter trip with the obvious missing costs already dragged into daylight.',
    values: {
      cruiseFare: 2100,
      taxesAndFees: 430,
      prepaidGratuities: 240,
      drinkPackage: 0,
      wifi: 140,
      dining: 150,
      excursions: 350,
      theKey: 0,
      hotel: 220,
      flights: 500,
      parking: 120,
      travelExtras: 100,
      miscellaneous: 150,
      travelerCount: 2,
      cruiseNights: 6,
    },
  },
  {
    label: 'Vacation mode',
    description: 'Packages, flights, excursions, and the budget wearing sunglasses indoors.',
    values: {
      cruiseFare: 3200,
      taxesAndFees: 560,
      prepaidGratuities: 320,
      drinkPackage: 1250,
      wifi: 280,
      dining: 500,
      excursions: 900,
      theKey: 532,
      hotel: 350,
      flights: 850,
      parking: 140,
      travelExtras: 220,
      miscellaneous: 250,
      travelerCount: 2,
      cruiseNights: 7,
    },
  },
]

const fieldGroups = [
  {
    title: 'Fare and required costs',
    description: 'The price of getting on the ship before optional spending starts.',
    fields: ['cruiseFare', 'taxesAndFees', 'prepaidGratuities', 'travelerCount', 'cruiseNights'],
  },
  {
    title: 'Add-ons',
    description: 'Packages, onboard upgrades, and port choices that can quietly hijack the total.',
    fields: ['drinkPackage', 'wifi', 'dining', 'excursions', 'theKey', 'miscellaneous'],
  },
  {
    title: 'Travel',
    description: 'The cost of getting to the cruise, because the ship does not teleport you there. Rude.',
    fields: ['hotel', 'flights', 'parking', 'travelExtras'],
  },
]

const cruiseCostFieldMap = Object.fromEntries(
  cruiseCostFields.map((field) => [field[0], field]),
)

export default function CruiseCostPage() {
  const location = useLocation()
  const sessionId = useRef(`cost-${Date.now()}`)
  const [form, setForm] = useState(cruiseCostInitialState)
  const [activePreset, setActivePreset] = useState('')
  const results = useMemo(() => calculateCruiseCost(form), [form])
  const statusClassName =
    results.status === 'Add-on heavy'
      ? 'status-borderline'
      : results.status === 'Travel-heavy'
        ? 'status-borderline'
        : results.status === 'Fare-first'
          ? 'status-worth-it'
          : 'status-muted'
  const coachingMessage =
    results.addOnsSubtotal > results.fare && results.fare > 0
      ? 'You are spending more on extras than the cruise itself.'
      : results.travelShare >= 28
        ? 'Getting there is eating a serious chunk of the trip budget.'
        : results.costPerNight >= 600
          ? 'This is premium-priced once the real total is included.'
          : 'Nothing is wildly out of line, but the add-ons still deserve suspicion.'
  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setActivePreset('')
  }

  function applyPreset(preset) {
    setForm((current) => ({ ...current, ...preset.values }))
    setActivePreset(preset.label)
  }

  function quickAddForgottenCost(name, amount) {
    setForm((current) => ({ ...current, [name]: amount }))
    setActivePreset('')
  }

  useEffect(() => {
    const recentId = new URLSearchParams(location.search).get('recent')
    const recentTrip = recentId ? getRecentTripById(recentId) : null

    if (recentTrip?.tool === 'cruise-cost' && recentTrip.data?.form) {
      sessionId.current = recentTrip.id
      setForm({ ...cruiseCostInitialState, ...recentTrip.data.form })
      setActivePreset('')
    }
  }, [location.search])

  useEffect(() => {
    saveRecentTrip({
      id: sessionId.current,
      tool: 'cruise-cost',
      toolLabel: 'Cost Calculator',
      label: `${results.status} | ${formatCurrency(results.grandTotal)}`,
      path: '/tools/cruise-cost',
      data: { form },
    })
    saveSnapshotToolState('cost', { form })
  }, [form, results.grandTotal, results.status])

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Tool"
        title="Cruise Cost Calculator"
        description="Add the full trip, not just the cruise fare, and see what is actually driving the budget."
      />

      <section className="card">
        <SectionHeader
          title="Cost Inputs"
          description="Keep the fare and each extra separate so the total tells the truth instead of brochure fiction."
        />
        <div className="preset-block">
          <div className="preset-copy">
            <strong>Smart presets</strong>
            <span>Pick a realistic starting point, then edit anything that does not match your trip.</span>
          </div>
          <div className="preset-grid">
            {cruiseCostPresets.map((preset) => (
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
        </div>
        <div className="input-group-grid">
          {fieldGroups.map((group) => (
            <div key={group.title} className="input-group-card">
              <div className="input-group-copy">
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
              <div className="form-grid compact-form-grid">
                {group.fields.map((fieldName) => {
                  const [name, label, helper, min = '0'] = cruiseCostFieldMap[fieldName]

                  return (
                    <FormField
                      key={name}
                      label={label}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      min={min}
                      helper={helper}
                      inputMode="decimal"
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ForgottenCosts form={form} onQuickAdd={quickAddForgottenCost} />

      <section className="card reality-card">
        <div className="verdict-kicker">Reality check</div>
        <div className="verdict-headline-row">
          <div>
            <h2 className="reality-headline">{results.status}</h2>
            <div className="reality-copy">
              {results.summaryLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <span className={`status-pill ${statusClassName}`}>{results.status}</span>
        </div>
      </section>

      <ShareActions
        summary={() => buildToolShareSummary({
          title: 'Cruise Cost',
          verdict: results.status,
          keyFigure: `Real trip cost ${formatCurrency(results.grandTotal)}`,
          mainDriver: results.biggestAddOnDrivers[0]?.label ?? 'No major add-on driver yet',
          nextAction: 'Test the add-ons before you keep them in the budget.',
        })}
        shortSummary={() => buildToolShortShare({
          title: 'Cruise Cost',
          verdict: results.status,
          keyFigure: `Real trip cost ${formatCurrency(results.grandTotal)}`,
          nextAction: 'Challenge the biggest add-on.',
        })}
      />

      <CoachingMessage message={coachingMessage} />

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader
            title="Biggest Add-on Drivers"
            description="Start here if you want to know which extras are doing the most damage."
          />
          <div className="driver-list">
            {results.biggestAddOnDrivers.map((driver, index) => (
              <article key={driver.key} className="driver-item">
                <span className="driver-rank">{index + 1}</span>
                <div className="driver-copy">
                  <strong>{driver.label}</strong>
                  <span>{results.grandTotal ? `${((driver.value / results.grandTotal) * 100).toFixed(0)}% of the total` : 'Included in the trip total'}</span>
                </div>
                <strong className="driver-value">{formatCurrency(driver.value)}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="card callout-card">
          <div className="card-topline">
            <h2>Quick wins</h2>
          </div>
          <div className="explanation-list compact-list">
            {results.quickWins.map((win) => (
              <div key={win.title} className="explanation-item">
                <span>
                  <strong>{win.title}</strong>
                  <br />
                  {win.detail}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ResultPanel
        title="Trip Cost Summary"
        intro="This is the supporting math after the reality check tells you where the money is really going."
        stats={[
          { label: 'Grand total', value: results.grandTotal, emphasized: true, helper: 'Your full estimated trip cost' },
          { label: 'Cost per person', value: results.costPerPerson, helper: 'Split across the traveler count above' },
          { label: 'Cost per night', value: results.costPerNight, helper: 'Useful for comparing sailings of different lengths' },
          { label: 'Add-ons subtotal', value: results.addOnsSubtotal, helper: 'Everything besides the base fare' },
        ]}
        note={`Base fare is ${results.fareShare.toFixed(0)}% of the total, add-ons are ${results.extrasShare.toFixed(0)}%, and travel alone is ${results.travelShare.toFixed(
          0,
        )}%. That is the real split.`}
      />

      <DecisionNextStep
        title="Next: test the upgrades"
        description="Now that the real total is visible, check which packages deserve to stay in the budget and which ones are just cruise math cosplay."
        links={[
          { to: '/tools/drink-package', label: 'Check drinks' },
          { to: '/tools/dining-package', label: 'Check dining' },
          { to: '/tools/wifi', label: 'Check WiFi' },
          { to: '/tools/the-key', label: 'Check The Key' },
        ]}
      />

      <AssumptionsPanel
        items={[
          'This totals the categories you enter, including fare, required charges, gratuities, add-ons, travel, and forgotten-cost buckets.',
          'Gratuities, parking, hotels, flights, excursions, and onboard spending can vary by ship, port, sailing, party size, and personal behavior.',
          'This site is independent and not affiliated with Royal Caribbean. Verify current prices in Royal Caribbean official app or site before paying.',
        ]}
      />

      <BrutalSummary
        lines={[
          `${results.status}.`,
          `Base fare: ${formatCurrency(Number(form.cruiseFare) || 0)}`,
          `Real cost: ${formatCurrency(results.grandTotal)}`,
          `Biggest mistake: ${results.biggestAddOnDrivers[0]?.label ?? 'No obvious mistake'}`,
        ]}
      />
    </div>
  )
}
