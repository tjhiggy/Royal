import { useEffect, useMemo, useRef, useState } from 'react'
import AssumptionsPanel from '../components/AssumptionsPanel'
import FormField from '../components/FormField'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import ShareActions from '../components/ShareActions'
import TextareaField from '../components/TextareaField'
import { calculateCruiseCost } from '../utils/calculators'
import { formatCurrency } from '../utils/formatters'
import { getCurrentShareUrl } from '../utils/share'
import {
  loadShouldBookState,
  saveRecentTrip,
  saveShouldBookState,
  saveSnapshotToolState,
} from '../utils/storage'

const initialState = {
  shipName: '',
  cruiseNights: 7,
  sailDate: '',
  cabinType: 'Balcony',
  cruiseFare: 3200,
  taxesAndFees: 520,
  travelMode: 'flights',
  flights: 800,
  driving: 0,
  hotel: 260,
  parking: 120,
  transfers: 90,
  travelProtection: 0,
  prepaidGratuities: 260,
  drinkPackage: 950,
  diningPackage: 250,
  wifi: 180,
  theKey: 0,
  excursions: 500,
  onboardSpend: 150,
  alternativeLabel: '',
  alternativeTotal: '',
  notes: '',
}

const cabinOptions = ['Interior', 'Oceanview', 'Balcony', 'Suite']
const travelModes = [
  { value: 'flights', label: 'Flights' },
  { value: 'driving', label: 'Driving' },
]

function numberValue(value) {
  return Math.max(Number(value) || 0, 0)
}

function getDaysUntilSail(sailDate) {
  if (!sailDate) {
    return null
  }

  const today = new Date()
  const sail = new Date(`${sailDate}T12:00:00`)

  if (Number.isNaN(sail.getTime())) {
    return null
  }

  today.setHours(12, 0, 0, 0)
  return Math.ceil((sail - today) / 86400000)
}

function buildCostForm(form) {
  return {
    cruiseFare: form.cruiseFare,
    taxesAndFees: form.taxesAndFees,
    prepaidGratuities: form.prepaidGratuities,
    drinkPackage: form.drinkPackage,
    wifi: form.wifi,
    dining: form.diningPackage,
    excursions: form.excursions,
    theKey: form.theKey,
    hotel: form.hotel,
    flights: form.travelMode === 'flights' ? form.flights : 0,
    parking: numberValue(form.parking) + numberValue(form.transfers),
    travelExtras: numberValue(form.travelProtection) + (form.travelMode === 'driving' ? numberValue(form.driving) : 0),
    miscellaneous: form.onboardSpend,
    travelerCount: 1,
    cruiseNights: form.cruiseNights,
  }
}

