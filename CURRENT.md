# Current state

## V2 review — draft PR #48

The active branch is `refactor/reduction-pass`. The [consumer installation verifier](./docs/consumer-install.md) passed the three advertised items in Base Nova and Radix Nova with distinct component aliases. A separate Next.js production build using the installed primitive exercised keyboard, focus, async interruption and responsive behavior in Chromium and WebKit. The optional SDK lab exercised real local semantic actions and human interruption.

The [final competitive study](./benchmarks/browser/competitive-validation.md) completed 144 production rounds comparing Stepper V2, the historical core, Stepperize, Ark UI, Dice UI Base and native React. At 4× CPU slowdown, V2's warm release measured 14.3 ms median versus 14.2 ms for the historical Stepper with a shared app gate. Stepperize had the smallest incremental bundle among the libraries. Cold-start variation and the [earlier reasoning and rejected V3 experiment](./docs/stepper-next.md#v2-release-review) remain part of the review record. Physical devices, assistive technology and a live product backend remain open before broader adoption claims.

## Previous modernization review

Active branch `refactor/base-ui-stepper`, PR #47. The final refinement from `b77468d` through `7dd530a` consolidates navigation and step lookup, reduces Trigger subscriptions, and rejects stale guard or onboarding actions after human interruption. The follow-up keeps mounted implicit steps in order when their metadata changes and gives distinct step values distinct accessibility IDs.

The registry declares its `cn` dependency and requires Node.js 22 or newer. The app retains the compatibility re-exports. The UI SDK experiment stays in the onboarding lab. The app owns validation and final confirmation.

Read [DESIGN.md](./DESIGN.md) for the approved behavior and [modernization notes](./docs/stepper-next.md) for the comparison, validation and open checks. The refinement is in review. A merge or release requires explicit owner approval.

The lightweight MDS bridge was initialized and checked in the authorized local workspace. [AGENTS.md](./AGENTS.md) records how to consult it where available. Its generated files and pin are local.
