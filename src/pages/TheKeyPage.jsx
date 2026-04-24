import { useEffect, useMemo, useState } from 'react'
import AssumptionsPanel from '../components/AssumptionsPanel'
import CoachingMessage from '../components/CoachingMessage'
import DecisionNextStep from '../components/DecisionNextStep'
import PageHero from '../components/PageHero'
import ResultPanel from '../components/ResultPanel'
import SectionHeader from '../components/SectionHeader'
import ShareActions from '../components/ShareActions'
import { calculateTheKey } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'
import { buildSavingsLine, buildToolShareSummary, buildToolShortShare } from '../utils/shareSummaries'
import { saveSnapshotToolState } from '../utils/storage'

const initialState = {
  cruiseNights: 7,
  theKeyPricePerDay: 38,
  wifiNeeded: true,
  numberOfDevices: '1',
  embarkationLunch: true,
  priorityBoardingImportance: 'medium',
  reservedSeatingImportance: 'medium',
  skipLineImportance: 'low',
}

const selectOptions = {
  numberOfDevices: [
    { value: '1', label: '1 device' },
    { value: '2', label: '2 devices' },
  ],
  priorityBoardingImportance: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ],
  reservedSeatingImportance: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ],
  skipLineImportance: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ],
}

function SelectField({ label, name, value, onChange, helper, options }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select className="field-input" name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper ? <small className="field-helper">{helper}</small> : null}
    </label>
  )
}

