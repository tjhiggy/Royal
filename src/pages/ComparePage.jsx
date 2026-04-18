import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import FormField from '../components/FormField'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import { cruiseCostFields, cruiseCostInitialState } from '../data/cruiseCostConfig'
import { calculateCruiseCost, compareCruiseCostScenarios } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'
import {
  buildCompareShareUrl,
  buildCompareSummary,
  encodeCompareState,
  getCompareShareState,
} from '../utils/compareShare'
import { loadCompareScenarios, saveCompareScenarios } from '../utils/storage'

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

function ScenarioSection({ title, helper, scenarioLabel, onLabelChange, form, onChange, results }) {
  return (
    <section className="card compare-scenario-card">
      <div className="compare-scenario-label">{title}</div>
      <SectionHeader
        title={scenarioLabel}
        description={helper}
      />
      <label className="field">
        <span className="field-label">Scenario label</span>
        <input
          className="field-input"
          type="text"
          value={scenarioLabel}
          onChange={onLabelChange}
          placeholder={title}
        />
      </label>
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
  const location = useLocation()
  const [scenarioA, setScenarioA] = useState(cruiseCostInitialState)
  const [scenarioB, setScenarioB] = useState(scenarioBInitialState)
  const [scenarioALabel, setScenarioALabel] = useState('Scenario A')
  const [scenarioBLabel, setScenarioBLabel] = useState('Scenario B')
  const [activePreset, setActivePreset] = useState('')
  const [comparisonName, setComparisonName] = useState('')
  const [savedComparisons, setSavedComparisons] = useState(() => loadCompareScenarios())
  const [shareFeedback, setShareFeedback] = useState('')

  const resultsA = useMemo(() => calculateCruiseCost(scenarioA), [scenarioA])
  const resultsB = useMemo(() => calculateCruiseCost(scenarioB), [scenarioB])
  const comparison = useMemo(() => compareCruiseCostScenarios(resultsA, resultsB), [resultsA, resultsB])

  useEffect(() => {
    const sharedState = getCompareShareState(location.search, cruiseCostInitialState)
    if (!sharedState) {
      return
    }

    setScenarioA(sharedState.scenarioA)
    setScenarioB(sharedState.scenarioB)
    setScenarioALabel(sharedState.scenarioALabel || 'Scenario A')
    setScenarioBLabel(sharedState.scenarioBLabel || 'Scenario B')
    setActivePreset('')
  }, [location.search])

  useEffect(() => {
    if (!shareFeedback) {
      return
    }

    const timeoutId = window.setTimeout(() => setShareFeedback(''), 2200)
    return () => window.clearTimeout(timeoutId)
  }, [shareFeedback])

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
    setScenarioALabel(`${preset.label.split(' vs ')[0] || 'Scenario A'}`)
    setScenarioBLabel(`${preset.label.split(' vs ')[1] || 'Scenario B'}`)
    setActivePreset(preset.label)
  }

  function handleSaveComparison() {
    const fallbackName = `Comparison ${savedComparisons.length + 1}`
    const trimmedName = comparisonName.trim()
    const name = trimmedName || fallbackName
    const existingIndex = savedComparisons.findIndex((comparison) => comparison.name === name)
    const nextItem = {
      id: existingIndex >= 0 ? savedComparisons[existingIndex].id : `${Date.now()}`,
      name,
      updatedAt: new Date().toISOString(),
      scenarioALabel,
      scenarioBLabel,
      scenarioA,
      scenarioB,
    }

    const nextComparisons =
      existingIndex >= 0
        ? savedComparisons.map((comparison, index) => (index === existingIndex ? nextItem : comparison))
        : [nextItem, ...savedComparisons]

    setSavedComparisons(nextComparisons)
    saveCompareScenarios(nextComparisons)
    setComparisonName(name)
  }

  function handleLoadComparison(savedComparison) {
    setScenarioA(savedComparison.scenarioA)
    setScenarioB(savedComparison.scenarioB)
    setScenarioALabel(savedComparison.scenarioALabel || 'Scenario A')
    setScenarioBLabel(savedComparison.scenarioBLabel || 'Scenario B')
    setComparisonName(savedComparison.name)
    setActivePreset('')
  }

  function handleDeleteComparison(id) {
    const shouldDelete = window.confirm('Delete this saved comparison from this browser?')
    if (!shouldDelete) {
      return
    }

    const nextComparisons = savedComparisons.filter((comparison) => comparison.id !== id)
    setSavedComparisons(nextComparisons)
    saveCompareScenarios(nextComparisons)
  }

  async function handleCopySummary() {
    try {
      const summary = buildCompareSummary(comparison, {
        scenarioA: scenarioALabel,
        scenarioB: scenarioBLabel,
      })
      await navigator.clipboard.writeText(summary)
      setShareFeedback('Summary copied')
    } catch {
      setShareFeedback('Could not copy summary')
    }
  }

  async function handleCopyShareLink() {
    try {
      const encodedState = encodeCompareState(
        { scenarioA, scenarioB, scenarioALabel, scenarioBLabel },
        cruiseCostInitialState,
      )
      const shareUrl = buildCompareShareUrl(encodedState)
      await navigator.clipboard.writeText(shareUrl)
      setShareFeedback('Share link copied')
    } catch {
      setShareFeedback('Could not copy link')
    }
  }

  const mainTakeaway =
    comparison.totalDifference === 0
      ? `${scenarioALabel} and ${scenarioBLabel} land at about the same total, so the decision comes down to where you want the money going.`
      : `${comparison.totalDifference > 0 ? scenarioBLabel : scenarioALabel} costs about ${formatCurrency(comparison.absoluteTotalDifference)} more overall.`

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

      <section className="card">
        <SectionHeader
          title="Save scenarios"
          description="Save a useful comparison in this browser or copy a summary or share link."
        />
        <div className="save-comparison-bar">
          <label className="field save-comparison-field">
            <span className="field-label">Comparison name</span>
            <input
              className="field-input"
              type="text"
              value={comparisonName}
              onChange={(event) => setComparisonName(event.target.value)}
              placeholder="Comparison 1"
            />
          </label>
          <button type="button" className="button button-primary" onClick={handleSaveComparison}>
            Save comparison
          </button>
          <button type="button" className="button button-ghost" onClick={handleCopySummary}>
            Copy summary
          </button>
          <button type="button" className="button button-ghost" onClick={handleCopyShareLink}>
            Copy share link
          </button>
        </div>
        {shareFeedback ? <p className="share-feedback">{shareFeedback}</p> : null}
      </section>

      <div className="two-column-layout compare-layout">
        <ScenarioSection
          title="Scenario A"
          helper="Use this side for your first version of the trip."
          scenarioLabel={scenarioALabel}
          onLabelChange={(event) => setScenarioALabel(event.target.value || 'Scenario A')}
          form={scenarioA}
          onChange={handleScenarioChange(setScenarioA)}
          results={resultsA}
        />
        <ScenarioSection
          title="Scenario B"
          helper="Use this side for the version you want to compare against it."
          scenarioLabel={scenarioBLabel}
          onLabelChange={(event) => setScenarioBLabel(event.target.value || 'Scenario B')}
          form={scenarioB}
          onChange={handleScenarioChange(setScenarioB)}
          results={resultsB}
        />
      </div>

      <section className="card reality-card">
        <div className="verdict-kicker">Difference summary</div>
        <div className="verdict-copy">
          <p>
            {comparison.totalDifference === 0
              ? `${scenarioALabel} and ${scenarioBLabel} are effectively tied on total cost.`
              : `${comparison.totalDifference > 0 ? scenarioBLabel : scenarioALabel} is about ${formatCurrency(comparison.absoluteTotalDifference)} more expensive overall.`}
          </p>
          <p>
            {comparison.driverNote
              .replaceAll('Scenario A', scenarioALabel)
              .replaceAll('Scenario B', scenarioBLabel)}
          </p>
        </div>
        <div className="verdict-highlight">
          <span>Main takeaway</span>
          <strong>{mainTakeaway}</strong>
        </div>
        <div className="stats-grid">
          <article className="stat-card stat-card-emphasized">
            <span className="stat-label">Trip total gap</span>
            <strong className="stat-value">{formatCurrency(comparison.absoluteTotalDifference)}</strong>
            <small className="stat-helper">
              {comparison.totalDifference === 0
                ? 'Both scenarios are tied on total cost.'
                : `${comparison.totalDifference > 0 ? scenarioBLabel : scenarioALabel} is the pricier version.`}
            </small>
          </article>
          <article className="stat-card">
            <span className="stat-label">Nightly gap</span>
            <strong className="stat-value">{formatCurrency(comparison.absoluteCostPerNightDifference)}</strong>
            <small className="stat-helper">How much the trip changes when you spread the real total across each night.</small>
          </article>
          <article className="stat-card">
            <span className="stat-label">Add-ons gap</span>
            <strong className="stat-value">{formatCurrency(comparison.absoluteAddOnsDifference)}</strong>
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
                  <span>{line.higherIn.replace('Scenario A', scenarioALabel).replace('Scenario B', scenarioBLabel)}</span>
                </div>
                <strong className="driver-value">+{formatCurrency(line.amount)}</strong>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="card">
        <SectionHeader
          title="Saved comparisons"
          description="Load an old comparison or delete the ones you no longer need."
        />
        {savedComparisons.length ? (
          <div className="saved-comparison-list">
            {savedComparisons.map((savedComparison) => (
              <article key={savedComparison.id} className="saved-comparison-item">
                <div className="saved-comparison-copy">
                  <strong>{savedComparison.name}</strong>
                  <span>Saved {new Date(savedComparison.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="saved-comparison-actions">
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => handleLoadComparison(savedComparison)}
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    className="button button-danger saved-delete-button"
                    onClick={() => handleDeleteComparison(savedComparison.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No saved comparisons yet. Save one when you find a version worth coming back to.</p>
        )}
      </section>
    </div>
  )
}
