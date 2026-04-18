export const releaseInfo = {
  currentVersion: 'v1.10.0',
  updatedDate: '2026-04-18',
  buildId: 'dining-package-calculator',
  changelogEntries: [
    {
      version: 'v1.10.0',
      date: '2026-04-18',
      changes: [
        'Added the Dining Package Calculator to judge whether the Unlimited Dining Package is actually worth it.',
        'Added verdict, savings or overpay messaging, realistic meal usage, break-even meal count, and quick-win guidance for dining package decisions.',
        'Replaced the old Dining Explorer placeholder with a live link to the new dining package tool.',
      ],
    },
    {
      version: 'v1.9.6',
      date: '2026-04-18',
      changes: [
        'Replaced the primary brand name with Cruise Decision Engine in the header and footer.',
        'Updated the subtitle to Royal Caribbean trip decision tools for clearer product positioning.',
        'Kept the existing header and footer layout while tightening text hierarchy for the new brand name.',
      ],
    },
    {
      version: 'v1.9.5',
      date: '2026-04-18',
      changes: [
        'Updated the header brand block subtitle to Royal Caribbean decision tools.',
        'Improved the brand block spacing and text hierarchy so the product identity reads cleaner and more premium.',
        'Kept the full header brand block linked to the homepage while tightening the top-left presentation.',
      ],
    },
    {
      version: 'v1.9.4',
      date: '2026-04-18',
      changes: [
        'Refined Dining Explorer so the summary verdict more clearly answers whether specialty dining is actually needed on each ship.',
        'Surfaced included-with-caveat venues more clearly and grouped dining fine print into included caveats versus extra-cost or policy nuance.',
        'Reduced the prominence of the unbuilt Dining Package Calculator placeholder and added a clearer verification note about policy changes.',
      ],
    },
    {
      version: 'v1.9.3',
      date: '2026-04-18',
      changes: [
        'Tightened verdict language and action recommendations across Compare, WiFi, Cruise Cost, The Key, and Deal Evaluator.',
        'Removed contradictory signals like negative compare deltas and soft WiFi borderline messaging when the recommendation is actually decisive.',
        'Improved quick-win logic so controllable costs get the attention instead of base fare pretending to be a user choice.',
      ],
    },
    {
      version: 'v1.9.2',
      date: '2026-04-18',
      changes: [
        'Redesigned the footer with clearer structure for brand, statement, disclaimer, navigation, and release metadata.',
        'Added an explicit independent-tool disclaimer and made version/build information quieter without hiding it.',
        'Improved footer spacing, contrast, and alignment so it feels like part of the product instead of an afterthought.',
      ],
    },
    {
      version: 'v1.9.1',
      date: '2026-04-18',
      changes: [
        'Reworked the homepage to behave more like a Royal Caribbean decision engine instead of a generic tool hub.',
        'Put the most important decisions first with a Start Here strip and a primary tool order led by Deal Evaluator, Cruise Cost, and Drink Package.',
        'Moved Dining Explorer and lower-priority utilities into secondary sections so the homepage pushes the money decisions first.',
      ],
    },
    {
      version: 'v1.9.0',
      date: '2026-04-18',
      changes: [
        'Reworked the site into a premium dark theme with deep navy and charcoal surfaces, brighter text, and blue-cyan accents.',
        'Updated cards, forms, buttons, badges, and verdict states to fit the darker visual system without changing layouts.',
        'Strengthened contrast and focus states so the darker theme still reads cleanly and feels deliberate instead of muddy.',
      ],
    },
    {
      version: 'v1.8.1',
      date: '2026-04-18',
      changes: [
        'Sharpened the Dining Explorer verdict language so it gives a clearer recommendation about specialty dining.',
        'Added an included-vs-paid reality summary, stronger fine-print framing, and next-step links from the Dining page.',
        'Improved dining profile completeness for common included venues like Cafe Promenade and Solarium Bistro where appropriate.',
      ],
    },
    {
      version: 'v1.8.0',
      date: '2026-04-18',
      changes: [
        'Added the Dining Explorer page powered by the canonical Royal ship dining dataset.',
        'Added ship selection with active ships by default and optional future-ship visibility.',
        'Added clear complimentary, specialty, and hybrid dining sections with ship-level notes and summary insight.',
      ],
    },
    {
      version: 'v1.7.0',
      date: '2026-04-18',
      changes: [
        'Added a canonical Royal Caribbean ship dataset covering every ship on the official deck plan pages.',
        'Separated active ships from future ships like Legend of the Seas and Hero of the Seas instead of pretending all hulls are already sailing.',
        'Added maintainable ship-level dining data with complimentary, specialty, and hybrid venue groupings for future dining tools.',
      ],
    },
    {
      version: 'v1.6.2',
      date: '2026-04-18',
      changes: [
        'Strengthened the Deal Evaluator verdict with clearer explanation of the real trip cost.',
        'Added add-on pressure interpretation, nightly range comparison, and more actionable quick wins.',
        'Improved Deal Evaluator wording so it reads more like a decision tool and less like a calculator dump.',
      ],
    },
    {
      version: 'v1.6.1',
      date: '2026-04-18',
      changes: [
        'Removed the unused Port Day Ideas placeholder from the tools list.',
        'Cleaned the tools catalog so only intentional live tools and remaining planned entries stay visible.',
      ],
    },
    {
      version: 'v1.6.0',
      date: '2026-04-18',
      changes: [
        'Added the Deal Evaluator to judge whether a cruise is actually a deal once fare, add-ons, and travel are included.',
        'Added a verdict, reality breakdown, add-on pressure, biggest cost drivers, and quick wins for deal decisions.',
        'Added the Deal Evaluator to the live tools list.',
      ],
    },
    {
      version: 'v1.5.0',
      date: '2026-04-18',
      changes: [
        'Added the WiFi Calculator to help decide between no WiFi, one device, or two devices.',
        'Added a WiFi verdict, cost comparison, wasted-spend guidance, and practical usage insights.',
        'Added the WiFi Calculator to the live tools list.',
      ],
    },
    {
      version: 'v1.4.1',
      date: '2026-04-18',
      changes: [
        'Backfilled release tracking for the visible footer version metadata and changelog page.',
        'Backfilled release tracking for the About page rewrite so the release history matches the shipped site.',
        'Confirmed that Decision Summary has not been built yet and remains outstanding work.',
      ],
    },
    {
      version: 'v1.4.0',
      date: '2026-04-18',
      changes: [
        'Added copy-summary support on Compare for quickly sharing the important decision points.',
        'Added share-link support on Compare with restore-from-URL behavior and graceful invalid-link handling.',
        'Added lightweight success feedback for Compare sharing actions.',
      ],
    },
    {
      version: 'v1.3.0',
      date: '2026-04-18',
      changes: [
        'Added The Key Calculator with verdict, value drivers, and simple worth-it guidance.',
        'Added save, load, and delete support for Compare scenarios using localStorage only.',
        'Added share summary and share-link support for Compare, including restore-from-URL behavior.',
        'Added visible version information in the footer and a dedicated changelog page.',
        'Rewrote the About page with clearer purpose and stronger site-aligned tone.',
      ],
    },
    {
      version: 'v1.2.0',
      date: '2026-04-18',
      changes: [
        'Added the Compare page with side-by-side trip scenarios and difference summaries.',
        'Added preset comparisons like drink package vs pay-as-you-go, full experience vs budget, and fly vs drive.',
        'Tightened copy across the site, removed cents from currency display, and cleaned up calculator messaging.',
      ],
    },
    {
      version: 'v1.1.0',
      date: '2026-04-17',
      changes: [
        'Upgraded the Cruise Cost Calculator with reality-check messaging, add-on interpretation, and quick-win guidance.',
        'Refined the Drink Package Calculator with clearer verdicts, presets, break-even guidance, and cleaner hierarchy.',
        'Improved homepage positioning and action-focused copy so the main tools are easier to find fast.',
      ],
    },
    {
      version: 'v1.0.0',
      date: '2026-04-16',
      changes: [
        'Launched the first Royal site with homepage, tools, packing generator, planner, and about page.',
        'Added the initial Drink Package Calculator and Cruise Cost Calculator.',
        'Shipped the browser-saved planner and adaptive packing list generator.',
      ],
    },
  ],
}
