export const releaseInfo = {
  currentVersion: 'v1.24.0',
  updatedDate: '2026-04-22',
  buildId: 'decision-flow-polish',
  changelogEntries: [
    {
      version: 'v1.24.0',
      date: '2026-04-22',
      changes: [
        'Reworked homepage hierarchy around the decision flow, common cost traps, and clearer next steps.',
        'Standardized Tools page ordering and copy so calculators follow the deal, cost, upgrade, compare sequence.',
        'Polished calculator messaging, Cruise Cost input grouping, Dining Explorer verdict clarity, Planner progress, Packing cards, footer, and brand treatment.',
      ],
    },
    {
      version: 'v1.23.0',
      date: '2026-04-20',
      changes: [
        'Ran a sitewide clarity and polish pass across navigation, footer, homepage copy, recent-session labels, and Snapshot.',
        'Updated Snapshot to use the latest local calculator sessions when available instead of only showing sample defaults.',
        'Fixed visible special-character rendering issues in homepage, banner, recent-trip labels, and changelog copy.',
      ],
    },
    {
      version: 'v1.22.0',
      date: '2026-04-19',
      changes: [
        'Added Recent trips localStorage support for Deal Evaluator, Cruise Cost Calculator, and Compare.',
        'Added a Continue where you left off section to the homepage showing the last three calculator sessions.',
        'Added reload links so saved calculator state can be restored from recent sessions without backend storage.',
      ],
    },
    {
      version: 'v1.21.0',
      date: '2026-04-19',
      changes: [
        'Added a Costs people forget section to the Cruise Cost Calculator.',
        'Added quick-add buttons for gratuities, parking, hotel, excursions, and onboard miscellaneous spend.',
        'Highlighted $0 forgotten-cost categories so missing budget items are harder to ignore.',
      ],
    },
    {
      version: 'v1.20.0',
      date: '2026-04-19',
      changes: [
        'Added a slim persistent top banner warning that most people underestimate cruise cost by 30-60%.',
        'Added localStorage dismissal so the banner stays hidden after users dismiss it.',
        'Styled the banner to fit the dark theme without taking over the page.',
      ],
    },
    {
      version: 'v1.19.0',
      date: '2026-04-19',
      changes: [
        'Added the Trip Snapshot page at /snapshot as a consolidated final-answer dashboard.',
        'Reused existing calculator and dining strategy logic for cost, deal, upgrade, dining, driver, and quick-win outputs.',
        'Added Snapshot to navigation and stacked dashboard sections for fast review.',
      ],
    },
    {
      version: 'v1.18.0',
      date: '2026-04-19',
      changes: [
        'Added subtle CSS-only ocean texture, gradient overlays, and ship silhouette atmosphere to the dark theme.',
        'Added lightweight icon badges to tool cards and section headers without adding dependencies.',
        'Improved card hover states with slight lift, stronger border response, and subtle cyan glow.',
      ],
    },
    {
      version: 'v1.17.0',
      date: '2026-04-19',
      changes: [
        'Added Dining Strategy insights to Dining Explorer based on ship class and dining mix.',
        'Added simple dining package guidance using specialty venue count, complimentary depth, and caveat-heavy profiles.',
        'Kept the strategy logic lightweight so Dining Explorer stays a planning aid instead of pretending to be a restaurant oracle.',
      ],
    },
    {
      version: 'v1.16.0',
      date: '2026-04-19',
      changes: [
        'Added Brutal Summary cards to Deal Evaluator, Cruise Cost Calculator, and Compare.',
        'Added blunt shareable summary lines with copy summary and copy link actions.',
        'Added screenshot-friendly styling for the final summary cards without adding backend storage.',
      ],
    },
    {
      version: 'v1.15.0',
      date: '2026-04-19',
      changes: [
        'Added contextual coaching callouts across the major calculators and Compare page.',
        'Added short opinionated messages for add-on pressure, premium nightly cost, weak package value, WiFi overbuying, and scenario cost gaps.',
        'Kept coaching blocks limited to one concise message per page so the UI stays useful instead of shouty.',
      ],
    },
    {
      version: 'v1.14.0',
      date: '2026-04-19',
      changes: [
        'Added smart preset buttons to Cruise Cost Calculator, Deal Evaluator, and Drink Package Calculator.',
        'Standardized presets around Couple, Family, Budget traveler, and Vacation mode trip profiles.',
        'Made preset selection visible while clearing it after manual edits so user changes are not treated as locked presets.',
      ],
    },
    {
      version: 'v1.13.0',
      date: '2026-04-19',
      changes: [
        'Added Guided Mode at /start and /guided to walk users through cruise planning decisions step by step.',
        'Reused existing calculator logic for deal, cost, drink package, WiFi, The Key, and scenario comparison results.',
        'Added a final guided summary with total cost, verdict, biggest cost drivers, and suggested cuts.',
      ],
    },
    {
      version: 'v1.12.0',
      date: '2026-04-19',
      changes: [
        'Added Copy summary and Copy link actions to Deal Evaluator, Cruise Cost Calculator, and Compare.',
        'Standardized share summaries with short verdict, cost, driver, and site-link text.',
        'Kept Compare share links dynamic so copied links can restore the two scenarios from the URL.',
      ],
    },
    {
      version: 'v1.11.1',
      date: '2026-04-19',
      changes: [
        'Rewrote the homepage hero around avoiding cruise overpayment.',
        'Added a compact Where people get burned section for common package and fare traps.',
        'Tightened homepage card descriptions and CTA wording so the page explains the value faster.',
      ],
    },
    {
      version: 'v1.11.0',
      date: '2026-04-19',
      changes: [
        'Refactored the homepage around a guided decision flow instead of a flat tool list.',
        'Added a lightweight sitewide decision progress indicator for deal, cost, upgrade, and compare steps.',
        'Added next-step CTA blocks across the core calculators so each tool points to the next practical decision.',
      ],
    },
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
