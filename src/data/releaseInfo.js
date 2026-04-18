export const releaseInfo = {
  currentVersion: 'v1.7.0',
  updatedDate: '2026-04-18',
  buildId: 'royal-ship-dataset',
  changelogEntries: [
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