function evaluateBookingDecision(form) {
  const results = calculateCruiseCost(buildCostForm(form))
  const cruiseNights = Math.max(numberValue(form.cruiseNights), 1)
  const realTotal = results.grandTotal
  const travelTotal =
    (form.travelMode === 'flights' ? numberValue(form.flights) : numberValue(form.driving)) +
    numberValue(form.hotel) +
    numberValue(form.parking) +
    numberValue(form.transfers) +
    numberValue(form.travelProtection)
  const addOnTotal =
    numberValue(form.prepaidGratuities) +
    numberValue(form.drinkPackage) +
    numberValue(form.diningPackage) +
    numberValue(form.wifi) +
    numberValue(form.theKey) +
    numberValue(form.excursions) +
    numberValue(form.onboardSpend)
  const addOnPressure = realTotal ? (addOnTotal / realTotal) * 100 : 0
  const travelPressure = realTotal ? (travelTotal / realTotal) * 100 : 0
  const alternativeTotal = numberValue(form.alternativeTotal)
  const alternativeSavings = alternativeTotal ? realTotal - alternativeTotal : 0
  const daysUntilSail = getDaysUntilSail(form.sailDate)
  const costPerNight = realTotal / cruiseNights
  const biggestDriver = results.biggestCostDrivers[0] ?? results.dominantDriver

  let riskScore = 0
  if (!numberValue(form.cruiseFare)) riskScore += 30
  if (costPerNight >= 900) riskScore += 28
  else if (costPerNight >= 650) riskScore += 18
  else if (costPerNight >= 450) riskScore += 8
  if (addOnPressure >= 48) riskScore += 18
  else if (addOnPressure >= 35) riskScore += 9
  if (travelPressure >= 30) riskScore += 12
  if (alternativeSavings >= Math.max(realTotal * 0.12, 500)) riskScore += 24
  else if (alternativeSavings >= Math.max(realTotal * 0.06, 250)) riskScore += 10
  if (daysUntilSail !== null && daysUntilSail <= 90) riskScore += 6

  let verdict = 'BOOK NOW'
  if (!numberValue(form.cruiseFare) || realTotal <= 0) {
    verdict = 'WAIT'
  } else if (alternativeSavings >= Math.max(realTotal * 0.14, 700) || (costPerNight >= 900 && addOnPressure >= 42)) {
    verdict = 'WALK AWAY'
  } else if (riskScore >= 35 || costPerNight >= 700 || addOnPressure >= 45) {
    verdict = 'WAIT'
  }

  const confidence = Math.max(62, Math.min(94, Math.round(92 - riskScore + (verdict === 'BOOK NOW' ? 8 : 0))))
  const financialRisk =
    alternativeSavings > 0 && alternativeTotal
      ? `${form.alternativeLabel || 'The alternative'} is cheaper by about ${formatCurrency(alternativeSavings)}.`
      : addOnPressure >= 40
        ? `Add-ons are ${addOnPressure.toFixed(0)}% of the real trip cost. That is not a side dish, that is the entree.`
        : travelPressure >= 28
          ? `Travel is ${travelPressure.toFixed(0)}% of the trip. The ship may be fine, but getting there is expensive.`
          : biggestDriver
            ? `${biggestDriver.label} is the biggest cost driver at ${formatCurrency(biggestDriver.value)}.`
            : 'No single cost driver is screaming yet.'

  const bestNextAction =
    verdict === 'BOOK NOW'
      ? 'Book only if the fare is refundable enough for your comfort, then stop adding packages like the cart owes you money.'
      : verdict === 'WAIT'
        ? 'Hold the booking and re-price the fare, travel, and top add-on before final payment pressure shows up.'
        : 'Pick the better alternative or strip this cruise down hard before paying.'

  const why =
    verdict === 'BOOK NOW'
      ? `The real trip cost is ${formatCurrency(realTotal)}, and the risk profile is acceptable for the inputs you gave.`
      : verdict === 'WAIT'
        ? `The trip is not a clean yes yet because the real cost is ${formatCurrency(realTotal)} and the pressure points need another pass.`
        : `The trip is fighting the budget: ${formatCurrency(realTotal)} total, ${formatCurrency(costPerNight)} per night, and a better option may be sitting right there.`

  const personalCall =
    verdict === 'BOOK NOW'
      ? 'I would book it, then freeze the extras until each one proves it belongs.'
      : verdict === 'WAIT'
        ? 'I would wait, re-price the biggest driver, and refuse to let the headline fare bully the decision.'
        : 'I would walk away unless the fare drops or the itinerary is worth knowingly overpaying for.'

  const waitUpside =
    alternativeSavings > 0
      ? 'A cheaper alternative already exists, so waiting could confirm whether this cruise deserves a comeback.'
      : 'The fare, travel costs, or package pricing may improve before final payment if inventory or promos shift.'
  const waitDownside =
    daysUntilSail !== null && daysUntilSail <= 90
      ? 'You are inside the final-payment window, so waiting may reduce cabin choice and price flexibility.'
      : 'Cabin availability can tighten, and the fare can move against you if demand picks up.'
  const finalPaymentLogic =
    daysUntilSail === null
      ? 'Add the sail date to judge final-payment pressure. Right now that timing risk is unknown.'
      : daysUntilSail > 90
        ? `${daysUntilSail} days out: there is still room to compare before final payment pressure gets loud.`
        : `${Math.max(daysUntilSail, 0)} days out: treat this like a near-final decision, not casual window shopping.`

  return {
    ...results,
    verdict,
    confidence,
    realTotal,
    travelTotal,
    addOnTotal,
    addOnPressure,
    travelPressure,
    alternativeTotal,
    alternativeSavings,
    daysUntilSail,
    why,
    financialRisk,
    bestNextAction,
    personalCall,
    waitUpside,
    waitDownside,
    finalPaymentLogic,
  }
}

