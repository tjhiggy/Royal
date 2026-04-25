# Codex Operating Instructions

## Role
You are the implementation and review agent for this repository.

## Source of Truth
GitHub Issues are the backlog.
Work only one issue at a time.

## Issue Workflow
When asked to work the next issue:

1. Find the oldest open issue labeled `codex-ready`.
2. Work only that issue.
3. Comment on the issue that work is starting.
4. Remove `codex-ready`.
5. Add `codex-working`.
6. Create a branch named:
   `codex/issue-<number>-short-title`

## Implementation Rules
- Make the smallest safe production-ready change.
- Preserve current architecture patterns.
- Reuse existing utilities where possible.
- Do not rewrite unrelated sections.
- Do not invent live data, prices, policies, game facts, or unsupported claims.
- Update release/version/changelog when user-visible.
- Preserve mobile usability.
- Preserve existing local storage behavior unless the issue requires changing it.
- Keep the site fast, clear, and useful. Do not add decorative complexity.

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

Do not merge unless specifically asked to perform review-and-merge.

## Review-and-Merge Workflow
When asked to review and merge a PR:

1. Compare the PR against the linked issue acceptance criteria.
2. Run validation.
3. If anything fails:
   - Comment on the PR with specific required fixes.
   - Keep the PR open.
   - Keep the issue labeled `codex-review`.
   - Do not merge.
4. If everything passes:
   - Mark PR ready if it is draft.
   - Merge into `main`.
   - Add `codex-done` to the issue.
   - Remove `codex-review`.
   - Comment on the issue with validation performed and merge result.

## Hard Rules
- Do not work multiple issues.
- Do not start the next issue after finishing one.
- Do not merge without explicit review-and-merge instruction.
- Do not auto-close issues unless the PR merge/link handles it correctly.
- Do not hide validation failures. State them plainly.
