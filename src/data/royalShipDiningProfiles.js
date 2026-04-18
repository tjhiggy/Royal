// Canonical dining profiles for Royal Caribbean ships.
// Update these when Royal changes a ship's official restaurants/bars page
// or after a major amplification/refurbishment.
// These profiles are meant to support dining decisions, package logic,
// and ship comparison views without copying the same venue lists 31 times.

const venue = (name) => ({ venue: name })
const hybridVenue = (name, rule) => ({ venue: name, rule })

export const diningProfiles = {
  iconCurrent: {
    complimentaryDining: [
      venue('AquaDome Market'),
      venue('Basecamp'),
      venue('Dining Room'),
      venue('El Loco Fresh'),
      venue('Park Cafe'),
      venue('Pearl Cafe'),
      venue("Sorrento's"),
      venue('Sprinkles'),
      venue('Surfside Bites'),
      venue('Surfside Eatery'),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('Chops Grille'),
      venue('Empire Supper Club'),
      venue("Giovanni's Italian Kitchen"),
      venue('Hooked Seafood'),
      venue('Izumi Hibachi & Sushi'),
      venue('Playmakers Sports Bar'),
    ],
    hybridDining: [
      hybridVenue('Celebration Table', 'Private-event dining with separate event pricing.'),
      hybridVenue('Coastal Kitchen', 'Complimentary for qualifying suite guests only.'),
      hybridVenue('Desserted', 'A la carte desserts and shakes, not standard complimentary dining.'),
      hybridVenue('Izumi in the Park', 'Japanese street food window with a la carte pricing and package nuance.'),
      hybridVenue('Pier 7', 'Important pricing nuance by sailing and menu. Confirm current inclusion policy.'),
      hybridVenue('Starbucks', 'Standalone coffee pricing. Not part of standard complimentary dining.'),
      hybridVenue('Sugar Beach', 'Confectionery and sweets venue with pay-as-you-go pricing.'),
      hybridVenue('The Grove', 'Complimentary for qualifying suite guests only.'),
    ],
  },
  iconLegend: {
    complimentaryDining: [
      venue('AquaDome Market'),
      venue('Basecamp'),
      venue('Dining Room'),
      venue('El Loco Fresh'),
      venue('Park Cafe'),
      venue('Pearl Cafe'),
      venue("Sorrento's"),
      venue('Sprinkles'),
      venue('Surfside Bites'),
      venue('Surfside Eatery'),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('Chops Grille'),
      venue("Giovanni's Italian Kitchen"),
      venue('Hollywoodland Supper Club'),
      venue('Hooked Seafood'),
      venue('Izumi Hibachi & Sushi'),
      venue('Playmakers Sports Bar'),
      venue('Royal Railway - Legend Station'),
    ],
    hybridDining: [
      hybridVenue('Celebration Table', 'Private-event dining with separate event pricing.'),
      hybridVenue('Coastal Kitchen', 'Complimentary for qualifying suite guests only.'),
      hybridVenue('Desserted', 'A la carte desserts and shakes, not standard complimentary dining.'),
      hybridVenue('Izumi in the Park', 'Japanese street food window with a la carte pricing and package nuance.'),
      hybridVenue('Pier 7', 'Important pricing nuance by sailing and menu. Confirm current inclusion policy.'),
      hybridVenue('Starbucks', 'Standalone coffee pricing. Not part of standard complimentary dining.'),
      hybridVenue('Sugar Beach', 'Confectionery and sweets venue with pay-as-you-go pricing.'),
      hybridVenue('The Grove', 'Complimentary for qualifying suite guests only.'),
    ],
  },
  oasisModern: {
    complimentaryDining: [
      venue('Boardwalk Dog House'),
      venue('Dining Room'),
      venue('Park Cafe'),
      venue("Sorrento's"),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('150 Central Park'),
      venue('Chops Grille'),
      venue("Giovanni's Italian Kitchen"),
      venue('Izumi'),
      venue('Wonderland'),
    ],
    hybridDining: [
      hybridVenue('Cafe Promenade', 'Grab-and-go snacks are generally complimentary, but specialty coffee is extra.'),
      hybridVenue('Coastal Kitchen', 'Complimentary for qualifying suite guests only.'),
      hybridVenue('Johnny Rockets', 'Breakfast can be included on some sailings, but lunch and dinner are typically extra.'),
      hybridVenue('Playmakers Sports Bar', 'Sports bar food is generally priced separately and often excluded from dining packages.'),
      hybridVenue('Solarium Bistro', 'Typically complimentary for breakfast and lunch, with dinner handling varying by ship and sailing.'),
      hybridVenue('Starbucks', 'Standalone coffee pricing. Not part of standard complimentary dining.'),
    ],
  },
  oasisAmped: {
    complimentaryDining: [
      venue('Boardwalk Dog House'),
      venue('Dining Room'),
      venue('El Loco Fresh'),
      venue('Park Cafe'),
      venue("Sorrento's"),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('150 Central Park'),
      venue('Chops Grille'),
      venue("Giovanni's Italian Kitchen"),
      venue('Izumi'),
      venue('Wonderland'),
    ],
    hybridDining: [
      hybridVenue('Cafe Promenade', 'Grab-and-go snacks are generally complimentary, but specialty coffee is extra.'),
      hybridVenue('Coastal Kitchen', 'Complimentary for qualifying suite guests only.'),
      hybridVenue('Johnny Rockets', 'Breakfast can be included on some sailings, but lunch and dinner are typically extra.'),
      hybridVenue('Playmakers Sports Bar', 'Sports bar food is generally priced separately and often excluded from dining packages.'),
      hybridVenue('Solarium Bistro', 'Typically complimentary for breakfast and lunch, with dinner handling varying by ship and sailing.'),
      hybridVenue('Starbucks', 'Standalone coffee pricing. Not part of standard complimentary dining.'),
    ],
  },
  utopia: {
    complimentaryDining: [
      venue('Boardwalk Dog House'),
      venue('Dining Room'),
      venue('El Loco Fresh'),
      venue('Park Cafe'),
      venue("Sorrento's"),
      venue('Spare Tire'),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('150 Central Park'),
      venue('Chops Grille'),
      venue("Giovanni's Italian Kitchen"),
      venue('Izumi'),
      venue('Mason Jar'),
      venue('Wonderland'),
    ],
    hybridDining: [
      hybridVenue('Cafe Promenade', 'Grab-and-go snacks are generally complimentary, but specialty coffee is extra.'),
      hybridVenue('Coastal Kitchen', 'Complimentary for qualifying suite guests only.'),
      hybridVenue('Johnny Rockets', 'Breakfast can be included on some sailings, but lunch and dinner are typically extra.'),
      hybridVenue('Playmakers Sports Bar', 'Sports bar food is generally priced separately and often excluded from dining packages.'),
      hybridVenue('Solarium Bistro', 'Typically complimentary for breakfast and lunch, with dinner handling varying by ship and sailing.'),
      hybridVenue('Starbucks', 'Standalone coffee pricing. Not part of standard complimentary dining.'),
    ],
  },
  quantumBase: {
    complimentaryDining: [
      venue('Cafe @ Two70'),
      venue('Dining Room'),
      venue('Dog House'),
      venue("Sorrento's"),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('Chops Grille'),
      venue("Giovanni's Italian Kitchen"),
      venue('Izumi'),
      venue('Teppanyaki'),
      venue('Wonderland'),
    ],
    hybridDining: [
      hybridVenue('Cafe Promenade', 'Where present, grab-and-go snacks are generally complimentary, but specialty coffee is extra.'),
      hybridVenue('La Patisserie', 'Pastries and specialty coffee often follow a la carte pricing.'),
      hybridVenue('Johnny Rockets', 'Breakfast can be included on some sailings, but lunch and dinner are typically extra.'),
      hybridVenue('Room Service', 'Breakfast basics can be included, with service fees or expanded menus priced separately.'),
      hybridVenue('Solarium Bistro', 'Typically complimentary for breakfast and lunch, with dinner handling varying by ship and sailing.'),
      hybridVenue('Starbucks', 'Standalone coffee pricing. Not part of standard complimentary dining.'),
    ],
  },
  spectrum: {
    complimentaryDining: [
      venue('Dining Room'),
      venue("Sorrento's"),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('Chops Grille'),
      venue("Giovanni's Italian Kitchen"),
      venue('Hot Pot'),
      venue('Izumi'),
      venue('Sichuan Red'),
      venue('Teppanyaki'),
    ],
    hybridDining: [
      hybridVenue("Chef's Table", 'Limited-seat specialty experience with separate pricing.'),
      hybridVenue('La Patisserie', 'Pastries and specialty coffee often follow a la carte pricing.'),
      hybridVenue('Room Service', 'Breakfast basics can be included, with service fees or expanded menus priced separately.'),
      hybridVenue('Solarium Bistro', 'Typically complimentary for breakfast and lunch, with dinner handling varying by ship and sailing.'),
      hybridVenue('Starbucks', 'Standalone coffee pricing. Not part of standard complimentary dining.'),
    ],
  },
  freedomAmped: {
    complimentaryDining: [
      venue('Dining Room'),
      venue('El Loco Fresh'),
      venue("Sorrento's"),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('Chops Grille'),
      venue("Giovanni's Italian Kitchen"),
      venue('Izumi'),
    ],
    hybridDining: [
      hybridVenue('Cafe Promenade', 'Grab-and-go snacks are generally complimentary, but specialty coffee is extra.'),
      hybridVenue('Johnny Rockets', 'Breakfast can be included on some sailings, but lunch and dinner are typically extra.'),
      hybridVenue('Playmakers Sports Bar', 'Sports bar food is generally priced separately and often excluded from dining packages.'),
      hybridVenue('Room Service', 'Breakfast basics can be included, with service fees or expanded menus priced separately.'),
      hybridVenue('Starbucks', 'Standalone coffee pricing. Not part of standard complimentary dining.'),
    ],
  },
  freedomClassic: {
    complimentaryDining: [
      venue('Dining Room'),
      venue("Sorrento's"),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('Chops Grille'),
      venue("Giovanni's Italian Kitchen"),
      venue('Izumi'),
    ],
    hybridDining: [
      hybridVenue('Cafe Promenade', 'Grab-and-go snacks are generally complimentary, but specialty coffee is extra.'),
      hybridVenue('Johnny Rockets', 'Breakfast can be included on some sailings, but lunch and dinner are typically extra.'),
      hybridVenue('Room Service', 'Breakfast basics can be included, with service fees or expanded menus priced separately.'),
      hybridVenue('Starbucks', 'Standalone coffee pricing. Not part of standard complimentary dining.'),
    ],
  },
  voyagerAmped: {
    complimentaryDining: [
      venue('Dining Room'),
      venue('El Loco Fresh'),
      venue("Sorrento's"),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('Chops Grille'),
      venue("Giovanni's Italian Kitchen"),
      venue('Izumi'),
    ],
    hybridDining: [
      hybridVenue('Cafe Promenade', 'Grab-and-go snacks are generally complimentary, but specialty coffee is extra.'),
      hybridVenue('Johnny Rockets', 'Breakfast can be included on some sailings, but lunch and dinner are typically extra.'),
      hybridVenue('Playmakers Sports Bar', 'Sports bar food is generally priced separately and often excluded from dining packages.'),
      hybridVenue('Room Service', 'Breakfast basics can be included, with service fees or expanded menus priced separately.'),
      hybridVenue('Starbucks', 'Standalone coffee pricing. Not part of standard complimentary dining.'),
    ],
  },
  voyagerClassic: {
    complimentaryDining: [
      venue('Dining Room'),
      venue("Sorrento's"),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('Chops Grille'),
      venue("Giovanni's Table"),
      venue('Izumi'),
    ],
    hybridDining: [
      hybridVenue('Cafe Promenade', 'Grab-and-go snacks are generally complimentary, but specialty coffee is extra.'),
      hybridVenue('Johnny Rockets', 'Breakfast can be included on some sailings, but lunch and dinner are typically extra.'),
      hybridVenue('Room Service', 'Breakfast basics can be included, with service fees or expanded menus priced separately.'),
    ],
  },
  radiance: {
    complimentaryDining: [
      venue('Dining Room'),
      venue('Park Cafe'),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('Chops Grille'),
      venue("Giovanni's Table"),
      venue('Izumi'),
    ],
    hybridDining: [
      hybridVenue('Cafe Latte-tudes', 'Coffeehouse snacks can be complimentary, but specialty drinks are extra.'),
      hybridVenue("Chef's Table", 'Limited-seat specialty experience with separate pricing.'),
      hybridVenue('Room Service', 'Breakfast basics can be included, with service fees or expanded menus priced separately.'),
    ],
  },
  vision: {
    complimentaryDining: [
      venue('Dining Room'),
      venue('Windjammer'),
    ],
    specialtyDining: [
      venue('Chops Grille'),
      venue("Giovanni's Table"),
    ],
    hybridDining: [
      hybridVenue('Cafe Latte-tudes', 'Coffeehouse snacks can be complimentary, but specialty drinks are extra.'),
      hybridVenue("Chef's Table", 'Limited-seat specialty experience with separate pricing.'),
      hybridVenue('Room Service', 'Breakfast basics can be included, with service fees or expanded menus priced separately.'),
    ],
  },
}
