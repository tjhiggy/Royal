import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../components/FormField'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import { cruiseCostInitialState } from '../data/cruiseCostConfig'
import {
  calculateCruiseCost,
  calculateDealEvaluator,
  calculateDrinkPackage,
  calculateTheKey,
  calculateWifiRecommendation,
  compareCruiseCostScenarios,
} from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'

const steps = [
  'Trip basics',
  'Deal check',
  'Real cost',
  'Upgrade checks',
  'Compare',
  'Summary',
]

const initialState = {
  ...cruiseCostInitialState,
  packagePricePerPersonPerDay: 80,
  gratuityPercentage: 18,
  alcoholicDrinksPerDay: 4,
  specialtyCoffeesPerDay: 1,
  bottledWatersPerDay: 2,
  sodasMocktailsPerDay: 1,
  alcoholicDrinkPrice: 14,
  specialtyCoffeePrice: 5,
  bottledWaterPrice: 3.5,
  sodaMocktailPrice: 3.5,
  wifiPricePerDevicePerDay: 20,
  peopleCount: cruiseCostInitialState.travelerCount,
  deviceCount: 2,
  usageType: 'moderate',
  willingToShare: true,
  theKeyPricePerDay: 38,
  wifiNeeded: true,
  numberOfDevices: '1',
  embarkationLunch: true,
  priorityBoardingImportance: 'medium',
  reservedSeatingImportance: 'medium',
  skipLineImportance: 'low',
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

function MetricCard({ label, value, helper }) {
  return (
    <article className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {helper ? <small className="stat-helper">{helper}</small> : null}
    </article>
  )
}

export default function GuidedModePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState(initialState)

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'travelerCount' ? { peopleCount: value } : {}),
    }))
  }

  const results = useMemo(() => {
    const drink = calculateDrinkPackage({
      cruiseNights: form.cruiseNights,
      packagePricePerPersonPerDay: form.packagePricePerPersonPerDay,
      gratuityPercentage: form.gratuityPercentage,
      alcoholicDrinksPerDay: form.alcoholicDrinksPerDay,
      specialtyCoffeesPerDay: form.specialtyCoffeesPerDay,
      bottledWatersPerDay: form.bottledWatersPerDay,
      sodasMocktailsPerDay: form.sodasMocktailsPerDay,
      alcoholicDrinkPrice: form.alcoholicDrinkPrice,
      specialtyCoffeePrice: form.specialtyCoffeePrice,
      bottledWaterPrice: form.bottledWaterPrice,
      sodaMocktailPrice: form.sodaMocktailPrice,
    })

    const wifi = calculateWifiRecommendation({
      cruiseNights: form.cruiseNights,
      wifiPricePerDevicePerDay: form.wifiPricePerDevicePerDay,
      peopleCount: form.peopleCount,
      deviceCount: form.deviceCount,
      usageType: form.usageType,
      willingToShare: form.willingToShare,
    })

    const key = calculateTheKey({
      cruiseNights: form.cruiseNights,
      theKeyPricePerDay: form.theKeyPricePerDay,
      wifiNeeded: form.wifiNeeded,
      numberOfDevices: form.numberOfDevices,
      embarkationLunch: form.embarkationLunch,
      priorityBoardingImportance: form.priorityBoardingImportance,
      reservedSeatingImportance: form.reservedSeatingImportance,
      skipLineImportance: form.skipLineImportance,
    })

    const plannedWifiCost = Number(form.deviceCount) >= 2 ? wifi.twoDeviceCost : wifi.oneDeviceCost
    const currentCostForm = {
      cruiseFare: form.cruiseFare,
      taxesAndFees: form.taxesAndFees,
      prepaidGratuities: form.prepaidGratuities,
      drinkPackage: drink.packageTotal,
      wifi: plannedWifiCost,
      dining: form.dining,
      excursions: form.excursions,
      theKey: key.keyTotal,
      hotel: form.hotel,
      flights: form.flights,
      parking: form.parking,
      travelExtras: form.travelExtras,
      miscellaneous: form.miscellaneous,
      travelerCount: form.travelerCount,
      cruiseNights: form.cruiseNights,
    }

    const cost = calculateCruiseCost(currentCostForm)
    const deal = calculateDealEvaluator({
      cruiseNights: form.cruiseNights,
      baseFare: form.cruiseFare,
      taxesAndFees: form.taxesAndFees,
      drinkPackage: currentCostForm.drinkPackage,
      wifi: currentCostForm.wifi,
      excursions: form.excursions,
      specialtyDining: form.dining,
      theKey: currentCostForm.theKey,
      flights: form.flights,
      hotel: form.hotel,
      parkingTransport: form.parking,
    })

    const leanCostForm = {
      ...currentCostForm,
      drinkPackage: drink.recommendation === 'Skip it' ? 0 : currentCostForm.drinkPackage,
      wifi:
        wifi.recommendedPlan === 'no-wifi'
          ? 0
          : wifi.recommendedPlan === 'one-device'
            ? wifi.oneDeviceCost
            : wifi.twoDeviceCost,
      theKey: key.recommendation === 'Skip it' ? 0 : currentCostForm.theKey,
    }
    const leanCost = calculateCruiseCost(leanCostForm)
    const comparison = compareCruiseCostScenarios(cost, leanCost)

    return { drink, wifi, key, cost, deal, leanCost, comparison }
  }, [form])

  const suggestedCuts = [
    ...results.cost.quickWins.map((win) => `${win.title}. ${win.detail}`),
    results.drink.recommendation === 'Skip it'
      ? `Skip the drink package and avoid about ${formatCurrency(results.drink.packageTotal)}.`
      : null,
    results.wifi.recommendedPlan === 'no-wifi'
      ? `Skip WiFi and avoid about ${formatCurrency(results.wifi.oneDeviceCost)}.`
      : results.wifi.recommendedPlan === 'one-device'
        ? `Use one WiFi device instead of two and save about ${formatCurrency(results.wifi.twoDeviceCost - results.wifi.oneDeviceCost)}.`
        : null,
    results.key.recommendation === 'Skip it'
      ? `Skip The Key and avoid about ${formatCurrency(results.key.keyTotal)}.`
      : null,
  ].filter(Boolean).slice(0, 4)

  function goNext() {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Guided mode"
        title="Plan the cruise in the right order"
        description="Walk through the decisions that actually change the trip cost. No accounts, no backend, no spreadsheet cosplay."
      />

      <section className="card guided-shell">
        <div className="guided-step-topline">
          <span className="verdict-kicker">Step {currentStep + 1} of {steps.length}</span>
          <strong>{steps[currentStep]}</strong>
        </div>
        <div className="guided-step-track" aria-label="Guided mode progress">
          {steps.map((step, index) => (
            <button
              key={step}
              type="button"
              className={`guided-step-dot ${index === currentStep ? 'guided-step-dot-active' : ''} ${index < currentStep ? 'guided-step-dot-complete' : ''}`}
              onClick={() => setCurrentStep(index)}
              aria-label={`Go to step ${index + 1}: ${step}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentStep === 0 ? (
          <div className="guided-step-content">
            <SectionHeader
              title="Trip basics"
              description="Start with the numbers every other decision depends on."
            />
            <div className="form-grid">
              <FormField label="Cruise nights" name="cruiseNights" value={form.cruiseNights} onChange={handleChange} min="1" inputMode="numeric" helper="Used for per-night totals and package pricing." />
              <FormField label="Base fare" name="cruiseFare" value={form.cruiseFare} onChange={handleChange} min="0" inputMode="decimal" helper="Cabin fare before the extras show up." />
              <FormField label="Travelers" name="travelerCount" value={form.travelerCount} onChange={handleChange} min="1" inputMode="numeric" helper="Used for per-person math." />
              <FormField label="Taxes and fees" name="taxesAndFees" value={form.taxesAndFees} onChange={handleChange} min="0" inputMode="decimal" helper="Required charges, not optional fun money." />
            </div>
          </div>
        ) : null}

        {currentStep === 1 ? (
          <div className="guided-step-content">
            <SectionHeader
              title="Deal Evaluator"
              description="First question: is this actually a deal, or just a low fare wearing a fake mustache?"
            />
            <div className="verdict-highlight">
              <span>Deal verdict</span>
              <strong>{results.deal.verdict}</strong>
            </div>
            <div className="explanation-list">
              {results.deal.verdictLines.map((line) => (
                <div key={line} className="explanation-item">
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="guided-step-content">
            <SectionHeader
              title="Cruise Cost Calculator"
              description="Add the costs that make the fare stop looking so innocent."
            />
            <div className="form-grid">
              {[
                ['prepaidGratuities', 'Prepaid gratuities'],
                ['dining', 'Specialty dining'],
                ['excursions', 'Excursions'],
                ['hotel', 'Hotel'],
                ['flights', 'Flights'],
                ['parking', 'Parking'],
                ['travelExtras', 'Travel extras'],
                ['miscellaneous', 'Miscellaneous'],
              ].map(([name, label]) => (
                <FormField key={name} label={label} name={name} value={form[name]} onChange={handleChange} min="0" inputMode="decimal" />
              ))}
            </div>
            <div className="stats-grid guided-stats">
              <MetricCard label="Total trip cost" value={formatCurrency(results.cost.grandTotal)} helper="Current guided plan" />
              <MetricCard label="Per person" value={formatCurrency(results.cost.costPerPerson)} />
              <MetricCard label="Per night" value={formatCurrency(results.cost.costPerNight)} />
              <MetricCard label="Add-ons" value={formatCurrency(results.cost.addOnsSubtotal)} />
            </div>
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="guided-step-content">
            <SectionHeader
              title="Upgrade checks"
              description="Now test the add-ons. This is where budgets go to get mugged."
            />
            <div className="guided-upgrade-grid">
              <section className="card guided-mini-card">
                <h3>Drink package</h3>
                <div className="form-grid compact-form-grid">
                  <FormField label="Package price per day" name="packagePricePerPersonPerDay" value={form.packagePricePerPersonPerDay} onChange={handleChange} min="0" inputMode="decimal" />
                  <FormField label="Alcoholic drinks per day" name="alcoholicDrinksPerDay" value={form.alcoholicDrinksPerDay} onChange={handleChange} min="0" inputMode="decimal" />
                </div>
                <p><strong>{results.drink.recommendation}</strong>: {results.drink.netSavings >= 0 ? `Save about ${formatCurrency(results.drink.netSavings)}.` : `Overpay by about ${formatCurrency(Math.abs(results.drink.netSavings))}.`}</p>
              </section>

              <section className="card guided-mini-card">
                <h3>WiFi</h3>
                <div className="form-grid compact-form-grid">
                  <FormField label="WiFi price per device/day" name="wifiPricePerDevicePerDay" value={form.wifiPricePerDevicePerDay} onChange={handleChange} min="0" inputMode="decimal" />
                  <SelectField
                    label="Usage type"
                    name="usageType"
                    value={form.usageType}
                    onChange={handleChange}
                    options={[
                      { value: 'light', label: 'Light' },
                      { value: 'moderate', label: 'Moderate' },
                      { value: 'heavy', label: 'Heavy' },
                    ]}
                  />
                </div>
                <label className="toggle-field">
                  <input type="checkbox" name="willingToShare" checked={form.willingToShare} onChange={handleChange} />
                  <span className="toggle-copy">
                    <strong>Willing to share devices</strong>
                    <small>Sharing can make one plan enough.</small>
                  </span>
                </label>
                <p><strong>{results.wifi.recommendation}</strong>: {results.wifi.wastedSpendMessage}</p>
              </section>

              <section className="card guided-mini-card">
                <h3>The Key</h3>
                <div className="form-grid compact-form-grid">
                  <FormField label="The Key price/day" name="theKeyPricePerDay" value={form.theKeyPricePerDay} onChange={handleChange} min="0" inputMode="decimal" />
                  <SelectField
                    label="Priority boarding"
                    name="priorityBoardingImportance"
                    value={form.priorityBoardingImportance}
                    onChange={handleChange}
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                    ]}
                  />
                </div>
                <p><strong>{results.key.recommendation}</strong>: {results.key.netValue >= 0 ? `Value beats cost by ${formatCurrency(results.key.netValue)}.` : `Overpay by about ${formatCurrency(Math.abs(results.key.netValue))}.`}</p>
              </section>
            </div>
          </div>
        ) : null}

        {currentStep === 4 ? (
          <div className="guided-step-content">
            <SectionHeader
              title="Compare scenarios"
              description="Current plan versus the leaner version based on the upgrade verdicts."
            />
            <div className="stats-grid guided-stats">
              <MetricCard label="Current plan" value={formatCurrency(results.cost.grandTotal)} />
              <MetricCard label="Leaner plan" value={formatCurrency(results.leanCost.grandTotal)} />
              <MetricCard label="Potential gap" value={formatCurrency(results.comparison.absoluteTotalDifference)} helper="Difference between the two versions" />
            </div>
            <p className="results-note">{results.comparison.driverNote}</p>
          </div>
        ) : null}

        {currentStep === 5 ? (
          <div className="guided-step-content">
            <SectionHeader
              title="Summary"
              description="The final answer. Not perfect, but a lot better than booking blind."
            />
            <div className="stats-grid guided-stats">
              <MetricCard label="Total trip cost" value={formatCurrency(results.cost.grandTotal)} />
              <MetricCard label="Verdict" value={results.deal.verdict} />
              <MetricCard label="Add-ons" value={formatCurrency(results.cost.addOnsSubtotal)} />
              <MetricCard label="Potential savings" value={formatCurrency(results.comparison.absoluteTotalDifference)} />
            </div>

            <div className="two-column-layout">
              <section className="card guided-mini-card">
                <SectionHeader title="Biggest cost drivers" />
                <div className="driver-list">
                  {results.cost.biggestAddOnDrivers.map((driver, index) => (
                    <article key={driver.key} className="driver-item">
                      <span className="driver-rank">{index + 1}</span>
                      <div className="driver-copy">
                        <strong>{driver.label}</strong>
                        <span>{formatCurrency(driver.value)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="card guided-mini-card">
                <SectionHeader title="Suggested cuts" />
                <div className="explanation-list">
                  {suggestedCuts.map((cut) => (
                    <div key={cut} className="explanation-item">
                      <span>{cut}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : null}

        <div className="guided-actions">
          <button type="button" className="button button-secondary" onClick={goBack} disabled={currentStep === 0}>
            Back
          </button>
          {currentStep < steps.length - 1 ? (
            <button type="button" className="button button-primary" onClick={goNext}>
              Next
            </button>
          ) : (
            <Link className="button button-primary" to="/compare">
              Open Compare
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
