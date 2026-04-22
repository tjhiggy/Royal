import { useEffect, useMemo, useState } from 'react'
import CoachingMessage from '../components/CoachingMessage'
import DecisionNextStep from '../components/DecisionNextStep'
import FormField from '../components/FormField'
import PageHero from '../components/PageHero'
import ResultPanel from '../components/ResultPanel'
import SectionHeader from '../components/SectionHeader'
import { calculateDrinkPackage } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'
import { saveSnapshotToolState } from '../utils/storage'

const initialState = {
  cruiseNights: 7,
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
}

const presets = [
  {
    label: 'Couple (moderate)',
    description: 'A balanced pace for adults who are enjoying the ship without becoming a roaming bar tab.',
    values: {
      cruiseNights: 7,
      packagePricePerPersonPerDay: 80,
      alcoholicDrinksPerDay: 4,
      specialtyCoffeesPerDay: 1,
      bottledWatersPerDay: 2,
      sodasMocktailsPerDay: 1,
    },
  },
  {
    label: 'Family (2 adults + 2 kids)',
    description: 'Lower adult drink pace with more waters, sodas, and kid-adjacent chaos.',
    values: {
      cruiseNights: 7,
      packagePricePerPersonPerDay: 80,
      alcoholicDrinksPerDay: 2,
      specialtyCoffeesPerDay: 1,
      bottledWatersPerDay: 3,
      sodasMocktailsPerDay: 3,
    },
  },
  {
    label: 'Budget traveler',
    description: 'A couple paid drinks and enough restraint to annoy the upsell machine.',
    values: {
      cruiseNights: 5,
      packagePricePerPersonPerDay: 80,
      alcoholicDrinksPerDay: 1,
      specialtyCoffeesPerDay: 0,
      bottledWatersPerDay: 1,
      sodasMocktailsPerDay: 0,
    },
  },
  {
    label: 'Vacation mode',
    description: 'Cocktails are flowing, coffees are involved, and the bar staff knows your face.',
    values: {
      cruiseNights: 7,
      packagePricePerPersonPerDay: 90,
      alcoholicDrinksPerDay: 6,
      specialtyCoffeesPerDay: 2,
      bottledWatersPerDay: 2,
      sodasMocktailsPerDay: 2,
    },
  },
]

const tripFields = [
  {
    label: 'Cruise nights',
    name: 'cruiseNights',
    min: '1',
    helper: 'Use the sailing length for one guest buying the package.',
  },
  {
    label: 'Package price per day',
    name: 'packagePricePerPersonPerDay',
    min: '0',
    helper: 'Advertised rate before gratuity.',
  },
  {
    label: 'Gratuity percentage',
    name: 'gratuityPercentage',
    min: '0',
    helper: '18% is the usual default.',
  },
  {
    label: 'Alcoholic drinks per day',
    name: 'alcoholicDrinksPerDay',
    min: '0',
    helper: 'Cocktails, beer, wine, and the usual suspects.',
  },
  {
    label: 'Specialty coffees per day',
    name: 'specialtyCoffeesPerDay',
    min: '0',
    helper: 'Lattes and cafe drinks outside the free stuff.',
  },
  {
    label: 'Bottled waters per day',
    name: 'bottledWatersPerDay',
    min: '0',
    helper: 'For the people who keep grabbing one more.',
  },
  {
    label: 'Sodas or mocktails per day',
    name: 'sodasMocktailsPerDay',
    min: '0',
    helper: 'Roll the non-alcoholic bar tab into one field.',
  },
]

const priceFields = [
  {
    label: 'Alcoholic drink price',
    name: 'alcoholicDrinkPrice',
    min: '0',
    helper: 'Default is about $14 each.',
  },
  {
    label: 'Specialty coffee price',
    name: 'specialtyCoffeePrice',
    min: '0',
    helper: 'Default is about $5 each.',
  },
  {
    label: 'Bottled water price',
    name: 'bottledWaterPrice',
    min: '0',
    helper: 'Default is about $4 each.',
  },
  {
    label: 'Soda or mocktail price',
    name: 'sodaMocktailPrice',
    min: '0',
    helper: 'Default is about $4 each.',
  },
]

