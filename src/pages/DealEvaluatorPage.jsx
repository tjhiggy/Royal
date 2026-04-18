import { useMemo, useState } from 'react'
import PageHero from '../components/PageHero'
import ResultPanel from '../components/ResultPanel'
import SectionHeader from '../components/SectionHeader'
import { calculateDealEvaluator } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'

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

export default function DealEvaluatorPage() {
  const [form, setForm] = useState(initialState)
  const results = useMemo(() => calculateDealEvaluator(form), [form])
  const statusClassName =
    results.verdict === 'Solid deal'
      ? 'status-worth-it'
      : results.verdict === 'Mixed deal'
        ? 'status-borderline'
        : 'status-skip-it'

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Tool"
        title="Deal Evaluator"
        description="Check whether a cruise is actually a good deal once the real trip cost shows up."
      />

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

      <section className="card">
        <SectionHeader
          title="How this compares"
          description="This puts the nightly cost into a range that is easier to judge at a glance."
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
    </div>
  )
}
