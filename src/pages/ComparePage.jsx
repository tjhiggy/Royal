import { useMemo, useState } from 'react'
import FormField from '../components/FormField'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import { cruiseCostFields, cruiseCostInitialState } from '../data/cruiseCostConfig'
import { calculateCruiseCost, compareCruiseCostScenarios } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'

const comparePresets = [
  {
    label: 'Drink package vs pay-as-you-go',
    scenarioA: {
      ...cruiseCostInitialState,
      drinkPackage: 950,
    },
    scenarioB: {
      ...cruiseCostInitialState,
      drinkPackage: 0,
    },
  },
  {
    label: 'Full experience vs budget version',
    scenarioA: {
      ...cruiseCostInitialState,
      drinkPackage: 950,
      wifi: 175,
      dining: 320,
      excursions: 650,
      hotel: 260,
      flights: 640,
    },
    scenarioB: {
      ...cruiseCostInitialState,
      drinkPackage: 0,
      wifi: 0,
      dining: 100,
      excursions: 200,
      hotel: 0,
      flights: 480,
    },
  },
  {
    label: 'Fly vs drive',
    scenarioA: {
      ...cruiseCostInitialState,
      hotel: 220,
      flights: 640,
      parking: 120,
      travelExtras: 120,
    },
    scenarioB: {
      ...cruiseCostInitialState,
      hotel: 0,
      flights: 0,
      parking: 220,
      travelExtras: 80,
    },
  },
]

const scenarioBInitialState = {
  ...cruiseCostInitialState,
  drinkPackage: 0,
  excursions: 250,
  hotel: 0,
  flights: 480,
}

const compactFieldNames = new Set([
  'cruiseFare',
  'taxesAndFees',
  'prepaidGratuities',
  'drinkPackage',
  'wifi',
  'dining',
  'excursions',
  'hotel',
  'flights',
  'parking',
  'travelExtras',
  'miscellaneous',
  'travelerCount',
  'cruiseNights',
])

function ScenarioSection({ title, label, form, onChange, results }) {
  return (
    <section className="card compare-scenario-card">
      <div className="compare-scenario-label">{title}</div>
      <SectionHeader
        title="Trip details"
        description={label}
      />
      <div className="compare-form-grid">
        {cruiseCostFields
          .filter(([name]) => compactFieldNames.has(name))
          .map(([name, label, helper, min = '0']) => (
            <FormField
              key={`${title}-${name}`}
              label={label}
              name={name}
              value={form[name]}
              onChange={onChange}
              min={min}
              helper={helper}
              inputMode="decimal"
            />
          ))}
      </div>

      <div className="compare-summary">
        <div className="explanation-item">
          <span>Total trip cost</span>
          <strong>{formatCurrency(results.grandTotal)}</strong>
        </div>
        <div className="explanation-item">
          <span>Cost per person</span>
          <strong>{formatCurrency(results.costPerPerson)}</strong>
        </div>
        <div className="explanation-item">
          <span>Cost per night</span>
          <strong>{formatCurrency(results.costPerNight)}</strong>
        </div>
        <div className="explanation-item">
          <span>Add-ons subtotal</span>
          <strong>{formatCurrency(results.addOnsSubtotal)}</strong>
        </div>
      </div>
    </section>
  )
}

export default function ComparePage() {
  const [scenarioA, setScenarioA] = useState(cruiseCostInitialState)
  const [scenarioB, setScenarioB] = useState(scenarioBInitialState)
  const [activePreset, setActivePreset] = useState('')

  const resultsA = useMemo(() => calculateCruiseCost(scenarioA), [scenarioA])
  const resultsB = useMemo(() => calculateCruiseCost(scenarioB), [scenarioB])
  const comparison = useMemo(() => compareCruiseCostScenarios(resultsA, resultsB), [resultsA, resultsB])

  function handleScenarioChange(setter) {
    return (event) => {
      const { name, value } = event.target
      setter((current) => ({ ...current, [name]: value }))
      setActivePreset('')
    }
  }

  function applyPreset(preset) {
    setScenarioA(preset.scenarioA)
    setScenarioB(preset.scenarioB)
    setActivePreset(preset.label)
  }

  const mainTakeaway =
    comparison.totalDifference === 0
      ? 'Both versions land at about the same total, so the decision comes down to how you want to spend the money.'
      : `${comparison.moreExpensiveScenario} costs about ${formatCurrency(Math.abs(comparison.totalDifference))} more overall.`

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Compare"
        title="Compare two cruise plans before you book the more expensive one"
        description="Test two versions of the same trip side by side and see what changes the total, the nightly cost, and the add-ons."
      />

      <section className="card">
        <SectionHeader
          title="Start with a preset"
          description="Use a common comparison first, then tweak the numbers if your trip is messier than the neat little example."
        />
        <div className="preset-grid">
          {comparePresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={`preset-card ${activePreset === preset.label ? 'preset-card-active' : ''}`}
              aria-pressed={activePreset === preset.label}
              onClick={() => applyPreset(preset)}
            >
              <strong>{preset.label}</strong>
              <span>Load both sides with a realistic starting point.</span>
            </button>
          ))}
        </div>
      </section>

      <div className="two-column-layout compare-layout">
        <ScenarioSection
          title="Scenario A"
          label="Use this side for your first version of the trip."
          form={scenarioA}
          onChange={handleScenarioChange(setScenarioA)}
          results={resultsA}
        />
        <ScenarioSection
          title="Scenario B"
          label="Use this side for the version you want to compare against it."
          form={scenarioB}
          onChange={handleScenarioChange(setScenarioB)}
          results={resultsB}
        />
      </div>

      <section className="card reality-card">
        <div className="verdict-kicker">Difference summary</div>
        <div className="verdict-copy">
          <p>{comparison.interpretation}</p>
          <p>{comparison.driverNote}</p>
        </div>
        <div className="verdict-highlight">
          <span>Main takeaway</span>
          <strong>{mainTakeaway}</strong>
        </div>
        <div className="stats-grid">
          <article className="stat-card stat-card-emphasized">
            <span className="stat-label">Trip total gap</span>
            <strong className="stat-value">{formatCurrency(Math.abs(comparison.totalDifference))}</strong>
            <small className="stat-helper">
              {comparison.totalDifference === 0
                ? 'Both scenarios are tied on total cost.'
                : `${comparison.moreExpensiveScenario} is the pricier version.`}
            </small>
          </article>
          <article className="stat-card">
            <span className="stat-label">Nightly gap</span>
            <strong className="stat-value">{formatCurrency(Math.abs(comparison.costPerNightDifference))}</strong>
            <small className="stat-helper">How much the trip changes when you spread the real total across each night.</small>
          </article>
          <article className="stat-card">
            <span className="stat-label">Add-ons gap</span>
            <strong className="stat-value">{formatCurrency(Math.abs(comparison.addOnsDifference))}</strong>
            <small className="stat-helper">Shows how much of the gap is coming from extras instead of the fare.</small>
          </article>
        </div>
        {comparison.topDifferenceLines.length ? (
          <div className="driver-list">
            {comparison.topDifferenceLines.map((line, index) => (
              <article key={line.key} className="driver-item">
                <span className="driver-rank">{index + 1}</span>
                <div className="driver-copy">
                  <strong>{line.label}</strong>
                  <span>{line.direction}</span>
                </div>
                <strong className="driver-value">
                  {line.value >= 0 ? '+' : '-'}
                  {formatCurrency(Math.abs(line.value))}
                </strong>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}