export default function DrinkPackagePage() {
  const [form, setForm] = useState(initialState)
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(false)
  const [activePreset, setActivePreset] = useState('')

  const results = useMemo(() => calculateDrinkPackage(form), [form])

  useEffect(() => {
    saveSnapshotToolState('drink', { form })
  }, [form])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setActivePreset('')
  }

  function applyPreset(preset) {
    setForm((current) => ({ ...current, ...preset.values }))
    setActivePreset(preset.label)
  }

  const outcomeMessage =
    results.netSavings > 0
      ? `You would save about ${formatCurrency(results.netSavings)} with the package.`
      : results.netSavings < 0
        ? `You would overpay by about ${formatCurrency(Math.abs(results.netSavings))} with the package.`
        : 'You are basically at break-even either way.'

  const verdictExplanation =
    results.recommendation === 'Worth it'
      ? [
          `${outcomeMessage}`,
          'You are drinking enough for the package to make sense.',
        ]
      : results.recommendation === 'Borderline'
        ? [
            `${outcomeMessage}`,
            'This is close enough that convenience could decide it.',
          ]
        : [
            `${outcomeMessage}`,
            'You are not drinking enough to make the package the smart buy.',
          ]

  const roundedBreakEvenDrinks = Math.max(Math.round(results.breakEvenDrinks), 0)
  const roundedBreakEvenAlcoholicDrinks = Math.max(Math.round(results.breakEvenAlcoholicDrinks), 0)
  const roundedCurrentAlcoholicDrinks = Math.max(Math.round(Number(form.alcoholicDrinksPerDay) || 0), 0)
  const worthItInsight =
    results.extraAlcoholicDrinksNeeded > 0.05
      ? `To make this worth it, you would need about ${roundedBreakEvenAlcoholicDrinks} alcoholic drinks per day instead of ${roundedCurrentAlcoholicDrinks}.`
      : `You are already near the break-even pace, which is why this lands in ${results.recommendation.toLowerCase()}.`
  const coachingMessage =
    roundedCurrentAlcoholicDrinks < roundedBreakEvenAlcoholicDrinks
      ? 'You are not drinking enough to justify this package.'
      : results.recommendation === 'Worth it'
        ? 'Your current drink pace is high enough that the package can actually work.'
        : 'You are close enough that convenience, not savings, is doing the selling.'

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Tool"
        title="Drink Package Calculator"
        description="Plug in your cruise length, daily habits, and drink prices to see whether the package is smart or just expensive cruise theater."
      />

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader
            title="Trip Inputs"
            description="Enter your sailing length and what you actually drink per day, not your heroic vacation fantasy."
          />
          <div className="preset-block">
            <div className="preset-copy">
              <strong>Quick scenarios</strong>
              <span>Start with a realistic scenario, then tweak from there.</span>
            </div>
            <div className="preset-grid">
              {presets.map((preset) => (
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
          <div className="form-grid">
            {tripFields.map((field) => (
              <FormField
                key={field.name}
                {...field}
                value={form[field.name]}
                onChange={handleChange}
                inputMode="decimal"
              />
            ))}
          </div>
        </section>

        <section className="card advanced-card">
          <div className="advanced-header">
            <div className="section-header">
              <h2>Advanced pricing adjustments</h2>
              <p>Optional. Leave this alone unless your onboard prices are different.</p>
            </div>
            <button
              type="button"
              className="button button-ghost"
              aria-expanded={showAdvancedPricing}
              onClick={() => setShowAdvancedPricing((current) => !current)}
            >
              {showAdvancedPricing ? 'Hide prices' : 'Edit prices'}
            </button>
          </div>
          {showAdvancedPricing ? (
            <div className="form-grid compact-form-grid">
              {priceFields.map((field) => (
                <FormField
                  key={field.name}
                  {...field}
                  value={form[field.name]}
                  onChange={handleChange}
                  inputMode="decimal"
                />
              ))}
            </div>
          ) : (
            <p className="advanced-collapsed-note">
              Defaults are active. Open only if your prices differ.
            </p>
          )}
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
        <div className="break-even-summary" aria-label="Break-even summary">
          <div className="break-even-item">
            <span>Break-even drink value</span>
            <strong>{formatCurrency(results.breakEvenDailySpend)}/day</strong>
          </div>
          <div className="break-even-item">
            <span>Alcohol-only equivalent</span>
            <strong>{roundedBreakEvenDrinks} drinks/day</strong>
          </div>
        </div>
      </section>

      <CoachingMessage message={coachingMessage} />

      <ResultPanel
        title="Supporting numbers"
        intro="This is the math behind the verdict, with gratuities included on both sides."
        stats={[
          { label: 'Package total', value: results.packageTotal, emphasized: true, helper: 'Estimated total for the full sailing' },
          { label: 'Pay-as-you-go total', value: results.payAsYouGoTotal, helper: 'Estimated onboard spend at your current pace' },
          {
            label: results.netSavings >= 0 ? 'Savings with package' : 'Overpay with package',
            value: Math.abs(results.netSavings),
            helper: results.netSavings >= 0 ? 'Positive for the package, finally' : 'How much extra the package would cost you',
          },
        ]}
      />

      <section className="card">
        <SectionHeader
          title="Daily Spend Mix"
          description="This is where your daily drink spend is actually going before gratuity joins the party."
        />
        <div className="explanation-list">
          <div className="explanation-item">
            <span>Alcohol</span>
            <strong>{formatCurrency(results.alcoholicSpend)}</strong>
          </div>
          <div className="explanation-item">
            <span>Specialty coffee</span>
            <strong>{formatCurrency(results.coffeeSpend)}</strong>
          </div>
          <div className="explanation-item">
            <span>Water</span>
            <strong>{formatCurrency(results.waterSpend)}</strong>
          </div>
          <div className="explanation-item">
            <span>Soda and mocktails</span>
            <strong>{formatCurrency(results.sodaSpend)}</strong>
          </div>
          <div className="explanation-item">
            <span>Daily package cost with gratuity</span>
            <strong>{formatCurrency(results.packageDailyTotal)}</strong>
          </div>
          <div className="explanation-item">
            <span>Estimated daily a la carte cost</span>
            <strong>{formatCurrency(results.payAsYouGoDailyTotal)}</strong>
          </div>
        </div>
      </section>

      <DecisionNextStep
        title="Next: compare the trip versions"
        description="Once the drink package verdict is clear, compare the trip with and without it. Feelings are cute. Totals are better."
        links={[{ to: '/compare', label: 'Compare scenarios' }]}
      />
    </div>
  )
}
