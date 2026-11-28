# Current state

## Reduction and comparison — draft PR #48

CI run 100 passed the full check and reproducible baseline benchmark; documented results and a noindex /drafts/benchmark study distinguish internal measurements from competitive documentation. Browser comparison run 1 failed at Playwright installation on Ubuntu 26.04, before any measurements. The opt-in browser workflow now targets Ubuntu 24.04 with seven-day artifact retention; the fix has not been rerun. A separate Vercel Sandbox run at 5cd44a9 completed all 40 checks; see benchmarks/browser/results/2026-11-27-vercel.json. Stepper has the largest bundle and trails Stepperize on the throttled profile; the native render fast path passed CI 105 (99 tests) and a second Vercel run (50/50 checks). Same-VM candidate medians improved directionally from 21.7 to 19.0 ms desktop and 89.6 to 81.9 ms throttled; bundle increased 26 gzip bytes. cn accounts for 26,840 minified bytes in the plain fixture. The synthetic shared-helper study now measures 6,056 incremental gzip bytes (vs 17,229 plain), with fitted tables saving 3,133 full-app gzip bytes. A legacy helper differs on logical inset merge output, so no default dependency migration. See benchmarks/browser/results/2026-11-27-cn-study.json. Results in benchmarks/browser/results/2026-11-27-vercel-v2.json. Reactive isolation candidate splits item visual data from navigation actions and localizes connector cursor retries; prior page lint error corrected. CI and same-run browser comparison pending. Real installed shadcn, real-agent, visual and physical-device validation remain pending. No merge or release.

## Stepper modernization — review branch

Active branch `refactor/base-ui-stepper`, PR #47. The final refinement from `b77468d` through `7dd530a` consolidates navigation and step lookup, reduces Trigger subscriptions, and rejects stale guard or onboarding actions after human interruption. The follow-up keeps mounted implicit steps in order when their metadata changes and gives distinct step values distinct accessibility IDs.

The registry declares its `cn` dependency and requires Node.js 22 or newer. The app retains the compatibility re-exports. The UI SDK experiment stays in the onboarding lab. The app owns validation and final confirmation.

Read [DESIGN.md](./DESIGN.md) for the approved behavior and [modernization notes](./docs/stepper-next.md) for the comparison, validation and open checks. The refinement is in review. A merge or release requires explicit owner approval.

The lightweight MDS bridge was initialized and checked in the authorized local workspace. [AGENTS.md](./AGENTS.md) records how to consult it where available. Its generated files and pin are local.
