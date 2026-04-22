import { basePackingSections } from '../data/packingData'
import { formatCurrency } from './formatters'

const recommendationOrder = {
  'Worth it': 'Worth it',
  Borderline: 'Borderline',
  'Skip it': 'Skip it',
}

const SPECIALTY_DINNER_PRICE = 55
const SPECIALTY_LUNCH_PRICE = 30

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

export function calculateDiningPackage(form) {
  const nights = Math.max(Number(form.cruiseNights) || 0, 0)
  const seaDays = Math.max(Number(form.seaDays) || 0, 0)
  const portDays = Math.max(Number(form.portDays) || 0, 0)
  const packagePriceInput = Math.max(Number(form.packagePrice) || 0, 0)
  const specialtyDinnersPlanned = Math.max(Number(form.specialtyDinnersPlanned) || 0, 0)
  const specialtyLunchesPlanned = Math.max(Number(form.specialtyLunchesPlanned) || 0, 0)
  const priceMode = form.priceMode || 'per-day'
  const interestLevel = form.interestLevel || 'medium'

  const packageTotal = priceMode === 'total' ? packagePriceInput : packagePriceInput * nights
  const totalTripDays = Math.max(seaDays + portDays, 1)
  const seaDayShare = seaDays / totalTripDays

  const dinnerUseRateMap = {
    low: 0.7,
    medium: 0.85,
    high: 1,
  }

  const lunchBaseRateMap = {
    low: 0.25,
    medium: 0.5,
    high: 0.75,
  }

  const estimatedDinnerCount = Math.min(specialtyDinnersPlanned, nights) * (dinnerUseRateMap[interestLevel] ?? 0.85)
  const lunchUseRate = Math.min(
    0.95,
    (lunchBaseRateMap[interestLevel] ?? 0.5) * (0.55 + seaDayShare),
  )
  const estimatedLunchCount =
    Math.min(specialtyLunchesPlanned, seaDays + portDays) * lunchUseRate

  const dinnerValue = estimatedDinnerCount * SPECIALTY_DINNER_PRICE
  const lunchValue = estimatedLunchCount * SPECIALTY_LUNCH_PRICE
  const estimatedValueUsed = dinnerValue + lunchValue
  const netSavings = estimatedValueUsed - packageTotal

  const plannedMealCount = specialtyDinnersPlanned + specialtyLunchesPlanned
  const weightedMealValue =
    plannedMealCount > 0
      ? ((specialtyDinnersPlanned * SPECIALTY_DINNER_PRICE) + (specialtyLunchesPlanned * SPECIALTY_LUNCH_PRICE)) / plannedMealCount
      : ((SPECIALTY_DINNER_PRICE * 2) + SPECIALTY_LUNCH_PRICE) / 3
  const breakEvenMealsRequired = weightedMealValue > 0 ? packageTotal / weightedMealValue : 0

  let recommendation = 'Skip it'
  if (estimatedValueUsed > packageTotal * 1.08) {
    recommendation = 'Worth it'
  } else if (Math.abs(netSavings) <= Math.max(packageTotal * 0.08, 35)) {
    recommendation = 'Borderline'
  }

  const quickWins = []

  if (recommendation === 'Skip it') {
    quickWins.push({
      title: `Skip the package -> avoid about ${formatCurrency(Math.abs(netSavings || packageTotal))}`,
      detail: 'Book the meals you actually want instead of paying upfront for optimistic usage.',
    })
  }

  if (specialtyLunchesPlanned > 0 && estimatedLunchCount < specialtyLunchesPlanned * 0.7) {
    quickWins.push({
      title: 'Do not count every lunch',
      detail: 'Port days and lighter interest usually kill lunch value faster than people expect.',
    })
  }

  if (recommendation !== 'Worth it') {
    const extraMealsNeeded = Math.max(Math.ceil(breakEvenMealsRequired - (estimatedDinnerCount + estimatedLunchCount)), 0)
    quickWins.push({
      title: extraMealsNeeded > 0
        ? `You need about ${extraMealsNeeded} more specialty meals`
        : 'You are basically at the break-even line',
      detail: extraMealsNeeded > 0
        ? 'Without more real usage, the package is doing more marketing than saving.'
        : 'This is close enough that convenience is the only real argument left.',
    })
  }

  if (recommendation === 'Worth it') {
    quickWins.push({
      title: 'Use the package on sea days',
      detail: 'That is where lunch value and repeat dinners stop this from turning into an overpay.',
    })
  }

  if (!quickWins.length) {
    quickWins.push({
      title: 'No obvious shortcut',
      detail: 'This one mostly comes down to whether you will actually use the meals you are counting.',
    })
  }

  return {
    packageTotal,
    estimatedValueUsed,
    netSavings,
    breakEvenMealsRequired,
    estimatedDinnerCount,
    estimatedLunchCount,
    dinnerValue,
    lunchValue,
    weightedMealValue,
    recommendation,
    quickWins: quickWins.slice(0, 3),
  }
}

