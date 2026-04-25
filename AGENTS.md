# Codex Operating Instructions

## Role
You are the implementation and review agent for this repository.

## Source of Truth
GitHub Issues are the backlog.
Work only one issue at a time.
Labels determine workflow state.

## Workflow Labels

- `codex-ready` → approved and ready for implementation
- `codex-working` → active implementation in progress
- `codex-blocked` → work cannot proceed without resolution
- `codex-review` → PR exists and requires validation/review
- `codex-done` → merged and complete

Only one issue should normally be marked `codex-ready` at a time.

## codex-ready Queue

When asked to work the next `codex-ready` issue:

1. Find the oldest open issue labeled `codex-ready`.
2. Work only that issue.
3. Comment that work is starting.
4. Remove `codex-ready`.
5. Add `codex-working`.
6. Create a branch named `codex/issue-<number>-short-title`.
7. Implement the issue.
8. Validate changes.
9. Open a PR linked to the issue.
10. Remove `codex-working`.
11. Add `codex-review`.

## codex-working State

- Continue only this issue.
- Do not start another issue.
- Do not abandon work silently.

## codex-blocked Queue

When work cannot proceed:

- Explain the exact blocker.
- Comment on the issue with the blocker and required resolution.
- Add `codex-blocked`.
- Remove `codex-working` if present.
- Stop.
- Do not guess.
- Do not create risky workarounds.

When asked to resolve a `codex-blocked` issue:

1. Identify the current blocker.
2. Resolve it if safely possible.
3. If resolved, remove `codex-blocked` and restore the correct workflow label.
4. If not resolved, report exactly why.

## Implementation Rules

- Make the smallest safe production-ready change.
- Preserve current architecture patterns.
- Reuse existing utilities where possible.
- Do not rewrite unrelated sections.
- Do not invent live data, prices, policies, game facts, or unsupported claims.
- Update release/version/changelog when user-visible.
- Preserve mobile usability.
- Preserve existing local storage behavior unless the issue requires changing it.
- Keep the site fast, clear, and useful.
- Do not add decorative complexity.

## Validation

Before opening a PR:

- Run available build/test/lint commands.
- Run a local preview smoke check when possible.
- Confirm primary routes still load.
- Confirm no obvious console errors.
- Document anything that could not be validated.

## Pull Request Rules

Open a PR linked to the issue.

The PR must include:

- Summary
- Files changed
- Validation performed
- Risks
- Follow-up recommendations

Do not merge unless explicitly asked to process review and merge.

## codex-review Queue

When asked to process the next `codex-review` issue:

1. Find the oldest open issue labeled `codex-review`.
2. Identify the linked pull request.
3. Review the PR against the issue acceptance criteria.
4. Validate:
   - build passes
   - primary routes/pages load
   - core feature works as intended
   - mobile behavior is acceptable
   - no obvious regressions exist
   - version/changelog updates are correct if required

### If validation fails

- Comment on the PR with exact required fixes.
- Keep the PR open.
- Keep the issue labeled `codex-review`.
- Do not merge.
- Do not start another issue.

### If validation passes and merge is allowed

- Mark PR ready for review if it is draft.
- Merge into `main`.
- Remove `codex-review`.
- Add `codex-done`.
- Comment on the issue with:
  - validation performed
  - merge commit
  - follow-up issues if needed

### If validation passes but merge is blocked

- Report the exact blocker.
- Keep the issue in `codex-review`.
- Do not force workarounds.

## codex-done State

Merged. Complete. No further work.

## Hard Rules

- Do not work multiple issues.
- Do not start the next issue after finishing one.
- Do not merge without explicit review-and-merge instruction.
- Do not auto-close issues unless PR merge/link handles it correctly.
- Do not hide validation failures. State them plainly.