function buildSummary(form, decision, url = getCurrentShareUrl()) {
  const alternativeLine = decision.alternativeTotal
    ? `Alternative: ${form.alternativeLabel || 'Option'} at ${formatCurrency(decision.alternativeTotal)} (${decision.alternativeSavings > 0 ? `${formatCurrency(decision.alternativeSavings)} cheaper` : 'not cheaper'})`
    : 'Alternative: none entered'

  return [
    'Should I Book This Cruise?',
    `Verdict: ${decision.verdict} (${decision.confidence}% confidence)`,
    `Ship / cabin: ${form.shipName || 'Ship not entered'} / ${form.cabinType}`,
    `Real trip cost: ${formatCurrency(decision.realTotal)} (${formatCurrency(decision.costPerNight)}/night)`,
    `Biggest financial risk: ${decision.financialRisk}`,
    `Best next action: ${decision.bestNextAction}`,
    alternativeLine,
    '',
    url,
  ].join('\n')
}

function buildShortSummary(form, decision, url = getCurrentShareUrl()) {
  return [
    `Cruise booking call: ${decision.verdict} (${decision.confidence}% confidence).`,
    `Real cost: ${formatCurrency(decision.realTotal)} / ${formatCurrency(decision.costPerNight)} per night.`,
    `Risk: ${decision.financialRisk}`,
    `Move: ${decision.bestNextAction}`,
    url,
  ].join('\n')
}

