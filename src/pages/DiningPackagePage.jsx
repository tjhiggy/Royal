import { useMemo, useState } from 'react'
import CoachingMessage from '../components/CoachingMessage'
import DecisionNextStep from '../components/DecisionNextStep'
import PageHero from '../components/PageHero'
import ResultPanel from '../components/ResultPanel'
import SectionHeader from '../components/SectionHeader'
import { calculateDiningPackage } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'

const initialState = {
  cruiseNights: 7,
  priceMode: 'per-day',
  packagePrice: 45,
  specialtyDinnersPlanned: 4,
  specialtyLunchesPlanned: 2,
  seaDays: 3,
  portDays: 4,
  interestLevel: 'medium',
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

export default function DiningPackagePage() {
  const [form, setForm] = useState(initialState)
  const results = useMemo(() => calculateDiningPackage(form), [form])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const outcomeMessage =
    results.netSavings > 0
      ? `You would save about ${formatCurrency(results.netSavings)} with the package.`
      : results.netSavings < 0
        ? `You would overpay by about ${formatCurrency(Math.abs(results.netSavings))}.`
        : 'You are basically at break-even either way.'

  const verdictExplanation =
    results.recommendation === 'Worth it'
      ? [
          outcomeMessage,
          'You are planning enough real specialty meals for the package to make sense.',
        ]
      : results.recommendation === 'Borderline'
        ? [
            outcomeMessage,
            'This is close enough that convenience is doing more work than savings.',
          ]
        : [
            outcomeMessage,
            'You are not using enough specialty meals to make the package the smart buy.',
          ]

  const roundedBreakEvenMeals = Math.max(Math.ceil(results.breakEvenMealsRequired), 0)
  const roundedMealUsage = Math.max(Math.round(results.estimatedDinnerCount + results.estimatedLunchCount), 0)
  const worthItInsight =
    results.recommendation === 'Worth it'
      ? 'This only works if you actually use the specialty meals instead of buying the package for theoretical maximum value.'
      : `You need about ${roundedBreakEvenMeals} specialty meals to break even, and your current plan looks closer to ${roundedMealUsage}.`
  const coachingMessage =
    roundedMealUsage < roundedBreakEvenMeals
      ? 'You are not planning enough specialty meals to make this package behave.'
      : Number(form.portDays) > Number(form.seaDays) && Number(form.specialtyLunchesPlanned) > 0
        ? 'Port-heavy trips make specialty lunches easier to overcount.'
        : 'The package only wins if these meals are real plans, not menu-daydreaming.'

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Tool"
        title="Dining Package Calculator"
        description="Check whether the Unlimited Dining Package is actually saving money or just making the booking flow feel productive."
      />

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader
            title="Trip inputs"
            description="Start with the sailing length, how the package is priced, and how many days you will actually be onboard for lunch."
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
              <small className="field-helper">Use the full sailing length for one guest buying the package.</small>
            </label>
            <SelectField
              label="Package price type"
              name="priceMode"
              value={form.priceMode}
              onChange={handleChange}
              helper="Pick the way the price is being shown to you."
              options={[
                { value: 'per-day', label: 'Per day' },
                { value: 'total', label: 'Total package price' },
              ]}
            />
            <label className="field">
              <span className="field-label">{form.priceMode === 'per-day' ? 'Package price per day' : 'Package total'}</span>
              <input
                className="field-input"
                type="number"
                min="0"
                name="packagePrice"
                value={form.packagePrice}
                onChange={handleChange}
                inputMode="decimal"
              />
              <small className="field-helper">
                {form.priceMode === 'per-day'
                  ? 'Use the advertised daily rate you are actually seeing.'
                  : 'Use the all-in package total if that is how you priced it.'}
              </small>
            </label>
            <label className="field">
              <span className="field-label">Sea days</span>
              <input
                className="field-input"
                type="number"
                min="0"
                name="seaDays"
                value={form.seaDays}
                onChange={handleChange}
                inputMode="numeric"
              />
              <small className="field-helper">Sea days matter more for lunch value than people like to admit.</small>
            </label>
            <label className="field">
              <span className="field-label">Port days</span>
              <input
                className="field-input"
                type="number"
                min="0"
                name="portDays"
                value={form.portDays}
                onChange={handleChange}
                inputMode="numeric"
              />
              <small className="field-helper">Port-heavy trips usually make lunch usage flimsier.</small>
            </label>
          </div>
        </section>

        <section className="card">
          <SectionHeader
            title="Realistic usage"
            description="Count the meals you are actually likely to use, not the heroic version of you who never gets distracted by included food."
          />
          <div className="form-grid">
            <label className="field">
              <span className="field-label">Specialty dinners planned</span>
              <input
                className="field-input"
                type="number"
                min="0"
                name="specialtyDinnersPlanned"
                value={form.specialtyDinnersPlanned}
                onChange={handleChange}
                inputMode="numeric"
              />
              <small className="field-helper">How many dinners you realistically expect to book.</small>
            </label>
            <label className="field">
              <span className="field-label">Specialty lunches planned</span>
              <input
                className="field-input"
                type="number"
                min="0"
                name="specialtyLunchesPlanned"
                value={form.specialtyLunchesPlanned}
                onChange={handleChange}
                inputMode="numeric"
              />
              <small className="field-helper">Lunches count, but they are easier to overestimate.</small>
            </label>
            <SelectField
              label="Interest in specialty dining"
              name="interestLevel"
              value={form.interestLevel}
              onChange={handleChange}
              helper="This adjusts usage realism instead of assuming you will maximize every meal."
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
            />
          </div>
        </section>
      </div>

      <section className={`card verdict-card verdict-${results.recommendation.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="verdict-kicker">Package verdict</div>
        <div className="verdict-headline-row">
          <div>
            <h2 className="verdict-headline">{results.recommendation}</h2>
            <div className="verdict-copy">
              {verdictExplanation.map((line) => (
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
        <p className="verdict-insight">{worthItInsight}</p>
      </section>

      <CoachingMessage message={coachingMessage} />

      <ResultPanel
        title="Supporting numbers"
        intro="This is the money side once you stop pretending you will use every possible meal."
        stats={[
          { label: 'Package total', value: results.packageTotal, emphasized: true, helper: 'Estimated total cost for the dining package' },
          { label: 'Estimated value used', value: results.estimatedValueUsed, helper: 'What your realistic specialty meal use is worth' },
          { label: 'Break-even meals required', value: roundedBreakEvenMeals, helper: 'Approximate specialty meals needed to justify the package' },
        ]}
      />

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader
            title="Usage reality"
            description="This is the meal mix the calculator is actually valuing, not the optimistic maximum."
          />
          <div className="explanation-list">
            <div className="explanation-item">
              <span>Estimated specialty dinners used</span>
              <strong>{results.estimatedDinnerCount.toFixed(1)}</strong>
            </div>
            <div className="explanation-item">
              <span>Estimated specialty lunches used</span>
              <strong>{results.estimatedLunchCount.toFixed(1)}</strong>
            </div>
            <div className="explanation-item">
              <span>Estimated dinner value</span>
              <strong>{formatCurrency(results.dinnerValue)}</strong>
            </div>
            <div className="explanation-item">
              <span>Estimated lunch value</span>
              <strong>{formatCurrency(results.lunchValue)}</strong>
            </div>
            <div className="explanation-item">
              <span>Average meal value used for break-even</span>
              <strong>{formatCurrency(results.weightedMealValue)}</strong>
            </div>
          </div>
        </section>

        <section className="card callout-card">
          <SectionHeader
            title="Quick wins"
            description="These are the obvious moves if you are trying not to donate money to the package."
          />
          <div className="explanation-list">
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

      <DecisionNextStep
        title="Next: compare the trip versions"
        description="If dining changes the budget, compare the package version against the leaner version before the checkout page starts acting charming."
        links={[{ to: '/compare', label: 'Compare scenarios' }]}
      />
    </div>
  )
}
