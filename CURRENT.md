# Current state

## Stepper modernization — review branch

Active branch `refactor/base-ui-stepper`, PR #47. The final refinement from `b77468d` through `7dd530a` consolidates navigation and step lookup, reduces Trigger subscriptions, and rejects stale guard or onboarding actions after human interruption. The follow-up keeps mounted implicit steps in order when their metadata changes and gives distinct step values distinct accessibility IDs.

The registry declares its `cn` dependency and requires Node.js 22 or newer. The app retains the compatibility re-exports. The UI SDK experiment stays in the onboarding lab. The app owns validation and final confirmation.

Read [DESIGN.md](./DESIGN.md) for the approved behavior and [modernization notes](./docs/stepper-next.md) for the comparison, validation and open checks. The refinement is in review. A merge or release requires explicit owner approval.

The lightweight MDS bridge was initialized and checked in the authorized local workspace. [AGENTS.md](./AGENTS.md) records how to consult it where available. Its generated files and pin are local.
