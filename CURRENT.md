# Current state

## Stepper modernization — review branch

Active branch: `refactor/base-ui-stepper`. Review: draft PR #47. The approved UI baseline is `d9f6b22`. The final pass covers class merging, the connector's first transition, RTL keyboard navigation, reduced motion, and the UI SDK onboarding lab.

The registry declares its `cn` dependency and requires Node.js 22 or newer. The app retains the compatibility re-exports. The UI SDK experiment stays in the onboarding lab. The app owns validation and final confirmation.

Read [DESIGN.md](./DESIGN.md) for the approved behavior and [modernization notes](./docs/stepper-next.md) for validation and open checks. Keep the PR in draft for the owner's visual review. A merge or release requires owner approval.

The lightweight MDS bridge was initialized and checked in the authorized local workspace. [AGENTS.md](./AGENTS.md) records how to consult it where available. Its generated files and pin are local.
