export const releaseInfo = {
  currentVersion: 'v1.4.1',
  updatedDate: '2026-04-18',
  buildId: 'release-backfill',
  changelogEntries: [
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
