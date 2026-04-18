import { basePackingSections } from '../data/packingData'
import { formatCurrency } from './formatters'

const recommendationOrder = {
  'Worth it': 'Worth it',
  Borderline: 'Borderline',
  'Skip it': 'Skip it',
}

export function calculateDrinkPackage(form) {
  const nights = Number(form.cruiseNights) || 0
  const gratuityRate = (Number(form.gratuityPercentage) || 0) / 100
  const dailyPackagePrice = Number(form.packagePricePerPersonPerDay) || 0
  const packageDailyTotal = dailyPackagePrice * (1 + gratuityRate)
  const packageTotal = nights * packageDailyTotal

  const alcoholicSpend = (Number(form.alcoholicDrinksPerDay) || 0) * (Number(form.alcoholicDrinkPrice) || 0)
  const coffeeSpend = (Number(form.specialtyCoffeesPerDay) || 0) * (Number(form.specialtyCoffeePrice) || 0)
  const waterSpend = (Number(form.bottledWatersPerDay) || 0) * (Number(form.bottledWaterPrice) || 0)
  const sodaSpend = (Number(form.sodasMocktailsPerDay) || 0) * (Number(form.sodaMocktailPrice) || 0)

  const dailySpendBase = alcoholicSpend + coffeeSpend + waterSpend + sodaSpend
  const payAsYouGoDailyTotal = dailySpendBase * (1 + gratuityRate)
  const dailySpend = payAsYouGoDailyTotal

  const payAsYouGoTotal = nights * payAsYouGoDailyTotal
  const totalDifference = packageTotal - payAsYouGoTotal
  const netSavings = payAsYouGoTotal - packageTotal
  const breakEvenDailySpend = dailyPackagePrice
  const currentAlcoholicDrinksPerDay = Number(form.alcoholicDrinksPerDay) || 0
  const alcoholicDrinkPrice = Math.max(Number(form.alcoholicDrinkPrice) || 14, 1)
  const nonAlcoholicDailySpend = coffeeSpend + waterSpend + sodaSpend
  const breakEvenAlcoholicDrinks = Math.max((dailyPackagePrice - nonAlcoholicDailySpend) / alcoholicDrinkPrice, 0)
  const breakEvenDrinks = dailyPackagePrice / alcoholicDrinkPrice
  const extraAlcoholicDrinksNeeded = Math.max(breakEvenAlcoholicDrinks - currentAlcoholicDrinksPerDay, 0)

  let recommendation = recommendationOrder['Skip it']
  if (payAsYouGoTotal > packageTotal * 1.08) {
    recommendation = recommendationOrder['Worth it']
  } else if (Math.abs(totalDifference) <= packageTotal * 0.08) {
    recommendation = recommendationOrder.Borderline
  }

  return {
    packageTotal,
    payAsYouGoTotal,
    totalDifference,
    netSavings,
    packageDailyTotal,
    payAsYouGoDailyTotal,
    dailySpendBase,
    breakEvenDailySpend,
    breakEvenDrinks,
    breakEvenAlcoholicDrinks,
    extraAlcoholicDrinksNeeded,
    alcoholicSpend,
    coffeeSpend,
    waterSpend,
    sodaSpend,
    recommendation,
  }
}