export default function ShouldIBookPage() {
  const sessionId = useRef(`should-book-${Date.now()}`)
  const [form, setForm] = useState(() => loadShouldBookState(initialState))
  const decision = useMemo(() => evaluateBookingDecision(form), [form])
  const verdictClass =
    decision.verdict === 'BOOK NOW'
      ? 'should-book-now'
      : decision.verdict === 'WAIT'
        ? 'should-book-wait'
        : 'should-book-walk'

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  useEffect(() => {
    saveShouldBookState(form)
    saveSnapshotToolState('shouldBook', { form, decision })
    saveRecentTrip({
      id: sessionId.current,
      tool: 'should-book',
      toolLabel: 'Should I Book?',
      label: `${decision.verdict} | ${formatCurrency(decision.realTotal)}`,
      path: '/should-i-book',
      data: { form, decision },
    })
  }, [decision, form])

  const statItems = [
    { label: 'Real total', value: formatCurrency(decision.realTotal), helper: 'Fare plus travel, required costs, add-ons, and onboard spend' },
    { label: 'Cost per night', value: formatCurrency(decision.costPerNight), helper: 'The cleanest trip-to-trip comparison' },
    { label: 'Add-on pressure', value: `${decision.addOnPressure.toFixed(0)}%`, helper: 'How much of the total comes from extras' },
    { label: 'Travel pressure', value: `${decision.travelPressure.toFixed(0)}%`, helper: 'Flights or driving, hotel, parking, transfers, protection' },
  ]

  return (
    <div className="container page-stack should-book-page">
      <PageHero
        eyebrow="Flagship decision"
        title="Should I Book This Cruise?"
        description="Enter the real cost, compare the realistic alternative, and get a blunt Book Now, Wait, or Walk Away call. No horoscope math."
      />

      <section className={`card should-book-verdict-card ${verdictClass}`}>
        <div className="should-book-verdict-copy">
          <span className="verdict-kicker">Primary verdict</span>
          <h2>{decision.verdict}</h2>
          <p>{decision.why}</p>
        </div>
        <div className="should-book-confidence">
          <span>Confidence</span>
          <strong>{decision.confidence}%</strong>
        </div>
        <div className="should-book-risk-grid">
          <div className="verdict-highlight">
            <span>Biggest financial risk</span>
            <strong>{decision.financialRisk}</strong>
          </div>
          <div className="verdict-highlight">
            <span>Best next action</span>
            <strong>{decision.bestNextAction}</strong>
          </div>
        </div>
        <ShareActions
          summary={() => buildSummary(form, decision)}
          shortSummary={() => buildShortSummary(form, decision)}
          compact
          summaryLabel="Copy Summary"
          shortSummaryLabel="Copy Share Text"
        />
      </section>

      <section className="card">
        <SectionHeader
          title="Cruise basics"
          description="The decision needs the actual trip shape. Not the sales-page fairy tale, the real one."
        />
        <div className="form-grid">
          <label className="field">
            <span className="field-label">Ship name</span>
            <input className="field-input" name="shipName" value={form.shipName} onChange={handleChange} placeholder="Wonder of the Seas" />
            <small className="field-helper">Used only as your label. No ship-specific facts are invented.</small>
          </label>
          <FormField label="Sailing length" name="cruiseNights" value={form.cruiseNights} onChange={handleChange} min="1" helper="Number of cruise nights." inputMode="numeric" />
          <label className="field">
            <span className="field-label">Sail date</span>
            <input className="field-input" type="date" name="sailDate" value={form.sailDate} onChange={handleChange} />
            <small className="field-helper">Used for final-payment timing pressure.</small>
          </label>
          <label className="field">
            <span className="field-label">Cabin type</span>
            <select className="field-input" name="cabinType" value={form.cabinType} onChange={handleChange}>
              {cabinOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <small className="field-helper">Your cabin category, not a pricing assumption.</small>
          </label>
          <FormField label="Total cruise fare" name="cruiseFare" value={form.cruiseFare} onChange={handleChange} min="0" helper="Cabin fare before the extra budget parade." inputMode="decimal" />
          <FormField label="Taxes and fees" name="taxesAndFees" value={form.taxesAndFees} onChange={handleChange} min="0" helper="Required fees and port charges." inputMode="decimal" />
        </div>
      </section>

      <div className="two-column-layout">
        <section className="card">
          <SectionHeader title="Travel costs" description="Flights or driving plus the unglamorous stuff that still wants your money." />
          <div className="toggle-grid should-book-toggle-grid">
            {travelModes.map((mode) => (
              <label key={mode.value} className={`toggle-card ${form.travelMode === mode.value ? 'toggle-card-active' : ''}`}>
                <input type="radio" name="travelMode" value={mode.value} checked={form.travelMode === mode.value} onChange={handleChange} />
                <span>{mode.label}</span>
              </label>
            ))}
          </div>
          <div className="form-grid compact-form-grid">
            {form.travelMode === 'flights' ? (
              <FormField label="Flights" name="flights" value={form.flights} onChange={handleChange} min="0" helper="Total airfare estimate." inputMode="decimal" />
            ) : (
              <FormField label="Driving" name="driving" value={form.driving} onChange={handleChange} min="0" helper="Gas, tolls, rental, or wear-and-tear estimate." inputMode="decimal" />
            )}
            <FormField label="Hotel pre-cruise" name="hotel" value={form.hotel} onChange={handleChange} min="0" helper="Pre-cruise hotel estimate." inputMode="decimal" />
            <FormField label="Parking" name="parking" value={form.parking} onChange={handleChange} min="0" helper="Port or airport parking." inputMode="decimal" />
            <FormField label="Transfers / Uber" name="transfers" value={form.transfers} onChange={handleChange} min="0" helper="Airport, hotel, and port movement." inputMode="decimal" />
            <FormField label="Travel protection" name="travelProtection" value={form.travelProtection} onChange={handleChange} min="0" helper="Insurance or protection estimate." inputMode="decimal" />
          </div>
        </section>

        <section className="card">
          <SectionHeader title="Add-on costs" description="The shiny checkout toys. Some are useful. Some are just invoice confetti." />
          <div className="form-grid">
            <FormField label="Gratuities" name="prepaidGratuities" value={form.prepaidGratuities} onChange={handleChange} min="0" helper="Prepaid or expected gratuities." inputMode="decimal" />
            <FormField label="Drink package" name="drinkPackage" value={form.drinkPackage} onChange={handleChange} min="0" helper="Full package estimate." inputMode="decimal" />
            <FormField label="Dining package" name="diningPackage" value={form.diningPackage} onChange={handleChange} min="0" helper="Dining package or specialty dining spend." inputMode="decimal" />
            <FormField label="WiFi" name="wifi" value={form.wifi} onChange={handleChange} min="0" helper="Internet plan estimate." inputMode="decimal" />
            <FormField label="The Key" name="theKey" value={form.theKey} onChange={handleChange} min="0" helper="The Key total, if considering it." inputMode="decimal" />
            <FormField label="Excursions" name="excursions" value={form.excursions} onChange={handleChange} min="0" helper="Port activities and tours." inputMode="decimal" />
            <FormField label="Onboard miscellaneous" name="onboardSpend" value={form.onboardSpend} onChange={handleChange} min="0" helper="Photos, arcade, casino, shopping, and other little traps." inputMode="decimal" />
          </div>
        </section>
      </div>

      <section className="card">
        <SectionHeader title="Comparison option" description="Optional, but powerful. A realistic alternative is how bad cruise decisions get exposed." />
        <div className="form-grid">
          <label className="field">
            <span className="field-label">Alternative option</span>
            <input className="field-input" name="alternativeLabel" value={form.alternativeLabel} onChange={handleChange} placeholder="Same ship later, different ship, resort, no vacation" />
            <small className="field-helper">Name the competing option in plain English.</small>
          </label>
          <FormField label="Alternative total estimated cost" name="alternativeTotal" value={form.alternativeTotal} onChange={handleChange} min="0" helper="Leave blank if there is no serious alternative." inputMode="decimal" />
          <TextareaField label="Decision notes" name="notes" value={form.notes} onChange={handleChange} helper="Optional context for your own memory. It is saved locally only." />
        </div>
      </section>

      <section className="card should-book-reality-card">
        <SectionHeader title="Cost reality check" description="The receipt, without the perfume." />
        <div className="stats-grid">
          {statItems.map((item) => (
            <article key={item.label} className="stat-card stat-card-emphasized">
              <span className="stat-label">{item.label}</span>
              <strong className="stat-value">{item.value}</strong>
              <small className="stat-helper">{item.helper}</small>
            </article>
          ))}
        </div>
        <div className="hidden-cost-warning should-book-warning">
          <strong>Hidden cost warning</strong>
          <span>{decision.financialRisk}</span>
        </div>
      </section>

      <div className="two-column-layout">
        <section className="card callout-card">
          <SectionHeader title="What I would personally do" description="Short, blunt, and allergic to fence-sitting." />
          <div className="verdict-highlight should-book-personal-call">
            <span>Personal call</span>
            <strong>{decision.personalCall}</strong>
          </div>
        </section>

        <section className="card comparison-band-card">
          <SectionHeader title="If you wait" description="Waiting is a tactic, not a personality trait. Use it correctly." />
          <div className="explanation-list">
            <div className="explanation-item"><span>Could improve</span><strong>{decision.waitUpside}</strong></div>
            <div className="explanation-item"><span>Could get worse</span><strong>{decision.waitDownside}</strong></div>
            <div className="explanation-item"><span>Final payment logic</span><strong>{decision.finalPaymentLogic}</strong></div>
          </div>
        </section>
      </div>

      {decision.alternativeTotal ? (
        <section className="card should-book-alternative-card">
          <SectionHeader title="Better alternative" description="If the other option wins, the page says so. Radical honesty, terrifying concept." />
          <div className="verdict-highlight">
            <span>{form.alternativeLabel || 'Alternative option'}</span>
            <strong>
              {decision.alternativeSavings > 0
                ? `Better by ${formatCurrency(decision.alternativeSavings)}. Do not ignore that.`
                : `Not cheaper. This cruise survives the alternative test.`}
            </strong>
          </div>
        </section>
      ) : null}

      <AssumptionsPanel
        items={[
          'This page only uses numbers you enter and general decision rules. It does not invent ship-specific facts or live pricing.',
          'Final-payment timing is estimated from the sail date you enter. Verify cancellation, deposit, and payment rules with the booking source before paying.',
          'This site is independent and not affiliated with Royal Caribbean. Confirm current prices in Royal Caribbean official app or site before booking.',
        ]}
      />
    </div>
  )
}
