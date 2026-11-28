# Stepper V2 performance attribution in Codex Cloud

Navigation and field edits have different costs. In steady 30-step navigation, the inherited progress cursor increases style work before the first frame and across the animation. For field edits, changes in the consumer's callback or child elements trigger React work even when the selected step stays fixed. The study adds a benchmark and evidence to PR #48.

## Baseline reviewed

The competitive study compared V2 and the historical Stepper with Ark, Dice, Stepperize and native React. With the shared application gate, the V2 and historical mobile-emulated release medians were 14.3 and 14.2 ms. The separate guard probe did not reproduce the exploratory 5.2 ms regression. The retained V2 CPU profile aggregates attributed 373 ms of median sampled leaf time per round to React DOM, 68 ms to `cn`, 39 ms to Stepper source, and 13 ms to Base UI. These totals covered startup and multiple interactions. The historical React profiler recorded 22.6 ms of median subtree work per V2 cycle, 23.0 for the historical core, and 7.1 for native. Those Windows results used simplified CSS. The original CPU trace files are absent from the checkout. [Competitive report and retained data](competitive-validation.md)

The earlier native fast-path study yielded no consistent speedup. The reactive split bundled callback separation and cursor relocation, and recorded a worse throttled median in its run. Those results motivated one-factor comparisons of actual composition, consumer changes and CSS here. [Earlier V2 studies](../../docs/stepper-next.md#v2-release-review)

At the tested revision, `StepperElement` skips Base UI composition for its default button/div but keeps the `useRender` hooks in order. `StepperItem`, `StepperContent` and navigation subscribe to the root context. Trigger and visual descendants also read item context. Changing `onValueChange` recreates `setValue` and the dependent contexts. On step changes the connector hook updates a render-phase cursor in the root. The connector's registered `--stepper-progress` property inherits through the root and retargets in CSS. [Core source](../../components/ui/stepper.tsx)

## Protocol

- One Codex Cloud workspace and one process running benchmarks sequentially. Each block runs all its variants in fresh browser contexts, rotates their order, and alternates whether edits or navigation run first. Each round warms one forward/back cycle and alphabetic insert/delete pair, then measures two cycles and two insert/delete pairs. Timings use real trusted Chromium events dispatched by Playwright in a 1280 × 900 desktop viewport. The main pass uses CDP 4× CPU slowdown. All comparisons below are within their named block series.
- All cells compile the actual primitive and fixture classes with Tailwind CSS 4.2.4 and Stepper's app color tokens. The lightweight native control has equivalent form, persistent navigation, count and scroll geometry and implements the measured keyboard/ARIA contract. It has a static connector and fewer component responsibilities. Within Stepper, a stable `render={<button />}` on each Trigger tests Base UI's element cloning/merging with the same host tag, semantics and classes as the default. Panels and navigation retain their default hosts.
- The consumer owns the active step and the draft. Every keystroke changes the controlled field and leaves the current step at zero. Every navigation commit checks active trigger, ARIA panel linkage, one visible panel and draft retention. The baseline has fixed explicit steps, stable consumer callback and stable elements across parent updates. The changing callback arm wraps the same setter in a new function each render. The rebuilt-children arm holds the callback stable and recreates the child tree. The field-local arm keeps the field state in its own mounted component and preserves the draft when hidden.
- Event-to-commit starts at `click.timeStamp` or `keydown.timeStamp` and ends in the expected owner or field layout effect. Event-to-next-paint uses Chromium's unrounded trace EventTiming after checking for an aligned compositor presentation timestamp, a commit before presentation and no fallback. Input delay is event start to handler processing start. Presentation delay starts at the end of click processing, or at the end of the keydown/keypress sequence that produced the edit, and ends at Chromium's frame presentation. The click input delay can include pointer dispatch/focus work ahead of click processing.
- CDP scripting, layout, style and task counters bracket the dispatched event and its 180 ms observation period. Trace style/layout/paint work uses a fixed 180 ms window from the event timestamp and can include work after the first visible response. Long tasks come from Chromium's Long Tasks API (50 ms threshold) overlapping the event window or startup. Startup is a cold browser context loading prebuilt assets from an in-memory loopback HTTP server. Measure navigation-to-first React commit and FCP independently. Startup excludes real network and hydration.
- Component work comes from a separate production profiling build. Benchmark-only function counters include render retries; React DevTools' Components track gives inclusive subtree timings where entries are emitted. Inclusive times overlap and small components can have no track entry. App `actualDuration` and commit counts come from a single top-level React Profiler boundary. Use production timing results for latency. None of these controlled timings is a field INP or physical device measurement.

After the pilot, the runner completed 220 production timing rounds with 1,616 observations, 80 React profiling rounds and 16 CPU sampling rounds. Every round passed the fixture's state checks. Trace validation confirmed 1,601 presentations. The other 15 lacked an aligned presentation marker, retained their commit samples, and were excluded from paint and presentation-delay statistics. The timing series recorded 397 long tasks overlapping startup and four overlapping navigation, with zero on edits. The checked-in design contract applies in this workspace. The private MDS bridge was unavailable.

## Environment and resolved software

| Setting | Observed |
| --- | --- |
| Platform | Codex Cloud, Debian 13.7 x86-64, Linux 6.18.57 |
| CPU | AMD EPYC 9V74 80-Core Processor, 3 visible logical CPUs on cpuset 0–2, Node available parallelism 2 |
| CPU quota | `cpu.max = 200000 100000`, equivalent to 2 CPUs. CPU throttling counters are retained for each pass. |
| Memory | 8 GiB cgroup limit, 10,452,459,520 bytes visible to Node |
| Runtime and tools | Node 24.22.3, npm 11.19.1, headless system Chromium 156.0.8078.79, Playwright 1.65.1, esbuild 0.28.1 |
| Dependencies | Base UI React 1.4.1 / utils 0.2.8 and 1.9.0 / utils 0.5.0. React + React DOM 19.2.5 / scheduler 0.27.0 and 19.3.1 / scheduler 0.28.0. Tailwind CSS + CLI 4.2.4 and `cn` 0.5.2 throughout. |

The tested core is `5b7843522504cc2f8f561ebe513a76d9fcba5968`. The fixture's [isolated npm lock](attribution/package-lock.json) pins the complete dependency tree and the results record the actual packages included in each bundle. The app lock resolves Base UI 1.4.1 and React 19.2.5. The historical competitive lock resolves Base UI 1.9.0. The registry's stable npm tags returned React and React DOM 19.3.1 on November 28, 2026. Both renderers were verified in-browser and 19.3.1 fits the Base UI and Next.js React peer ranges. The project app was verified with its existing frozen lock.

## Dependency and host composition results

Three steps, reduced motion, 4× CPU slowdown, seven counterbalanced blocks. Each forward and Back cell is median / p90 in ms. The native 19.2.5 paint cells have 12 forward and 13 Back samples. The other cells have 14 samples per direction.

| Cell | Forward commit | Forward next paint | Back commit | Back next paint | Startup commit | Startup FCP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Native, React 19.2.5 | 9.0 / 11.3 | 16.0 / 20.5 | 9.5 / 12.9 | 20.3 / 32.7 | 390 / 450 | 440 / 536 |
| Native, React 19.3.1 | 8.8 / 13.2 | 17.1 / 19.9 | 9.5 / 11.0 | 18.6 / 20.3 | 472 / 549 | 524 / 608 |
| Default host, Base 1.4.1 | 13.1 / 16.3 | 23.0 / 24.3 | 12.9 / 16.0 | 23.9 / 30.6 | 436 / 459 | 492 / 520 |
| Default host, Base 1.9.0 | 12.8 / 16.1 | 21.1 / 26.7 | 11.9 / 14.2 | 23.0 / 26.9 | 417 / 539 | 484 / 596 |
| Custom host, Base 1.4.1 | 11.5 / 15.8 | 20.1 / 26.4 | 12.8 / 15.4 | 26.0 / 34.3 | 484 / 549 | 528 / 616 |
| Custom host, Base 1.9.0 | 13.0 / 19.0 | 22.1 / 30.2 | 14.1 / 16.7 | 25.7 / 31.1 | 461 / 568 | 524 / 684 |
| Custom host, Base 1.9.0, React 19.3.1 | 13.1 / 17.1 | 22.5 / 27.6 | 13.8 / 18.0 | 25.0 / 33.6 | 473 / 521 | 528 / 564 |

Base UI 1.9.0 moved the custom host's paired forward paint median by +1.6 ms, higher in six of seven blocks. The default host moved −1.3 ms and improved in four of seven. The results give little reason to change versions for interaction speed. At Base 1.4.1, custom composition moved forward paint by −1.3 ms and improved in four of seven blocks. Back's aggregate custom median was 2.1 ms higher. The working hypothesis that Base UI composition dominates routine navigation did not hold in this fixture.

React 19.3.1 moved paired forward paint by +0.3 ms on both native and composed Stepper. Native startup commit was 54 ms later at the paired median and later in six of seven blocks, while the composed Stepper median moved +14 ms and was later in four. Gzip rose by 8,733 B on native and 8,744 B on composed Stepper, alongside the scheduler change. Base UI alone reduced the isolated client build by 155 B gzip. Treat the React bundle growth as a reproducible input to a route-level startup study. The cold timings vary with the control and measure a client-only load in Cloud.

The separate React pass recorded two Trigger calls per forward update with both hosts. On Base UI 1.4.1, median app render time was 3.45 ms for the default host and 3.80 ms for the custom host. This small profiling difference does not explain the variable interaction timings.

### Upstream review

Base UI's trigger-mount and inactive-trigger improvements concern popup state, and its large-list improvements concern Menu, Select and Combobox collection/subscription paths. Stepper calls the standalone `useRender` hook. The lazy render-element props and refs fix is directly relevant to composition compatibility when consumers pass a Server Component element. The tested custom host is a plain button. Assess 1.9.0 as a compatibility update with installed consumer parity checks. [Popup mounting](https://github.com/mui/base-ui/pull/5426) · [Inactive triggers](https://github.com/mui/base-ui/pull/5865) · [Large lists](https://github.com/mui/base-ui/pull/5819) · [Lazy render elements](https://github.com/mui/base-ui/pull/5562)

React 19.3 added View Transitions and changed transition scheduling. This fixture runs synchronous controlled state. React 19.3.1's listed change concerns the Server Components transport. Keep React Compiler as an optional consumer benchmark after profiling real subscription and prop churn. [React 19.3.0](https://github.com/react/react/releases/tag/v19.3.0) · [React 19.3.1](https://github.com/react/react/releases/tag/v19.3.1) · [React performance tracks](https://react.dev/reference/dev-tools/react-performance-tracks)

## Scaling from 3 to 10 to 30 steps

Reduced motion, six counterbalanced 4× blocks. Each interaction timing is median / p90 in ms. Forward scripting is the median CDP window. Style is the median traced style work across the 180 ms window.

| Cell | Forward commit | Forward next paint | Forward scripting | Forward style | Back next paint | Edit next paint |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Native 3 | 9.8 / 12.1 | 17.5 / 22.5 | 4.7 | 1.7 | 19.5 / 23.0 | 12.4 / 16.5 |
| Native 10 | 10.8 / 14.4 | 18.5 / 23.2 | 4.4 | 1.6 | 23.4 / 31.0 | 12.7 / 14.9 |
| Native 30 | 13.1 / 19.6 | 22.9 / 32.5 | 7.0 | 2.3 | 24.9 / 30.6 | 12.7 / 20.5 |
| Stepper 3 | 13.8 / 19.2 | 25.3 / 30.1 | 6.5 | 3.7 | 25.9 / 32.3 | 12.9 / 16.3 |
| Stepper 10 | 14.1 / 18.9 | 27.8 / 35.0 | 7.3 | 4.9 | 29.2 / 38.2 | 13.0 / 15.2 |
| Stepper 30 | 17.2 / 29.7 | 38.1 / 51.5 | 9.6 | 11.0 | 40.7 / 44.6 | 14.4 / 17.0 |

The paired forward-paint change from 3 to 30 steps was +12.4 ms for Stepper and +5.5 ms for native, higher in all six blocks for both. Stepper's paired commit grew +3.1 ms and its paired scripting grew +3.5 ms. Median input delay moved from 8.9 to 10.0 ms and median presentation delay from 9.7 to 19.7 ms. Native also grew with the size of the list. Stepper's excess grows mainly after event processing in this experiment. Stepper's forward window had one long task at 30 and its Back window had one at 10. Stable field edits stayed near the native floor across counts.

The React pass recorded 3, 10 and 30 `StepperItem` and `StepperContent` calls per forward update, matching their instance counts. `StepperTrigger` stayed at two calls at all counts. The root ran twice in one commit, consistent with the render-phase cursor update. At 30 the profile showed 6.1 / 9.4 ms of app render work, including a median 3.6 ms of inclusive Item spans. Native 30 recorded 3.9 / 6.6 ms in its app boundary.

## Field edits with the active step held constant

Reduced motion, seven counterbalanced 4× blocks, 28 edits per cell. Each timing is median / p90 in ms.

| Cell | Edit commit | Edit next paint | Edit scripting |
| --- | ---: | ---: | ---: |
| Native 30 | 7.0 / 8.9 | 12.6 / 14.5 | 3.2 / 4.4 |
| Stepper 3, stable callbacks and children | 7.0 / 8.6 | 11.9 / 15.1 | 3.6 / 5.2 |
| Stepper 3, changing callback | 8.0 / 9.7 | 13.5 / 16.3 | 4.9 / 6.5 |
| Stepper 30, stable callbacks and children | 8.2 / 10.5 | 15.8 / 19.9 | 4.6 / 6.6 |
| Stepper 30, changing callback | 12.0 / 16.4 | 19.3 / 24.5 | 8.5 / 13.0 |
| Stepper 30, rebuilt children | 12.5 / 15.4 | 20.1 / 23.7 | 8.6 / 11.2 |
| Stepper 30, field-local state | 6.2 / 8.2 | 13.5 / 16.7 | 2.7 / 3.9 |

At 30 steps the changing callback added 4.2 ms to paired edit commit and 3.8 ms to scripting, higher in all seven blocks. Rebuilding children with the stable callback added 4.7 ms to commit and 3.7 ms to scripting. Field-local state cut paired commit by 2.1 ms and scripting by 1.4 ms in all seven blocks versus stable app-owned state. Effect sizes on presentation were noisier. Input delay stayed near 0.5–0.6 ms at the median and the style window stayed near zero for edits. No edit recorded a long task in this series.

Four separate 4× profiling blocks recorded these median counts per edit and median / p90 app render work. Each edit committed once.

| 30-step cell | App render, ms | Root calls | Item calls | Trigger calls | Content calls | Item track, median ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Stable callback and children | 1.0 / 1.9 | 1 | 0 | 0 | 0 | 0 |
| Changing callback | 6.55 / 7.8 | 1 | 30 | 30 | 30 | 5.8 |
| Rebuilt children with stable callback | 5.1 / 7.9 | 1 | 30 | 30 | 30 | 4.1 |
| Field-local state | 0.1 / 0.8 | 0 | 0 | 0 | 0 | 0 |

The field-local and lifted-state variants both keep the first panel mounted and retain the draft. Stepper's example and intent onboarding currently call full-form `useWatch` above Stepper and pass inline value handlers. They also derive workflow and validation state in the owner. A real-route experiment should subscribe to the fields each section needs, keep the navigation handler stable where its semantics allow it, and retain the subscriptions that change eligibility or step order. [Workflow example](../../components/stepper-examples.tsx#L418) · [Intent onboarding](../../components/stepper-intent-onboarding.tsx#L213)

At 1×, the four-block follow-up reproduced the callback effect on commit and scripting in every block. Median edit commit went from 1.8 to 2.9 ms with a changing callback and to 1.5 ms with field-local state. Median scripting was 0.8, 2.0 and 0.7 ms, respectively. Paint tails were variable with eight edits per cell.

### Focused CPU sampling

The separate 4× CPU pass sampled production code every 250 μs and mapped leaf frames to bundle sources. It counted samples between the trusted event and the expected commit. Each cell had 16 edits. Counts are descriptive because Chrome may schedule samples unevenly.

| 30-step cell | React DOM | Stepper source | `cn` | Base UI and utils | Chrome program |
| --- | ---: | ---: | ---: | ---: | ---: |
| Native | 49 | 0 | 0 | 0 | 97 |
| Stable Stepper | 52 | 5 | 2 | 0 | 120 |
| Changing callback | 176 | 38 | 1 | 4 | 123 |
| Field-local state | 54 | 0 | 0 | 0 | 118 |

React DOM was the largest mapped JavaScript source and accounted for most of the extra mapped samples in the changing-callback edit path. On forward navigation with stable Stepper the same pass recorded 97 React DOM and 19 Stepper leaf samples. Warming the fixture and isolating edits gives little support for a class-merge or Base UI rewrite to address this case.

## Tailwind motion and browser work

The motion pass used the same generated Tailwind CSS and Stepper JS in both preference settings. The runner checked the computed transition property and observed the registered cursor's transition events under normal motion. Reduced motion produced no cursor transition events. Five counterbalanced 4× blocks, ten samples per direction before trace exclusions.

| Stepper cell | Forward commit | Forward next paint | Back next paint | Forward style window | Style work after forward paint |
| --- | ---: | ---: | ---: | ---: | ---: |
| 3, reduced | 13.8 / 17.6 | 23.4 / 32.7 | 24.6 / 32.8 | 4.2 / 5.0 | 0.0 / 0.0 |
| 3, motion | 12.3 / 17.3 | 29.3 / 39.1 | 41.7 / 47.6 | 68.1 / 96.1 | 62.5 / 85.1 |
| 30, reduced | 18.5 / 22.1 | 39.2 / 43.5 | 40.1 / 41.5 | 10.6 / 12.6 | 0.0 / 0.0 |
| 30, motion | 20.4 / 21.9 | 42.7 / 50.4 | 44.9 / 49.5 | 125.2 / 132.9 | 116.3 / 125.4 |

Forward paint rose in all five paired blocks for both counts. The median paired changes were +9.3 ms at 3 and +3.0 ms at 30. The cursor keeps the renderer busy after the first frame. At 30, CDP recalc style rose from 10.8 to 140.4 ms across the full bracket and layout remained about 1.7–1.9 ms. There were zero interaction long tasks in the motion block. Total style work across successive frames and the 50 ms single-task threshold measure different things.

### Isolating the progress cursor

The 30-step follow-up kept the same React and Stepper code and added one CSS override per diagnostic. In reduced motion, a frozen cursor holds the inherited custom property at zero while the controlled step, active ARIA marker and visible panel still update. With normal motion, an instant cursor removes the root transition and continues to update the fill and the other CSS transitions. The runner verified the computed override and expected panel. The frozen and instant variants intentionally differ in the connector display.

| 30-step cell, 4× | Forward commit | Forward next paint | Forward style window | Style work after forward paint |
| --- | ---: | ---: | ---: | ---: |
| Reduced motion | 20.0 / 24.5 | 37.0 / 68.2 | 11.1 / 13.4 | 0.0 / 0.0 |
| Frozen cursor, reduced motion | 15.5 / 21.5 | 25.6 / 33.5 | 3.7 / 5.0 | 0.0 / 0.0 |
| Normal motion | 16.9 / 20.1 | 39.0 / 51.5 | 130.9 / 137.3 | 120.7 / 127.6 |
| Instant cursor, other transitions enabled | 17.5 / 21.2 | 42.0 / 56.3 | 32.6 / 41.0 | 17.6 / 25.3 |

Freezing the cursor brought forward paint down by 13.7 ms and style work down by 7.1 ms at the paired median, both lower in all five blocks. Replacing its animation with an instant update cut paired post-paint style work by 102.3 ms, lower in all five, and did not improve the first forward paint. The cursor accounts for a substantial share of style work even with reduced motion, and its transition drives most of the later work under normal motion. These CSS overrides are diagnostic controls. An optimization needs to retain the fill, forward/reverse continuity and reduced-motion behavior.

The same cursor series at 1× used four blocks with one event per direction in each block. Freezing reduced forward style work from 2.1 to 0.7 ms at the median. Forward paint stayed near 9.7–9.8 ms. With normal motion, the instant override reduced median post-paint style work from 58.2 to 4.9 ms. Median forward paint was 15.6 ms with motion and 16.9 ms with the instant override. The limited unthrottled pass supports the recurring style cost and gives no evidence of a faster first paint from removing the transition.

## Implementation decision and next measurements

1. Start with the consumer's subscription boundaries. The isolated edits support stable navigation callback and child identities, and keeping unrelated field updates below the progress UI. Compare a real flow before and after targeted subscriptions. Verify the same field errors, eligibility, step order and draft behavior. React Compiler can be a separate, optional consumer comparison against that baseline.
2. For long flows, measure whether the progress rail can limit style invalidation during cursor changes. Include normal and reduced motion, adjacent and long jumps, a reversal before the animation completes, keyboard focus and a realistically populated panel. Use the same initial paint and post-paint windows. The frozen and instant overrides establish where the work comes from and change the approved connector. The evidence supports retaining the distributed core.
3. Evaluate Base UI and React version updates for compatibility and startup on an installed production route. The version and composition switches did not produce a consistent interaction speedup in three steps. The React bundle change and the variable cold-start findings justify a matched route-load check with actual assets and hydration before drawing a startup conclusion.

The fixture controls which fields re-render and uses only the first adjacent pair in each step count. It holds explicit registration, host composition on Trigger, a simple panel and a single horizontal LTR layout. The timing data cover settled cycles with no server guard or routing. A real consumer may have heavier validation, a more expensive panel, more retained content or overlapping inputs while the connector is animating. Those surfaces and physical devices remain open.

Local verification with the app's frozen lock passed `pnpm check` (registry, lint, TypeScript, 102 tests and production build), `pnpm benchmark` and the two existing protocol tests. The isolated lock also replayed with `npm ci`. The app lock, historical benchmark lock and results, registry and Stepper source matched the starting revision.

## Reproduction

From the repository root, install the isolated lock and point Playwright at a local Chromium. Use the same browser and host for comparisons. The runner records package versions, bundle sizes, CPU counters, per-round samples and summaries in `attribution/results/`. Each command replaces its own suite/mode/CPU output. The suites run sequentially.

```sh
cd benchmarks/browser/attribution
npm ci --ignore-scripts --no-audit --no-fund
export STEPPER_CHROMIUM_EXECUTABLE=/usr/bin/chromium
node run.mjs --suite pilot --cycles 1
for suite in deps scale consumer motion; do node run.mjs --suite "$suite" || exit; done
for suite in deps scale consumer; do node run.mjs --suite "$suite" --mode react || exit; done
node run.mjs --suite forms-30 --mode cpu --rounds 4
node run.mjs --suite cursor
node run.mjs --suite cursor --cpu 1 --rounds 4 --cycles 1
node run.mjs --suite forms-30 --cpu 1 --rounds 4 --cycles 1
```

The [archived round data](results/2026-11-28-cloud-attribution.json.gz) contain a `runs` array with variant configurations, raw samples, medians and nearest-rank p90s. The exploratory pilot was used for instrumentation checks. The archive contains the comparison passes.

```sh
gzip -dc ../results/2026-11-28-cloud-attribution.json.gz |
  jq '.runs[] | select(.suite == "consumer" and .mode == "timing") | .variants["changing-30"].summary.edit'
```
