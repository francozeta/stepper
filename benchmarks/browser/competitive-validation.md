# Competitive validation for Stepper V2

This study compares the Stepper core at `8de8d6c`, the earlier Stepper at `5cd44a9`, Stepperize React 8.0.0, Ark UI React 5.40.0, Dice UI Base at `391f1ef1`, and a minimal native React implementation. All run React 19.2.5 with the committed [dependency lock](package-lock.json). See the [reproduction commands](README.md#final-competitive-protocol).

Captured data from November 28 on Node 22.23.5 and Chromium 156.0.8078.4: [production timing](results/2026-11-28-competitive-timing.json), [CPU attribution](results/2026-11-28-competitive-cpu.json), [original guard-path probe](results/2026-11-28-competitive-guard.json), [React rendering](results/2026-11-28-competitive-react.json) and [settled keyboard audit](results/2026-11-28-competitive-audit.json).

## What the fixture holds constant

One controlled onboarding form collects a business name, currency and payment preference, then requires human confirmation. The application owns fields, eligibility, draft retention and the simulated asynchronous decision. The same gate rejects invalid input and discards an old answer after Back. The libraries supply progress, interactive labels, panels and navigation controls. Dice runs the shared gate via its `onValidate` callback. The other primary adapters apply it to controlled navigation requests. The focused Stepper probe also uses the original `onBeforeNext` path.

Each implementation uses the same content, simple CSS, reduced-motion preference, accessible names for fields and two viewports. The mobile profile uses a 390 × 844 touch viewport and 4× Chrome CPU slowdown. Every round uses a fresh browser context. It measures startup and the first navigation separately from two warm cycles. Each variant takes each position twice per profile, with a reversed order on the second pass. The observer records click or guard release to the app layout effect. The runner verifies the actual visible panel afterward. Chrome metrics bracket each event with visibility reads outside that window.

The experiment measures local file loading and browser execution on one Windows host. Browser and CPU emulation do not represent physical Safari, a real backend, network startup or field INP. The fixture uses a static shared connector and a horizontal LTR flow. The product's motion, remaining API features and complete assistive-technology behavior need their own evidence.

## Incremental client JavaScript

Each column is the difference from the matching native bundle, compressed with gzip at level 9. The shared app already imports `cn`. Timed variants use this shared app setting.

| Implementation | Plain app | App already using cn |
| --- | ---: | ---: |
| Native | 0 B | 0 B |
| Stepper V2 | 17,086 B | 5,921 B |
| Stepperize | 5,140 B | 5,290 B |
| Ark UI | 7,912 B | 8,100 B |
| Dice UI Base | 17,511 B | 6,349 B |

Native measured 61,753 B plain and 72,924 B with `cn`. The shared `cn` setting changes the relative order of Ark UI and Stepper. Stepperize adds the least JavaScript among the libraries in either bundle setup.

## Individual interactions

The production run completed 144 rounds with no failed flows. Each cell below gives median / p90 in milliseconds. Each implementation and profile has 12 cold, 24 warm and 12 interruption samples. All 144 interrupted validations discarded the stale answer, preserved the draft and allowed the user to reach the final confirmation.

| Implementation | Desktop warm release | Mobile first mount | Mobile cold release | Mobile warm release | Mobile warm Back | Mobile Back while pending |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Native | 1.2 / 1.6 | 570 / 797 | 13.5 / 18.9 | 9.0 / 10.9 | 5.3 / 7.5 | 4.6 / 5.7 |
| Earlier Stepper | 2.4 / 3.3 | 669 / 801 | 23.4 / 29.2 | 14.2 / 19.1 | 11.2 / 18.5 | 10.4 / 15.0 |
| Stepper V2 | 2.25 / 3.1 | 756 / 1,027 | 23.0 / 33.4 | 14.3 / 18.9 | 11.9 / 18.2 | 10.2 / 14.2 |
| Stepperize | 1.9 / 2.4 | 677 / 795 | 18.8 / 30.8 | 12.5 / 17.2 | 10.2 / 14.5 | 10.8 / 15.1 |
| Ark UI | 2.65 / 3.5 | 773 / 1,152 | 19.0 / 25.1 | 17.4 / 30.9 | 13.5 / 21.3 | 11.0 / 19.5 |
| Dice UI Base | 2.25 / 3.1 | 657 / 977 | 19.4 / 24.9 | 15.7 / 19.9 | 14.8 / 17.6 | 7.9 / 13.0 |

Stepperize also led Stepper V2 for warm Back. Dice led the library group for Back during pending validation. Ark beat Stepper on the first guarded release while taking longer on warm release. The native implementation is the floor for this workflow and includes its own focus and validation code.

## What the mobile profile isolated

With app-owned navigation, the earlier warm-release gap of 21.6 vs 26.8 ms did not recur. The earlier Stepper's two pass medians were 14.5 and 13.25 ms. V2's were 14.3 and 14.2 ms. On the primary V2 run, the warm-release CDP window recorded 13.7 ms of scripting, 1.3 ms of layout and 1.8 ms of style recalculation at the median. The older core recorded 13.8, 1.0 and 1.7 ms respectively.

The separate app-owned CPU profiling pass attributed a median 373 ms of sampled leaf time to React DOM, 68 ms to `cn`, 39 ms to the Stepper source and 13 ms to Base UI React per V2 round. Browser and automation frames accounted for about 447 ms, with additional time in Chrome's program category. This pass includes startup and a cold and two warm cycles, and its samples have profiling overhead. The same measurements for the earlier Stepper were 409, 77, 42 and 21 ms.

The focused `onBeforeNext` pass sampled six rounds per revision. With profiling enabled, warm release was 17.45 / 22.9 ms for the earlier core and 17.85 / 23.0 ms for V2. V2 reduced the median time to show the pending state from 19.15 to 14.8 ms in that probe. Chrome's warm-release scripting median was 17.2 ms before and 17.4 ms on V2, with layout at 1.8 and 1.6 ms. This more direct probe did not reproduce the earlier 5.2 ms median gap.

Mobile startup in the unprofiled run was 668.7 / 801.3 ms for the earlier Stepper and 755.9 / 1,026.8 ms for V2. Median script time through the first mounted panel was 574 and 643 ms. The separate CPU pass reversed the startup ordering, 612 vs 537 ms. This is a cold-start risk to track, with sizeable between-run variation and no isolated Stepper function responsible.

The production React profiling renderer recorded three commits per warm cycle at the median for all implementations. Render time sums `actualDuration` for the fixture's React subtree across pending, advance and Back. Each profiling result uses 12 warm cycles at 4× CPU. The remaining columns are median CDP times from the separate production run's warm-release window.

| Implementation | React render per cycle, median / p90 | Scripting | Layout | Style recalculation |
| --- | ---: | ---: | ---: | ---: |
| Native | 7.1 / 9.2 ms | 8.2 ms | 1.2 ms | 1.0 ms |
| Earlier Stepper | 23.0 / 25.0 ms | 13.8 ms | 1.0 ms | 1.7 ms |
| Stepper V2 | 22.6 / 26.7 ms | 13.7 ms | 1.3 ms | 1.8 ms |
| Stepperize | 18.2 / 29.4 ms | 12.2 ms | 1.2 ms | 1.0 ms |
| Ark UI | 26.1 / 35.4 ms | 16.2 ms | 1.3 ms | 2.2 ms |
| Dice UI Base | 32.4 / 38.1 ms | 16.1 ms | 0.5 ms | 0.5 ms |

Scripting dominated the measured release windows and React DOM was the largest attributable application-side category. Both Stepper implementations did comparable render work in the matched fixture. The profiles support retaining the existing Stepper architecture, full class merger and composition. The rejected reactive split remains in the [V3 record](results/2026-11-27-vercel-v3.json).

## Installation, composition and accessibility

| Implementation | Installation and ownership | Browser integration evidence |
| --- | --- | --- |
| Native | React and DOM only. The app writes the focus traversal, progress semantics and guard. | Ordered list. Button refs, events and markup are directly owned by the app. |
| Stepper V2 | The shadcn CLI copies one core file. Base Nova and Radix Nova with distinct aliases were verified separately. | Ordered list with movement of focus without selection. The fixture forwards its marker through Base UI `render` to the actual custom button. |
| Stepperize | Install `@stepperize/react`. The adapter uses `defineStepper`, the controlled ID and the supplied primitives. | The fixture sets `role="presentation"` on item wrappers. Without it, the fixture's rendered tablist reported required-parent, required-children and listitem violations in axe. Keyboard focus moves between steps. |
| Ark UI | Install `@ark-ui/react`. The fixture uses the Steps subpath and converts numeric steps at the application boundary. | Tablist. The fixture forwards a custom button through `asChild`. Its list adds the same arrow-focus handler used in the native control. The initial probe with the library's default handler left focus on the first step. |
| Dice UI Base | shadcn 4.8.2 installed `@diceui/stepper` in a configured Base Nova consumer. It created the stepper and direction files and used the consumer's Lucide library. Timing uses the pinned source revision listed above. | Tablist with Base UI `render`. The fixture selects manual activation and applies app validation via `onValidate`. |

The settled desktop audit reported zero axe violations in the adapted fixtures. Native, both Steppers, Ark's adapted list and Stepperize moved focus without requesting navigation on ArrowRight. At the pinned Dice revision, ArrowRight invoked validation even in manual mode once `onValidate` was supplied. Focus remained on the first step while validation was pending. Dice also started with Continue disabled until a form edit. Its empty-input rejection was exercised after filling and clearing the name. These are keyboard and initialization integration differences. They are outside the pointer timing samples above.

The pinned Dice source updated its active panel before the app accepted a request when the adapter used only `onValueChange`. Using the library's validation hook kept the current panel visible. Toggling the registered `completed` prop in the initial fixture also changed navigation order after Back. The measured adapter uses Dice's positional completion logic, which derives prior completion from the current value. These observations apply to the pinned integration. The live install and the timed source are separate checks.

Sources for the integration paths are the [Stepperize v8 primitives](https://www.stepperize.com/docs/v8/api/react/primitives), [Ark UI Steps](https://ark-ui.com/docs/components/steps), [Dice UI Base Stepper](https://diceui.com/docs/components/base/stepper), [pinned Dice source](https://github.com/sadmann7/diceui/blob/391f1ef1a015e34666b25aa00c07de4a80feeea1/docs/registry/bases/base/ui/stepper.tsx), and [Stepper's installed consumer evidence](../../docs/consumer-install.md).
