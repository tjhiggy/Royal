import { useMemo, useState } from 'react'
import FormField from '../components/FormField'
import PageHero from '../components/PageHero'
import ResultPanel from '../components/ResultPanel'
import SectionHeader from '../components/SectionHeader'
import { calculateCruiseCost } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'

const initialState = {
  cruiseFare: 2200,
  taxesAndFees: 420,
  prepaidGratuities: 250,
  drinkPackage: 950,
  wifi: 175,
  dining: 200,
  excursions: 450,
  hotel: 220,
  flights: 640,
  parking: 120,
  travelExtras: 120,
  miscellaneous: 100,
  travelerCount: 2,
  cruiseNights: 7,
}

const costFields = [
  ['cruiseFare', 'Cruise fare', 'Base cabin fare before the add-ons pile on.'],
  ['taxesAndFees', 'Taxes and fees', 'Port charges and required fees.'],
  ['prepaidGratuities', 'Prepaid gratuities', 'Include them here if you plan to prepay.'],
  ['drinkPackage', 'Drink package', 'Total package cost for the trip.'],
  ['wifi', 'WiFi', 'Internet package cost for everyone covered.'],
  ['dining', 'Dining', 'Specialty dining, tastings, and similar extras.'],
  ['excursions', 'Excursions', 'Tours, beach clubs, or booked activities.'],
  ['hotel', 'Hotel', 'Pre-cruise or post-cruise hotel spend.'],
  ['flights', 'Flights', 'Airfare or major travel tickets.'],
  ['parking', 'Parking', 'Port parking or related ground costs.'],
  ['travelExtras', 'Travel extras', 'Transfers, gas, tips, baggage fees, and similar bits.'],
  ['miscellaneous', 'Miscellaneous', 'Anything else that absolutely will not stay at zero.'],
  ['travelerCount', 'Traveler count', 'Used for the per-person view.', '1'],
  ['cruiseNights', 'Cruise nights', 'Used for the per-night view.', '1'],
]

export default function CruiseCostPage() {
  const [form, setForm] = useState(initialState)
  const results = useMemo(() => calculateCruiseCost(form), [form])
  const statusClassName =
    results.status === 'Add-on heavy'
      ? 'status-borderline'
      : results.status === 'Travel-heavy'
        ? 'status-borderline'
        : results.status === 'Fare-first'
          ? 'status-worth-it'
          : 'status-muted'
  const quickWinMessage = results.quickWin.replace(/^Quick win:\s*/i, '')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Tool"
        title="Cruise Cost Calculator"
        description="Add the full trip, not just the cruise fare. Because the brochure price is usually only the opening act."
      />

      <section className="card">
        <SectionHeader
          title="Cost Inputs"
          description="Keep the fare and each extra separate so the total tells the truth instead of brochure fiction."
        />
        <div className="form-grid">
          {costFields.map(([name, label, helper, min = '0']) => (
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

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader
            title="Biggest Cost Drivers"
            description="Start here if you want to know which line items are doing the most damage."
          />
          <div className="driver-list">
            {results.biggestCostDrivers.map((driver, index) => (
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
            <h2>Quick Win</h2>
          </div>
          <p className="quick-win-copy">{quickWinMessage}</p>
          <div className="explanation-list compact-list">
            <div className="explanation-item">
              <span>Travel-related costs</span>
              <strong>{formatCurrency(results.travelCosts)}</strong>
            </div>
            <div className="explanation-item">
              <span>Add-ons share of total</span>
              <strong>{results.extrasShare.toFixed(0)}%</strong>
            </div>
            <div className="explanation-item">
              <span>Base fare share of total</span>
              <strong>{results.fareShare.toFixed(0)}%</strong>
            </div>
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
        note={`Fare is ${results.fareShare.toFixed(0)}% of the total, extras are ${results.extrasShare.toFixed(0)}%, and travel alone is ${results.travelShare.toFixed(
          0,
        )}%. That is the real split, not the brochure fairy tale.`}
      />
    </div>
  )
}
