import { useEffect, useMemo, useState } from 'react'
import CoachingMessage from '../components/CoachingMessage'
import DecisionNextStep from '../components/DecisionNextStep'
import PageHero from '../components/PageHero'
import ResultPanel from '../components/ResultPanel'
import SectionHeader from '../components/SectionHeader'
import ShareActions from '../components/ShareActions'
import { calculateWifiRecommendation } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'
import { appendShareUrl } from '../utils/share'
import { saveSnapshotToolState } from '../utils/storage'

const initialState = {
  cruiseNights: 7,
  wifiPricePerDevicePerDay: 20,
  peopleCount: 2,
  deviceCount: 2,
  usageType: 'moderate',
  willingToShare: true,
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

export default function WifiCalculatorPage() {
  const [form, setForm] = useState(initialState)
  const results = useMemo(() => calculateWifiRecommendation(form), [form])

  useEffect(() => {
    saveSnapshotToolState('wifi', { form })
  }, [form])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const verdictLines =
    results.recommendedPlan === 'no-wifi'
      ? [
          'WiFi is probably not worth it for this trip.',
          `Skipping it would avoid about ${formatCurrency(results.oneDeviceCost)} in spend.`,
        ]
      : results.recommendedPlan === 'one-device'
        ? [
            results.recommendation,
            `A second device would likely waste about ${formatCurrency(results.estimatedWastedSpend)}.`,
          ]
        : [
            'Buy 2 devices',
            'Your usage looks heavy enough that paying for extra internet is more defensible here.',
          ]
  const coachingMessage =
    results.recommendedPlan === 'no-wifi'
      ? 'Your usage is light enough that WiFi may be pure habit spend.'
      : results.recommendedPlan === 'one-device' && form.willingToShare
        ? 'Sharing one device is doing real savings work here.'
        : results.recommendedPlan === 'two-device'
          ? 'Multiple active devices make the second plan easier to defend.'
          : 'One device is the safer middle ground before you overbuy internet.'

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Tool"
        title="WiFi Calculator"
        description="Check how many internet packages you actually need before you overbuy them out of habit."
      />

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader
            title="Trip basics"
            description="Start with the sailing length and the daily price per device."
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
              <small className="field-helper">Use the sailing length for the trip you are pricing.</small>
            </label>
            <label className="field">
              <span className="field-label">WiFi price per device per day</span>
              <input
                className="field-input"
                type="number"
                min="0"
                name="wifiPricePerDevicePerDay"
                value={form.wifiPricePerDevicePerDay}
                onChange={handleChange}
                inputMode="decimal"
              />
              <small className="field-helper">Enter the daily rate you are actually seeing.</small>
            </label>
          </div>
        </section>

        <section className="card">
          <SectionHeader
            title="How you would use it"
            description="Be honest here. Buying internet for imaginary productivity is how the math gets stupid."
          />
          <div className="form-grid">
            <label className="field">
              <span className="field-label">Number of people</span>
              <input
                className="field-input"
                type="number"
                min="1"
                name="peopleCount"
                value={form.peopleCount}
                onChange={handleChange}
                inputMode="numeric"
              />
              <small className="field-helper">How many people would want access at all.</small>
            </label>
            <label className="field">
              <span className="field-label">Number of devices</span>
              <input
                className="field-input"
                type="number"
                min="1"
                name="deviceCount"
                value={form.deviceCount}
                onChange={handleChange}
                inputMode="numeric"
              />
              <small className="field-helper">Phones, tablets, or laptops you expect to connect.</small>
            </label>
            <SelectField
              label="Usage type"
              name="usageType"
              value={form.usageType}
              onChange={handleChange}
              helper="Use the honest version, not the version you tell yourself before the trip."
              options={[
                { value: 'light', label: 'Light (messages)' },
                { value: 'moderate', label: 'Moderate (social, browsing)' },
                { value: 'heavy', label: 'Heavy (video, work)' },
              ]}
            />
            <label className="toggle-field">
              <input type="checkbox" name="willingToShare" checked={form.willingToShare} onChange={handleChange} />
              <span className="toggle-copy">
                <strong>Willing to share devices</strong>
                <small>Useful for couples or families willing to swap logins instead of paying twice.</small>
              </span>
            </label>
          </div>
        </section>
      </div>

      <section className={`card verdict-card verdict-${results.verdict.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="verdict-kicker">WiFi verdict</div>
        <div className="verdict-headline-row">
          <div>
            <h2 className="verdict-headline">{results.recommendation}</h2>
            <div className="verdict-copy">
              {verdictLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <span className={`status-pill verdict-pill status-${results.verdict.toLowerCase().replace(/\s+/g, '-')}`}>
            {results.recommendedPlan === 'no-wifi' ? 'Skip WiFi' : results.recommendation}
          </span>
        </div>
        <div className="verdict-highlight">
          <span>Main takeaway</span>
          <strong>{results.wastedSpendMessage}</strong>
        </div>
      </section>

      <CoachingMessage message={coachingMessage} />

      <ShareActions
        summary={() => appendShareUrl([
          `WiFi verdict: ${results.recommendation}.`,
          `No WiFi: ${formatCurrency(results.noWifiCost)}`,
          `1 device: ${formatCurrency(results.oneDeviceCost)}`,
          `2 devices: ${formatCurrency(results.twoDeviceCost)}`,
          results.wastedSpendMessage,
        ])}
        shortSummary={() => `${results.recommendation}: ${results.wastedSpendMessage}`}
      />

      <ResultPanel
        title="WiFi option costs"
        intro="This compares no WiFi, one device, and two devices so the obvious overbuy stands out fast."
        stats={[
          { label: 'No WiFi', value: results.noWifiCost, helper: 'Useful if your usage is light enough to skip it' },
          { label: '1 device plan', value: results.oneDeviceCost, emphasized: true, helper: 'Usually the middle-ground option' },
          { label: '2 device plan', value: results.twoDeviceCost, helper: 'Best only when multiple people or heavy usage justify it' },
        ]}
      />

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader
            title="Cost jumps"
            description="This shows what each upgrade step actually adds to the bill."
          />
          <div className="explanation-list">
            <div className="explanation-item">
              <span>1 device vs no WiFi</span>
              <strong>{formatCurrency(results.differences.oneVsNone)}</strong>
            </div>
            <div className="explanation-item">
              <span>2 devices vs 1 device</span>
              <strong>{formatCurrency(results.differences.twoVsOne)}</strong>
            </div>
            <div className="explanation-item">
              <span>2 devices vs no WiFi</span>
              <strong>{formatCurrency(results.differences.twoVsNone)}</strong>
            </div>
          </div>
        </section>

        <section className="card callout-card">
          <SectionHeader
            title="Why"
            description="The recommendation is based on your usage, device count, and whether you are willing to share."
          />
          <div className="explanation-list">
            {results.insightLines.map((line) => (
              <div key={line} className="explanation-item">
                <span>{line}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <DecisionNextStep
        title="Next: compare the trip versions"
        description="If WiFi changes the plan, compare one-device, two-device, or no-WiFi versions before paying for imaginary productivity."
        links={[{ to: '/compare', label: 'Compare scenarios' }]}
      />
    </div>
  )
}
