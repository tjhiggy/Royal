import { useMemo, useState } from 'react'
import DecisionNextStep from '../components/DecisionNextStep'
import FormField from '../components/FormField'
import PageHero from '../components/PageHero'
import ResultPanel from '../components/ResultPanel'
import SectionHeader from '../components/SectionHeader'
import ShareActions from '../components/ShareActions'
import { cruiseCostFields, cruiseCostInitialState } from '../data/cruiseCostConfig'
import { calculateCruiseCost } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'
import { appendShareUrl } from '../utils/share'

export default function CruiseCostPage() {
  const [form, setForm] = useState(cruiseCostInitialState)
  const results = useMemo(() => calculateCruiseCost(form), [form])
  const statusClassName =
    results.status === 'Add-on heavy'
      ? 'status-borderline'
      : results.status === 'Travel-heavy'
        ? 'status-borderline'
        : results.status === 'Fare-first'
          ? 'status-worth-it'
          : 'status-muted'
  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

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
        <div className="form-grid">
          {cruiseCostFields.map(([name, label, helper, min = '0']) => (
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
          ))}
        </div>
      </section>

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
        summary={() => appendShareUrl([
          `${results.status}.`,
          `Base fare: ${formatCurrency(Number(form.cruiseFare) || 0)}`,
          `Real trip cost: ${formatCurrency(results.grandTotal)}`,
          `Biggest add-on driver: ${results.biggestAddOnDrivers[0]?.label ?? 'No major add-on'}`,
        ])}
      />

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
    </div>
  )
}
