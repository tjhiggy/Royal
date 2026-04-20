export function buildDiningStrategy(ship) {
  const complimentaryCount = ship.complimentaryDining.length
  const specialtyCount = ship.specialtyDining.length
  const hybridCount = ship.hybridDining.length
  const className = ship.className.toLowerCase()
  const specialtyRatio = complimentaryCount ? specialtyCount / complimentaryCount : 0
  const isLargeModernClass =
    className.includes('icon') ||
    className.includes('oasis') ||
    className.includes('quantum')

  if (specialtyCount >= 7 || (isLargeModernClass && specialtyRatio >= 0.75)) {
    return {
      headline: 'This ship pushes specialty dining more than average',
      packageVerdict: 'Consider a dining package only if you want multiple paid meals.',
      strategyLines: [
        'You can rely on complimentary dining for basics, but the paid lineup is a bigger part of the ship experience.',
        'Pick your paid meals before buying a package. Wandering into specialty dining casually is how the bill gets cute.',
      ],
    }
  }

  if (complimentaryCount >= specialtyCount + 3) {
    return {
      headline: 'You can rely on complimentary dining for most meals',
      packageVerdict: 'Skip the package unless you already know the paid restaurants you want.',
      strategyLines: [
        'The included lineup is strong enough for most of the trip.',
        'Use specialty dining as a planned splurge, not a default rescue plan.',
      ],
    }
  }

  if (hybridCount >= 5) {
    return {
      headline: 'Specialty dining is optional, but the fine print matters',
      packageVerdict: 'A package can make sense, but only if the venues you want are actually covered.',
      strategyLines: [
        'Several venues have caveats, suite-only access, breakfast-only inclusion, or separate pricing.',
        'Check the caveat list before treating every dining name like a clean package win.',
      ],
    }
  }

  return {
    headline: 'Specialty dining is optional, not essential',
    packageVerdict: 'Do not buy a package by default.',
    strategyLines: [
      'Most travelers can eat well enough without paying extra for every dinner.',
      'Buy individual specialty meals if one or two restaurants genuinely matter to you.',
    ],
  }
}