export function calculateTheKey(form) {
  const nights = Number(form.cruiseNights) || 0
  const keyPricePerDay = Number(form.theKeyPricePerDay) || 0
  const keyTotal = nights * keyPricePerDay

  const wifiValuePerDay =
    !form.wifiNeeded ? 0 : Number(form.numberOfDevices) >= 2 ? 30 : 20
  const wifiValue = nights * wifiValuePerDay
  const lunchValue = form.embarkationLunch ? 25 : 0

  const perkValueMap = {
    low: 0,
    medium: 10,
    high: 25,
  }

  const seatingValueMap = {
    low: 0,
    medium: 10,
    high: 20,
  }

  const priorityBoardingValue = perkValueMap[form.priorityBoardingImportance] ?? 0
  const reservedSeatingValue = seatingValueMap[form.reservedSeatingImportance] ?? 0
  const skipLineValue = perkValueMap[form.skipLineImportance] ?? 0

  const estimatedValueUsed =
    wifiValue + lunchValue + priorityBoardingValue + reservedSeatingValue + skipLineValue
  const difference = keyTotal - estimatedValueUsed
  const netValue = estimatedValueUsed - keyTotal

  let recommendation = 'Skip it'
  if (estimatedValueUsed > keyTotal * 1.08) {
    recommendation = 'Worth it'
  } else if (Math.abs(difference) <= Math.max(keyTotal * 0.08, 20)) {
    recommendation = 'Borderline'
  }

  const valueDrivers = [
    { label: 'WiFi value', value: wifiValue },
    { label: 'Embarkation lunch', value: lunchValue },
    { label: 'Priority boarding', value: priorityBoardingValue },
    { label: 'Reserved seating', value: reservedSeatingValue },
    { label: 'Skip-the-line perks', value: skipLineValue },
  ]
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value)

  const mainDriver = valueDrivers[0] ?? null
  const suggestions = []
  const additionalWifiValue =
    !form.wifiNeeded ? nights * (Number(form.numberOfDevices) >= 2 ? 30 : 20) : 0
  const additionalLunchValue = form.embarkationLunch ? 0 : 25
  const additionalPriorityValue = Math.max(25 - (perkValueMap[form.priorityBoardingImportance] ?? 0), 0)
  const additionalSeatingValue = Math.max(20 - (seatingValueMap[form.reservedSeatingImportance] ?? 0), 0)
  const additionalSkipLineValue = Math.max(25 - (perkValueMap[form.skipLineImportance] ?? 0), 0)

  if (!form.wifiNeeded) {
    suggestions.push(`If you would have paid for WiFi anyway, that adds about ${formatCurrency(additionalWifiValue)} in real value.`)
  }
  if (!form.embarkationLunch) {
    suggestions.push(`Using the embarkation lunch adds about ${formatCurrency(additionalLunchValue)} back to the value side.`)
  }
  if (additionalPriorityValue > 0 || additionalSeatingValue > 0 || additionalSkipLineValue > 0) {
    const convenienceGain = additionalPriorityValue + additionalSeatingValue + additionalSkipLineValue
    suggestions.push(`If you actually value the convenience perks more, that can add about ${formatCurrency(convenienceGain)} in usable value.`)
  }
  if (difference > 0) {
    suggestions.push(`Right now you are still short by about ${formatCurrency(difference)}. Without more real value, this is mostly paying for the label.`)
  }
  if (!suggestions.length) {
    suggestions.push('You are already counting the main value levers here, so this mostly comes down to whether the convenience feels worth the price to you.')
  }

  return {
    keyTotal,
    estimatedValueUsed,
    difference,
    netValue,
    recommendation,
    wifiValue,
    lunchValue,
    priorityBoardingValue,
    reservedSeatingValue,
    skipLineValue,
    valueDrivers,
    mainDriver,
    suggestions: suggestions.slice(0, 3),
  }
}