export default function TheKeyPage() {
  const [form, setForm] = useState(initialState)
  const results = useMemo(() => calculateTheKey(form), [form])

  useEffect(() => {
    saveSnapshotToolState('key', { form })
  }, [form])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const outcomeMessage =
    results.netValue > 0
      ? `You are getting about ${formatCurrency(results.netValue)} more value than the package costs.`
      : results.netValue < 0
        ? `You are overpaying by about ${formatCurrency(Math.abs(results.netValue))} based on the perks you actually care about.`
        : 'You are basically at break-even on The Key.'

  const verdictCopy =
    results.recommendation === 'Worth it'
      ? ['The Key looks worthwhile here.', outcomeMessage]
      : results.recommendation === 'Borderline'
        ? ['The Key is a close call here.', outcomeMessage]
        : [
            'The Key is not doing enough to justify the price here.',
            `You are paying ${formatCurrency(results.keyTotal)} for perks worth about ${formatCurrency(results.estimatedValueUsed)} to you.`,
          ]

  const insight =
    results.mainDriver?.label === 'WiFi value'
      ? 'Most of the value is coming from WiFi. If you would not buy internet anyway, The Key gets weak fast.'
      : results.mainDriver
        ? `${results.mainDriver.label} is doing the most work. The convenience perks only matter if you actually care about them.`
      : 'Most of the bundled perks are not adding enough real value for this trip.'
  const coachingMessage =
    results.recommendation === 'Skip it'
      ? 'The Key is mostly selling status here, not usable value.'
      : results.mainDriver?.label === 'WiFi value'
        ? 'WiFi is carrying this package. If you would not buy internet, The Key gets shaky fast.'
        : results.recommendation === 'Borderline'
          ? 'This is close enough that convenience has to matter to you personally.'
          : 'The perks you selected are strong enough to make The Key defensible.'

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Tool"
        title="The Key Calculator"
        description="Check whether The Key is actually worth the money for your trip instead of assuming the VIP label means value."
      />

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader
            title="Trip basics"
            description="Start with the sailing length and the daily price."
          />
          <div className="form-grid">
            <label className="field">
              <span className="field-label">Cruise nights</span>
              <input
                className="field-input"
                type="number"
                min="1"
                name="cruiseNights"
                value={form.cruiseNights}
                onChange={handleChange}
                inputMode="numeric"
              />
              <small className="field-helper">Use the length of the sailing for one guest.</small>
            </label>
            <label className="field">
              <span className="field-label">The Key price per day</span>
              <input
                className="field-input"
                type="number"
                min="0"
                name="theKeyPricePerDay"
                value={form.theKeyPricePerDay}
                onChange={handleChange}
                inputMode="decimal"
              />
              <small className="field-helper">Enter the daily price you are seeing before checkout.</small>
            </label>
          </div>
        </section>

        <section className="card">
          <SectionHeader
            title="What you would actually use"
            description="Only count the perks you care about. Cruise marketing does not get a vote."
          />
          <div className="form-grid">
            <label className="toggle-field">
              <input type="checkbox" name="wifiNeeded" checked={form.wifiNeeded} onChange={handleChange} />
              <span className="toggle-copy">
                <strong>WiFi needed</strong>
                <small>Only count this if you would have bought internet anyway.</small>
              </span>
            </label>
            <label className="toggle-field">
              <input type="checkbox" name="embarkationLunch" checked={form.embarkationLunch} onChange={handleChange} />
              <span className="toggle-copy">
                <strong>Embarkation lunch</strong>
                <small>Count this if you would actually use the lunch perk.</small>
              </span>
            </label>
            <SelectField
              label="Number of devices"
              name="numberOfDevices"
              value={form.numberOfDevices}
              onChange={handleChange}
              helper="Only matters if WiFi is part of the value for you."
              options={selectOptions.numberOfDevices}
            />
            <SelectField
              label="Priority boarding importance"
              name="priorityBoardingImportance"
              value={form.priorityBoardingImportance}
              onChange={handleChange}
              helper="How much faster boarding matters to you."
              options={selectOptions.priorityBoardingImportance}
            />
            <SelectField
              label="Reserved seating importance"
              name="reservedSeatingImportance"
              value={form.reservedSeatingImportance}
              onChange={handleChange}
              helper="Useful if you care about less hassle around shows."
              options={selectOptions.reservedSeatingImportance}
            />
            <SelectField
              label="Skip-the-line perks importance"
              name="skipLineImportance"
              value={form.skipLineImportance}
              onChange={handleChange}
              helper="Think tender lines, departure timing, and similar friction."
              options={selectOptions.skipLineImportance}
            />
          </div>
        </section>
      </div>

      <section className={`card verdict-card verdict-${results.recommendation.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="verdict-kicker">The Key verdict</div>
        <div className="verdict-headline-row">
          <div>
            <h2 className="verdict-headline">{results.recommendation}</h2>
            <div className="verdict-copy">
              {verdictCopy.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <span className={`status-pill verdict-pill status-${results.recommendation.toLowerCase().replace(/\s+/g, '-')}`}>
            {results.recommendation}
          </span>
        </div>
        <div className="verdict-highlight">
          <span>Main takeaway</span>
          <strong>{outcomeMessage}</strong>
        </div>
        <p className="verdict-insight">{insight}</p>
      </section>

      <CoachingMessage message={coachingMessage} />

      <ShareActions
        summary={() => buildToolShareSummary({
          title: 'The Key',
          verdict: results.recommendation,
          keyFigure: buildSavingsLine({ positiveLabel: 'Value beats cost by', amount: results.netValue }),
          mainDriver: insight,
          nextAction: results.recommendation === 'Skip it'
            ? 'Leave The Key out unless the perks matter more than the math.'
            : 'Compare the trip with and without The Key.',
        })}
        shortSummary={() => buildToolShortShare({
          title: 'The Key',
          verdict: results.recommendation,
          keyFigure: buildSavingsLine({ positiveLabel: 'Value beats cost by', amount: results.netValue }),
          nextAction: results.recommendation === 'Skip it' ? 'Skip it unless the perks matter.' : 'Compare with and without it.',
        })}
      />

      <ResultPanel
        title="The Key summary"
        intro="This compares what The Key costs against the value you would realistically use."
        stats={[
          { label: 'The Key total', value: results.keyTotal, emphasized: true, helper: 'Estimated total cost for the sailing' },
          { label: 'Estimated value used', value: results.estimatedValueUsed, helper: 'What the included perks are worth to you here' },
          { label: results.netValue >= 0 ? 'Value over cost' : 'Overpay', value: Math.abs(results.netValue), helper: 'The gap between price and estimated value' },
        ]}
      />

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader
            title="Value drivers"
            description="These are the perks doing the heavy lifting in the estimate."
          />
          <div className="explanation-list">
            {results.valueDrivers.length ? (
              results.valueDrivers.map((driver) => (
                <div key={driver.label} className="explanation-item">
                  <span>{driver.label}</span>
                  <strong>{formatCurrency(driver.value)}</strong>
                </div>
              ))
            ) : (
              <div className="explanation-item">
                <span>No meaningful value selected</span>
                <strong>{formatCurrency(0)}</strong>
              </div>
            )}
          </div>
        </section>

        <section className="card callout-card">
          <SectionHeader
            title="What would make it worth it"
            description="These are the few real changes that would stop this from being an obvious overpay."
          />
          <div className="explanation-list">
            {results.suggestions.map((suggestion) => (
              <div key={suggestion} className="explanation-item">
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <DecisionNextStep
        title="Next: compare the trip versions"
        description="If The Key survives the math, compare the full trip with and without it. VIP vibes do not get a free pass."
        links={[{ to: '/compare', label: 'Compare scenarios' }]}
      />

      <AssumptionsPanel
        items={[
          'This estimates The Key by comparing the package cost with the perks you say you would actually use.',
          'Perks, availability, boarding flow, show access, internet pricing, and package price can vary by ship and sailing.',
          'This site is independent and not affiliated with Royal Caribbean. Verify current The Key terms and price in Royal Caribbean official app or site before buying.',
        ]}
      />
    </div>
  )
}