export function calculateCruiseCost(form) {
  const fare = Number(form.cruiseFare) || 0
  const categoryDefinitions = [
    ['taxesAndFees', 'Taxes and fees'],
    ['prepaidGratuities', 'Prepaid gratuities'],
    ['drinkPackage', 'Drink package'],
    ['wifi', 'WiFi'],
    ['dining', 'Dining'],
    ['excursions', 'Excursions'],
    ['hotel', 'Hotel'],
    ['flights', 'Flights'],
    ['parking', 'Parking'],
    ['travelExtras', 'Travel extras'],
    ['miscellaneous', 'Miscellaneous'],
  ]
  const addOnCategories = categoryDefinitions.map(([key, label]) => ({
    key,
    label,
    value: Number(form[key]) || 0,
  }))
  const addOns = addOnCategories.reduce((total, category) => total + category.value, 0)

  const grandTotal = fare + addOns
  const travelerCount = Math.max(Number(form.travelerCount) || 1, 1)
  const cruiseNights = Math.max(Number(form.cruiseNights) || 1, 1)
  const travelCosts = ['flights', 'hotel', 'parking', 'travelExtras'].reduce(
    (total, key) => total + (Number(form[key]) || 0),
    0,
  )
  const sortedDrivers = [
    { key: 'cruiseFare', label: 'Cruise fare', value: fare },
    ...addOnCategories,
  ]
    .filter((category) => category.value > 0)
    .sort((left, right) => right.value - left.value)
  const biggestAddOnDrivers = addOnCategories
    .filter((category) => category.value > 0)
    .sort((left, right) => right.value - left.value)
    .slice(0, 3)
  const biggestCostDrivers = sortedDrivers.slice(0, 3)
  const topAddOnDriver = addOnCategories
    .filter((category) => category.value > 0)
    .sort((left, right) => right.value - left.value)[0] ?? null
  const dominantDriver = sortedDrivers[0] ?? null
  const travelShare = grandTotal ? (travelCosts / grandTotal) * 100 : 0
  const highestShare = grandTotal && dominantDriver ? (dominantDriver.value / grandTotal) * 100 : 0

  let status = 'Balanced'
  const summaryLines = []

  if (addOns > fare && fare > 0) {
    status = 'Add-on heavy'
    summaryLines.push('Your extras are costing more than the cruise itself.')
    summaryLines.push('Most of the budget is happening after the cabin fare, which is how totals get rude fast.')
  } else if (travelShare >= 28) {
    status = 'Travel-heavy'
    summaryLines.push('A big chunk of this trip is the cost of getting there, not the sailing.')
    summaryLines.push('Flights, hotel, parking, and travel extras are doing real damage to the total.')
  } else if (fare >= addOns && fareShareOfTotal(fare, grandTotal) >= 48) {
    status = 'Fare-first'
    summaryLines.push('The cabin fare is still the main event here.')
    summaryLines.push('Your add-ons have not fully hijacked the budget yet.')
  } else {
    summaryLines.push('This trip is fairly balanced between fare and extras.')
    summaryLines.push('Nothing looks wildly out of line, but the add-ons are still doing their usual creeping.')
  }

  if (costPerNightBand(grandTotal / cruiseNights) === 'high') {
    summaryLines.push('Once you spread the real total across each night, this is an expensive sailing.')
  } else if (costPerNightBand(grandTotal / cruiseNights) === 'mid') {
    summaryLines.push('The per-night cost is not absurd, but it is well past brochure fantasy.')
  }

  if (topAddOnDriver && topAddOnDriver.value >= addOns * 0.3) {
    summaryLines.push(`${topAddOnDriver.label} is one of the main places your budget is getting eaten alive.`)
  } else if (dominantDriver && highestShare >= 0.3) {
    summaryLines.push(`${dominantDriver.label} is carrying a big share of this total.`)
  }

  const quickWin = buildCruiseQuickWin({
    fare,
    addOns,
    travelCosts,
    grandTotal,
    topAddOnDriver,
    addOnCategories,
  })

  return {
    fare,
    grandTotal,
    addOnsSubtotal: addOns,
    costPerPerson: grandTotal / travelerCount,
    costPerNight: grandTotal / cruiseNights,
    fareShare: grandTotal ? (fare / grandTotal) * 100 : 0,
    extrasShare: grandTotal ? (addOns / grandTotal) * 100 : 0,
    travelCosts,
    travelShare,
    addOnCategories,
    biggestAddOnDrivers,
    biggestCostDrivers,
    dominantDriver,
    status,
    summaryLines: summaryLines.slice(0, 3),
    quickWin,
  }
}

export function compareCruiseCostScenarios(scenarioA, scenarioB) {
  const totalDifference = scenarioB.grandTotal - scenarioA.grandTotal
  const costPerNightDifference = scenarioB.costPerNight - scenarioA.costPerNight
  const addOnsDifference = scenarioB.addOnsSubtotal - scenarioA.addOnsSubtotal

  const moreExpensiveScenario =
    totalDifference > 0 ? 'Scenario B' : totalDifference < 0 ? 'Scenario A' : 'Neither scenario'

  const categoryDifferences = [
    { key: 'cruiseFare', label: 'Cruise fare', value: scenarioB.fare - scenarioA.fare },
    ...scenarioA.addOnCategories.map((categoryA) => {
      const categoryB = scenarioB.addOnCategories.find((candidate) => candidate.key === categoryA.key)
      return {
        key: categoryA.key,
        label: categoryA.label,
        value: (categoryB?.value ?? 0) - categoryA.value,
      }
    }),
  ]
    .filter((category) => category.value !== 0)
    .sort((left, right) => Math.abs(right.value) - Math.abs(left.value))

  const biggestDifference = categoryDifferences[0] ?? null
  const topDifferenceLines = categoryDifferences.slice(0, 3).map((category) => ({
    ...category,
    direction: category.value > 0 ? 'higher in Scenario B' : 'higher in Scenario A',
  }))

  let interpretation = 'The two scenarios land in almost the same place overall.'
  if (moreExpensiveScenario !== 'Neither scenario') {
    interpretation = `${moreExpensiveScenario} is more expensive overall by about ${formatCurrency(Math.abs(totalDifference))}.`
  }

  let driverNote = 'No single line item is creating a major gap between the two.'
  if (biggestDifference) {
    driverNote = `${biggestDifference.label} is the main driver, with about ${formatCurrency(Math.abs(biggestDifference.value))} more in ${
      biggestDifference.value > 0 ? 'Scenario B' : 'Scenario A'
    }.`
  }

  return {
    totalDifference,
    costPerNightDifference,
    addOnsDifference,
    moreExpensiveScenario,
    interpretation,
    driverNote,
    topDifferenceLines,
  }
}