export function calculateWifiRecommendation(form) {
  const nights = Math.max(Number(form.cruiseNights) || 0, 0)
  const wifiPricePerDevicePerDay = Math.max(Number(form.wifiPricePerDevicePerDay) || 0, 0)
  const peopleCount = Math.max(Number(form.peopleCount) || 1, 1)
  const deviceCount = Math.max(Number(form.deviceCount) || 1, 1)
  const usageType = form.usageType || 'moderate'
  const willingToShare = Boolean(form.willingToShare)

  const oneDeviceCost = nights * wifiPricePerDevicePerDay
  const twoDeviceCost = oneDeviceCost * 2
  const noWifiCost = 0

  const usageScoreMap = {
    light: 0,
    moderate: 1,
    heavy: 2,
  }

  const demandScore =
    (usageScoreMap[usageType] ?? 1) +
    (deviceCount > 1 ? 1 : 0) +
    (peopleCount > 1 ? 1 : 0) -
    (willingToShare ? 1 : 0)

  let recommendation = 'Skip WiFi'
  let recommendedPlan = 'no-wifi'

  if (demandScore > 2) {
    recommendation = 'Buy 2 devices'
    recommendedPlan = 'two-device'
  } else if (demandScore > 0) {
    recommendation = willingToShare && peopleCount > 1 ? 'Buy 1 device and share' : 'Buy 1 device'
    recommendedPlan = 'one-device'
  }

  const estimatedWastedSpend =
    recommendedPlan === 'no-wifi' ? oneDeviceCost : recommendedPlan === 'one-device' ? twoDeviceCost - oneDeviceCost : 0

  const differences = {
    oneVsNone: oneDeviceCost - noWifiCost,
    twoVsOne: twoDeviceCost - oneDeviceCost,
    twoVsNone: twoDeviceCost - noWifiCost,
  }

  const verdict = recommendedPlan === 'no-wifi' ? 'Skip it' : 'Worth it'

  const insightLines = []
  if (recommendedPlan === 'no-wifi') {
    insightLines.push('Your usage looks light enough that paying for internet is probably more habit than need.')
  }
  if (recommendedPlan === 'one-device') {
    insightLines.push(
      willingToShare
        ? 'Most of your usage can probably be covered by one shared device.'
        : 'One device covers the basics without paying for more internet than you will use.',
    )
  }
  if (recommendedPlan === 'two-device') {
    insightLines.push('Heavy usage or multiple active devices makes extra internet more reasonable here.')
  }
  if (deviceCount > 1 && willingToShare) {
    insightLines.push('Sharing logins is doing a lot of the money-saving work in this recommendation.')
  }
  if (deviceCount > 1 && !willingToShare) {
    insightLines.push('Not sharing devices pushes the math toward paying for more than one plan.')
  }

  const wastedSpendMessage =
    recommendedPlan === 'one-device'
      ? `A second device would likely add about ${formatCurrency(differences.twoVsOne)} in wasted spend.`
      : recommendedPlan === 'no-wifi'
        ? `Buying even one device plan would likely add about ${formatCurrency(differences.oneVsNone)} in unnecessary spend.`
        : 'A second device looks reasonable for this setup.'

  return {
    recommendation,
    verdict,
    recommendedPlan,
    oneDeviceCost,
    twoDeviceCost,
    noWifiCost,
    differences,
    estimatedWastedSpend,
    insightLines,
    wastedSpendMessage,
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
    ['theKey', 'The Key'],
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

  const quickWins = buildCruiseQuickWins({
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
    quickWins,
  }
}

export function calculateDealEvaluator(form) {
  const ADD_ON_HEAVY_THRESHOLD = 55
  const ADD_ON_MAJOR_THRESHOLD = 40
  const HIGH_COST_PER_NIGHT_THRESHOLD = 450
  const SOLID_DEAL_ADD_ON_THRESHOLD = 30
  const SOLID_DEAL_TRAVEL_THRESHOLD = 20
  const TRAVEL_HEAVY_THRESHOLD = 25
  const DINING_EXCURSION_THRESHOLD = 0.15

  const baseResults = calculateCruiseCost({
    cruiseFare: form.baseFare,
    taxesAndFees: form.taxesAndFees,
    drinkPackage: form.drinkPackage,
    wifi: form.wifi,
    dining: form.specialtyDining,
    excursions: form.excursions,
    theKey: form.theKey,
    hotel: form.hotel,
    flights: form.flights,
    parking: form.parkingTransport,
    travelExtras: 0,
    miscellaneous: 0,
    travelerCount: 1,
    cruiseNights: form.cruiseNights,
  })

  const travelSubtotal =
    (Number(form.flights) || 0) +
    (Number(form.hotel) || 0) +
    (Number(form.parkingTransport) || 0)
  const addOnsOnlySubtotal =
    (Number(form.drinkPackage) || 0) +
    (Number(form.wifi) || 0) +
    (Number(form.excursions) || 0) +
    (Number(form.specialtyDining) || 0) +
    (Number(form.theKey) || 0)

  const total = baseResults.grandTotal
  const addOnsShare = total ? (addOnsOnlySubtotal / total) * 100 : 0
  const travelShare = total ? (travelSubtotal / total) * 100 : 0
  const baseFareShare = total ? ((Number(form.baseFare) || 0) / total) * 100 : 0

  const costDrivers = [
    { key: 'taxesAndFees', label: 'Taxes and fees', value: Number(form.taxesAndFees) || 0 },
    { key: 'drinkPackage', label: 'Drink package', value: Number(form.drinkPackage) || 0 },
    { key: 'wifi', label: 'WiFi', value: Number(form.wifi) || 0 },
    { key: 'excursions', label: 'Excursions', value: Number(form.excursions) || 0 },
    { key: 'specialtyDining', label: 'Specialty dining', value: Number(form.specialtyDining) || 0 },
    { key: 'theKey', label: 'The Key', value: Number(form.theKey) || 0 },
    { key: 'flights', label: 'Flights', value: Number(form.flights) || 0 },
    { key: 'hotel', label: 'Hotel', value: Number(form.hotel) || 0 },
    { key: 'parkingTransport', label: 'Parking / transport', value: Number(form.parkingTransport) || 0 },
  ]
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value)
    .slice(0, 3)

  let verdict = 'Solid deal'
  const verdictLines = []

  if (addOnsShare > ADD_ON_HEAVY_THRESHOLD) {
    verdict = 'Add-on heavy'
    verdictLines.push(`The base fare looks manageable, but the real trip cost is ${formatCurrency(total)}.`)
    verdictLines.push('Most of your spend is coming from add-ons and travel.')
  } else if (baseResults.costPerNight >= HIGH_COST_PER_NIGHT_THRESHOLD) {
    verdict = 'Not a cheap cruise'
    verdictLines.push(`The base fare looks lower than the real trip cost, which lands at ${formatCurrency(total)}.`)
    verdictLines.push('This is not a cheap cruise once the extras and travel get involved.')
  } else if (addOnsShare < SOLID_DEAL_ADD_ON_THRESHOLD && travelShare < SOLID_DEAL_TRAVEL_THRESHOLD) {
    verdict = 'Solid deal'
    verdictLines.push(`The real trip cost is ${formatCurrency(total)}, and the extras are not hijacking it.`)
    verdictLines.push('This still looks like a solid deal once the full trip is priced honestly.')
  } else {
    verdict = 'Mixed deal'
    verdictLines.push(`The base fare may look fine, but the real trip cost reaches ${formatCurrency(total)}.`)
    verdictLines.push('Nothing is totally out of control, but this is not the bargain the fare tries to suggest.')
  }

  const quickWins = buildDealQuickWins({
    drinkPackage: Number(form.drinkPackage) || 0,
    wifi: Number(form.wifi) || 0,
    excursions: Number(form.excursions) || 0,
    specialtyDining: Number(form.specialtyDining) || 0,
    theKey: Number(form.theKey) || 0,
    flights: Number(form.flights) || 0,
    hotel: Number(form.hotel) || 0,
    parkingTransport: Number(form.parkingTransport) || 0,
    travelSubtotal,
    total,
    travelHeavyThreshold: TRAVEL_HEAVY_THRESHOLD,
    diningExcursionThreshold: DINING_EXCURSION_THRESHOLD,
  })

  let addOnPressureMessage = 'Add-ons are under control for this trip.'
  if (addOnsShare > ADD_ON_HEAVY_THRESHOLD) {
    addOnPressureMessage = 'Add-ons are driving most of your total. This is an add-on heavy trip.'
  } else if (addOnsShare >= ADD_ON_MAJOR_THRESHOLD) {
    addOnPressureMessage = 'Add-ons are a major part of your cost.'
  }

  const nightlyBand = getDealNightlyBand(baseResults.costPerNight)

  return {
    ...baseResults,
    total,
    travelSubtotal,
    addOnsOnlySubtotal,
    addOnsShare,
    travelShare,
    baseFareShare,
    costDrivers,
    verdict,
    verdictLines: verdictLines.slice(0, 2),
    addOnPressureMessage,
    nightlyBand,
    quickWins: quickWins.slice(0, 3),
  }
}

function getDealNightlyBand(costPerNight) {
  if (costPerNight < 300) {
    return {
      label: 'Budget range',
      lines: ['This lands in the budget range.', 'This still looks like a lower-cost trip per night.'],
    }
  }

  if (costPerNight < 600) {
    return {
      label: 'Typical range',
      lines: ['This lands in a typical range for a cruise.', 'It is not a steal, but it is not wildly inflated either.'],
    }
  }

  if (costPerNight < 900) {
    return {
      label: 'Higher-end',
      lines: ['This is on the higher end for a typical cruise.', 'This is not a budget trip.'],
    }
  }

  return {
    label: 'Premium',
    lines: ['This is in premium territory on a per-night basis.', 'You are well past budget-trip math here.'],
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
    amount: Math.abs(category.value),
    higherIn: category.value > 0 ? 'Scenario B' : 'Scenario A',
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
    absoluteTotalDifference: Math.abs(totalDifference),
    absoluteCostPerNightDifference: Math.abs(costPerNightDifference),
    absoluteAddOnsDifference: Math.abs(addOnsDifference),
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

function buildCruiseQuickWins({ fare, addOns, travelCosts, grandTotal, topAddOnDriver, addOnCategories }) {
  const quickWins = []

  if (topAddOnDriver && topAddOnDriver.value >= grandTotal * 0.12) {
    quickWins.push({
      title: `Cut ${topAddOnDriver.label.toLowerCase()} -> save about ${formatCurrency(topAddOnDriver.value)}`,
      detail: 'This is the clearest add-on lever in the total.',
    })
  }

  const flightCost = addOnCategories.find((category) => category.key === 'flights')?.value ?? 0
  const hotelCost = addOnCategories.find((category) => category.key === 'hotel')?.value ?? 0

  if (flightCost > 0 && travelCosts >= grandTotal * 0.22) {
    quickWins.push({
      title: `Drive instead of fly -> save about ${formatCurrency(flightCost)}`,
      detail: 'Only realistic if the port is drivable, but airfare is big enough to test the idea.',
    })
  } else if (hotelCost > 0 && travelCosts >= grandTotal * 0.22) {
    quickWins.push({
      title: `Cut one hotel night -> save about ${formatCurrency(hotelCost)}`,
      detail: 'If the schedule allows it, hotel spend is one of the cleaner travel cuts.',
    })
  }

  const diningAndExcursions = addOnCategories
    .filter((category) => ['dining', 'excursions'].includes(category.key))
    .reduce((total, category) => total + category.value, 0)

  if (diningAndExcursions >= grandTotal * 0.15) {
    quickWins.push({
      title: `Trim dining or excursions -> save about ${formatCurrency(diningAndExcursions)}`,
      detail: 'Those extras are large enough to move the total without changing the sailing itself.',
    })
  }

  if (addOns > fare && addOns > 0) {
    quickWins.push({
      title: `Cut add-ons first -> save about ${formatCurrency(addOns)}`,
      detail: 'The easiest savings are in the extras, not the cabin fare.',
    })
  }

  if (!quickWins.length) {
    quickWins.push({
      title: 'No obvious easy cut',
      detail: 'This total is fairly spread out, so compare the extras before you touch the sailing itself.',
    })
  }

  return quickWins.slice(0, 3)
}

function buildDealQuickWins({
  drinkPackage,
  wifi,
  excursions,
  specialtyDining,
  theKey,
  flights,
  hotel,
  parkingTransport,
  travelSubtotal,
  total,
  travelHeavyThreshold,
  diningExcursionThreshold,
}) {
  const quickWins = []
  const directCuts = [
    { key: 'drinkPackage', label: 'Skip the drink package', value: drinkPackage, detail: 'This is often the fastest way to strip out a big optional cost.' },
    { key: 'excursions', label: 'Trim excursions', value: excursions, detail: 'Port spend can get out of hand fast and is easier to scale back than the sailing.' },
    { key: 'specialtyDining', label: 'Cut specialty dining', value: specialtyDining, detail: 'This is easier to trim than the trip itself and usually hurts less.' },
    { key: 'theKey', label: 'Skip The Key', value: theKey, detail: 'If the deal already looks shaky, this is usually easy to cut.' },
    { key: 'wifi', label: 'Scale back WiFi', value: wifi, detail: 'This is optional spend, not a required part of the fare.' },
  ]
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value)

  directCuts.slice(0, 2).forEach((item) => {
    quickWins.push({
      title: `${item.label} -> save about ${formatCurrency(item.value)}`,
      detail: item.detail,
    })
  })

  if (travelSubtotal >= total * travelHeavyThreshold / 100) {
    const biggestTravelComponent = Math.max(flights, hotel, parkingTransport)
    quickWins.push({
      title: `Rework travel -> save about ${formatCurrency(biggestTravelComponent || travelSubtotal)}`,
      detail: 'Flights, hotel, or transport are large enough to matter more than small onboard cuts.',
    })
  }

  if (excursions + specialtyDining >= total * diningExcursionThreshold) {
    quickWins.push({
      title: `Trim dining and excursions -> save about ${formatCurrency(excursions + specialtyDining)}`,
      detail: 'Those extras are large enough to move the budget without changing the sailing.',
    })
  }

  if (!quickWins.length) {
    quickWins.push({
      title: 'No obvious easy cut',
      detail: 'This total is fairly spread out, so the best move is comparing several smaller extras instead of chasing one magic fix.',
    })
  }

  return quickWins.slice(0, 3)
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