function fareShareOfTotal(fare, grandTotal) {
  return grandTotal ? (fare / grandTotal) * 100 : 0
}

function costPerNightBand(costPerNight) {
  if (costPerNight >= 600) {
    return 'high'
  }

  if (costPerNight >= 350) {
    return 'mid'
  }

  return 'low'
}

function buildCruiseQuickWin({ fare, addOns, travelCosts, grandTotal, topAddOnDriver, addOnCategories }) {
  if (topAddOnDriver && topAddOnDriver.value >= grandTotal * 0.12) {
    return `Cutting ${topAddOnDriver.label.toLowerCase()} would lower the total by about ${formatCurrency(topAddOnDriver.value)}.`
  }

  if (travelCosts >= grandTotal * 0.28) {
    return 'Travel is expensive enough here that changing flights, hotel, or transfers could move the total more than trimming small onboard extras.'
  }

  const diningAndExcursions = addOnCategories
    .filter((category) => ['dining', 'excursions'].includes(category.key))
    .reduce((total, category) => total + category.value, 0)

  if (diningAndExcursions >= grandTotal * 0.15) {
    return 'Excursions and specialty dining are large enough to trim before you mess with the sailing itself.'
  }

  if (addOns > fare && addOns > 0) {
    return 'The easiest savings are probably in the add-ons, not the cabin fare.'
  }

  return 'There is no single obvious budget fix here, so compare the add-ons before cutting the sailing itself.'
}

export function generatePackingList(form) {
  const nights = Number(form.nights) || 0
  const adults = Number(form.adults) || 0
  const kids = Number(form.kids) || 0
  const warmWeather = Boolean(form.warmWeather)
  const formalNights = Number(form.formalNights) || 0
  const beachPoolDays = Number(form.beachPoolDays) || 0

  // Copy each section so we can customize the generated list without mutating the base template.
  const list = Object.fromEntries(
    Object.entries(basePackingSections).map(([section, items]) => [section, [...items]]),
  )

  if (warmWeather) {
    list.clothing.push('Swimsuits', 'Cover-up', 'Breathable daytime outfits', 'Sandals')
  } else {
    list.clothing.push('Light jacket', 'Extra closed-toe shoes')
  }

  if (nights > 0) {
    list.clothing.push(`${nights + 1} casual day outfits`)
    list.toiletries.push('Enough prescriptions for entire sailing plus delay buffer')
  }

  if (formalNights > 0) {
    list.clothing.push(`${formalNights} formal dinner outfit${formalNights > 1 ? 's' : ''}`)
  }

  if (adults > 0 || kids > 0) {
    list.cabinEssentials.push(`${adults + kids} lanyards or card holders`)
  }

  if (kids > 0) {
    list.easyToForget.push('Kids medicine kit', 'Small snacks for travel day')
  }

  if (beachPoolDays > 0) {
    list.clothing.push(`${beachPoolDays} pool or beach outfits`)
    list.easyToForget.push('Waterproof phone pouch')
  }

  if (form.excursionBeach) {
    list.easyToForget.push('Snorkel gear if preferred', 'Extra dry bag')
  }

  if (form.excursionAdventure) {
    list.clothing.push('Activewear')
    list.easyToForget.push('Small first-aid kit', 'Reusable cooling towel')
  }

  if (form.excursionWalking) {
    list.clothing.push('Broken-in walking shoes')
  }

  if (form.excursionRainy) {
    list.clothing.push('Packable rain jacket')
    list.easyToForget.push('Compact umbrella')
  }

  return Object.entries(list).map(([section, items]) => ({
    section,
    items: Array.from(new Set(items)),
  }))
}
