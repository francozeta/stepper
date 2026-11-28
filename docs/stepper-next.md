# Stepper modernization — Phase 1

## Scope

Move the registry primitive from Radix Slot to Base UI useRender. Keep the
existing workflow contract, string step IDs, ordered-list progress semantics,
and shadcn registry namespace. The documentation site's existing Radix-based
components are not migrated in this phase. Keep legacy asChild temporarily;
new code should prefer render, with nativeButton=false for links.

## Validation gates

Initial CI: registry, lint, typecheck, 37/37 primitive tests and Vercel deployment passed; 73/74 total tests passed. The only failing test referenced removed examples.mdx (replaced with blocks.mdx in the follow-up). New commits require a fresh run.

- pnpm registry:build, inspect generated artifacts, then pnpm check.
- Verify existing asChild behavior, render element/callback, refs and events,
  disabled links, button type, focus traversal, async guards and content mounting.
- Test installation in separate Base UI and Radix shadcn consumers.
- Run desktop/mobile browser tests, including reduced motion.
- Compare against the baseline main branch: installed source bytes, dependency
  graph, build size, runtime interactions and accessible names/focus.
- Check the full site for remaining Radix components; migrate independently
  if justified. Do not switch components.json before migrating its components.

## Phase 2 — separate experiment, not a dependency yet

Compare the Base UI baseline with a small UI SDK prototype and competing
Stepper implementations (Dice UI, Stepperize, Ark UI, Shadcn UI Kit).
Use identical flows: rapid forward/back, dynamic stages, async validation,
mobile keyboard, reduced motion, focus, and human/agent action parity.
Measure rather than assume improvement. Test the cn engine separately.
Do not add Beetle, a new workflow engine, persistence or form ownership.

## Codex handoff

Review the compatibility bridge and composition behavior, regenerate registry
artifacts, run the checks, fix regressions, and produce a Vercel preview.
Keep the PR in draft until verified. Do not merge or publish a release.

## Interaction research — baseline

- A stale async navigation guard must not move the user after the source or destination changes. Added regression cases for a direct jump and a replaced destination.
- /drafts/interactions is a noindex lab, not a registry item. Compare instant height changes with a native WAAPI/ResizeObserver prototype using the same Stepper and flow. No new runtime dependency. Check rapid reversal, reduced motion, preserved input and focus, narrow viewports, and dynamic content. The animation is experimental and not part of the installed core.
- Next compare the same fixture with UI SDK. Measure the rendered result rather than infer performance from library size. Keep cn migration separate until package/version and lockfile can be verified.

## Spatial stability — Experiment 003 (2026-11-27)

Owner feedback identified the changing vertical position of navigation controls as a friction in Adaptive. Spatial adds an intrinsic CSS grid envelope: all three real panels share a grid cell; inactive panels use visibility:hidden, inert and aria-hidden while contributing their intrinsic height. The same controls and form nodes remain mounted. No fixed pixel height, duplicated forms, UI SDK or core changes. Switching steps without changing content should retain control position; expansion, wrapping and viewport changes can still resize the envelope. Trade-off: whitespace and eager mounted content; unsuitable for unbounded or expensive panels without a different layout strategy. Compare the three modes at identical viewport/content, record button-center displacement in CSS pixels and rapid repeated click success, and verify focus, screen-reader exposure, mobile scrolling and reduced motion. Owner acceptance and real browser geometry tests are pending. Unit test covers inert/hidden state, input retention and persistent controls, not measured geometry.

## Connector continuity and focus visibility — 2026-11-27

Owner observed overlapping connector retraction on backward jumps and clipped focus rings. The previous stagger was 80 ms per segment against a 220 ms transition, so multiple segments moved concurrently. The shared typed progress cursor uses one inherited numeric CSS property; each connector maps its index to clamp(0, progress - index, 1). Forward fills in order; backward empties in reverse order. Native CSS retargeting is intended to preserve the current visual value on interruption; explicitly completed items stay filled. Reduced motion or unsupported typed properties use immediate updates. Focus uses an inset outline on the Trigger instead of an external ring clipped by the scrollable List. Do not remove keyboard focus. Preserve the public StepperSeparator name and data-slot, document the visible line as Connector (Track + Fill). Unit tests cover endpoints, explicit completion, and keyboard focus classes; browser timing, pixel-level clipping, RTL, and rapid interruption still require visual/device validation.

## Timing refinement and Continuity — Experiment 004

Owner accepted the connector direction but found the motion too slow. Reduce timing from 220 to 110 ms per segment, capped at 330 ms for long jumps, retaining the shared cursor, linear sequencing, native retargeting and reduced-motion behavior. These are product tuning values, not MDS defaults. Added endpoint timing assertions.

Continuity extends Spatial in the lab only: a small directional incoming panel transition (8 px, 160 ms), canceled on subsequent selection and reduced-motion changes; persistent controls, retained forms and focus recovery when keyboard navigation reaches a disabled boundary or leaves a focused panel. Pointer navigation should not unexpectedly move focus. This is a native reference, not an SDK implementation or a claim of full panel reversal; no new dependencies. Compare against Spatial with identical content and check rapid navigation, mobile keyboard, focus at both boundaries and reduced motion. UI SDK and cn remain separate experiments; browser-level behavior and latest CI pending.

## Shared intent — Experiment 005 (Handoff)

Continuity timing commit d43a766 passed CI and Vercel; owner accepted the visual direction. Handoff is a separate noindex route /drafts/handoff, linked from the layout lab. It uses the same registry primitive but keeps validation in the app. Human and locally simulated agent requests go through one reducer. Required workspace, sequential progression, unknown targets and stale expected stages are rejected; input remains intact. This is not an AI integration, WebMCP registration, or security boundary. It demonstrates a workflow-owned authorization pattern for navigation, not permission to submit or persist data.

Next SDK comparison: read https://ui-sdk.dev/docs/react/installation and https://ui-sdk.dev/docs/agents/connect-an-agent/your-components; install reviewed @ui-sdk/core and @ui-sdk/react together, regenerate pnpm-lock.yaml, read installed docs, and implement a small isolated custom primitive using createChange and the agent key. Route SDK agent requests through the same app policy and compare the result against this fixture. No global tool registration or external action by default; WebMCP requires explicit allow rules (https://ui-sdk.dev/docs/agents/connect-an-agent/webmcp). The native fixture is not a replacement for SDK. Package install/lockfile and browser tests are pending; the core and other experiments are unchanged.

## Agent-ready onboarding — Experiment 006

Pinned @ui-sdk/core and @ui-sdk/react 0.1.0-beta.17 with pnpm 9.15.3 lockfile resolution in a short non-persistent sandbox. The new /drafts/onboarding lab uses a controlled custom progress primitive (definePrimitive, createChange, createParts, agent.actions) and SDK Input/Switch components. The existing Base UI Stepper remains the visual primitive; the app owns validation. A user-initiated local script calls the actual SDK agent.act bridge, not DOM clicks or a fake reducer. It prepares example fields and leaves final confirmation to the user. No model, API key, WebMCP registration, or persistence. Existing values are not overwritten; human edits abort the script. Inactive fields are marked data-agent-hidden. Snapshot and results remain local. The lab allowlist is not a security boundary for server actions. CI, real browser bridge execution, keyboard/mobile, and comparison with prior Handoff are pending. Keep the registry untouched.

## cn migration — final modernization candidate

The UI SDK onboarding commit d9f6b22 passed CI and Vercel. Actual browser agent.act execution has not yet been independently exercised. Preserve it as an opt-in lab.

Follow the official shadcn migration (https://ui.shadcn.com/docs/changelog/2026-09-cn). Pin cn 0.5.2, replace both local helpers with compatibility re-exports, import cn directly in the distributed Stepper, and declare cn in each registry item containing that source. Remove clsx and tailwind-merge as direct dependencies only; transitive copies may remain. pnpm 9.15.3 resolved the lockfile in a disposable 1-vCPU session. The package requires Node >=22; document/check consumer compatibility before releasing. Class contract tests and registry checks are added; no measured speedup or visual parity is claimed until verified. No component styling change is intended. Keep default cn tables; no compiled source-specific table or build plugin yet.

## PR #47 validation

- Rebuilt the approved `d9f6b22` commit for comparison on localhost. The interaction, handoff, onboarding and checkout surfaces matched at 1440 × 960 and 390 × 844 with identical inputs and motion reduced. In the class comparison, `cn` merged the tested overrides and modifiers. It also removed `start-1 end-2` when a later `inset-x-4` replaced both.
- Browser sampling caught an instant first connector jump in Continuity. Updating the duration and progress in one commit lets the first jump animate. Forward and backward jumps moved one Connector Fill at a time. Reversing at 75 ms started from the same in-flight value, and the active step changed immediately.
- Seven alternating Continue and Back actions preserved the input and kept the control row within 1 CSS px of its start. Arrow keys moved focus without selecting, including RTL. Keyboard activation at either Continuity boundary focused the destination heading. Reduced motion removed the Stepper transitions and the panel animation. A narrow WebKit smoke test also passed.
- The real UI SDK bridge completed the five-action sample and respected existing name, currency and QR choices. Invalid currency blocked Review and now keeps the application's validation message visible. Final confirmation remains human. The action log is keyboard-scrollable. Automated axe checks passed in Continuity and the tested onboarding states.
- Installed all three items through the localhost namespace in initialized Base UI and Radix shadcn consumers on Node 22. Both passed TypeScript. A browser fixture using the installed file verified Base UI composition and that a stale async guard cannot move the user after a direct jump. Node 20 rejected `cn@0.5.2` with strict engine checking.
- Production builds referenced about 2.3–2.5 KiB more gzip-compressed initial JavaScript per tested route than `d9f6b22`. The route sample covered home, interactions, onboarding and checkout. `pnpm check` passed on Node 22 with 88 tests.
- The lightweight MDS dry run and local adoption check passed. The generated local bridge files are excluded from the public checkout. Physical mobile keyboards, screen readers and full panel reversal remain open. The draft is ready for the owner's visual review.

## V2 final refinement

The owner approved `b77468d` as the comparison baseline. The Stepper still owns ordered progress, selection and panel relationships. The app owns validation and workflow decisions. [shadcn Tabs](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/tabs.tsx) demonstrates thin styling wrappers around a matching primitive. Base UI Tabs adds tab roles and roving tab stops. Stepper uses ordered-list semantics and arrow focus without selection. [Base UI useRender](https://base-ui.com/react/utils/use-render) continues to compose elements, props, events and refs.

- A single step index serves item and panel lookups. The root computes neighboring enabled steps once for both navigation controls. Stable collection context keeps Triggers and the List out of active-step updates that do not affect them. The public hooks retain their existing API.
- Automatic registration retains mount order and resolves after the initial commit, including through wrappers. Use explicit `steps` for data-driven reordering and complete server-rendered progress. Legacy `asChild` remains a deprecated compatibility path. Prefer `render` for new code. A removal would require a separately announced migration.
- Back and Continue share guard and button behavior. A pending result is ignored once its source, destination or external `disabled` prop changes. Pass workflow disablement to the Stepper control when using a custom `render` element. The button stays pending until validation settles.
- In the UI SDK lab, a replacement input event with no pointer or key event could arrive after preparation started and then be overwritten. The app now aborts on a person’s edit or navigation, and checks the active run again in controlled change callbacks. The reproduced edit remained in place, the run paused, and a new run resumed from the edited value. UI SDK remains an optional experiment outside the registry.

| Measure | Approved | Candidate |
| --- | ---: | ---: |
| Core source lines including blanks | 1,435 | 992 |
| Core source bytes | 40,764 | 32,703 |
| Minified core bundle | 47,543 B | 44,877 B |
| Gzipped core bundle | 17,859 B | 17,441 B |
| Trigger render callbacks across 80 explicit-step updates | 1,920 | 160 |
| Median time for 80 explicit-step updates | 43.9 ms | 22.9 ms |
| Label renders across 80 automatic-step updates | 1,920 | 160 |
| Median time for 80 automatic-step updates | 53.0 ms | 20.9 ms |

The isolated esbuild 0.28 bundle includes Base UI composition and `cn`, with React external. The production React 19 fixture ran on the same Chromium runner with 24 steps, stable children and alternating adjacent selections. Timings are medians of seven samples per case after warm-up. Explicit mount rendered 24 controls in both builds. Automatic mount rendered 48 because registration completes after the initial commit. These timings cover synchronous updates in the fixture. Browser paint, dynamic step-array recreation and wider jumps have different costs.

| Initial route JavaScript, gzip per referenced chunk | Approved | Candidate |
| --- | ---: | ---: |
| Home | 281,567 B | 281,567 B |
| Interactions lab | 229,955 B | 229,557 B |
| SDK onboarding lab | 259,246 B | 258,899 B |
| Subscription checkout | 253,659 B | 253,261 B |

`pnpm check` passed on Node 22 with 90 tests. The guard regression covers both directions and verifies that disabling then re-enabling a control still discards the older result. The infrastructure suite checks the single-file layout and registry output. It leaves the choice of private helper names to the implementation.

The paired production builds matched in 12 settled Chromium captures at 1440 × 960 and 390 × 844 with identical inputs. The homepage was compared after its gradient initialized. Chromium exercised rapid forward and back, retained input, inset focus, RTL and connector reversal from the in-flight fill. Reduced motion completed immediately. WebKit passed a narrow touch smoke test. The regenerated primitive installed and typechecked in Base UI and Radix shadcn consumers on Node 22. The installed fixture verified custom rendering, disabled links and discarded validation after a direct jump. Physical iOS keyboards and screen reader announcements remain open.

## Implicit registration stabilization

The [review finding](https://github.com/francozeta/stepper/pull/47#discussion_r4724781214) reproduced against `7dd530a`. Changing a mounted item's `disabled` or `value` made the effect remove and append the item. The registry now updates metadata against a stable mounted ID, preserving the entry's position. A real unmount still removes it. Selection remains app-owned. Explicit `steps` remains the source for intentional reordering.

The regression suite covers accessible numbering, arrow focus without selection, disabled-step skipping and re-enabling, and Back and Continue after a value replacement. It also covers distinct trigger and panel IDs for punctuated values and keyboard focus on an empty string value. Core size moved from 992 to 1,006 lines and from 17,441 to 17,532 gzip bytes in the same isolated bundle. The 24-step fixture had identical mount and navigation render counts in both builds. Its short runtime samples establish no speed improvement.

## Reduction pass — candidate

Baseline `93cef00`. Build the normalized ordered steps and first-occurrence lookup together instead of allocating an intermediate implicit array and scanning the steps again. Collect duplicate-value diagnostics in that same pass, only in development; preserve the deferred warning effect. This keeps the implicit registration contract, public types, styles, motion, composition aliases and navigation guards unchanged. The existing registry source and all three public registry payloads are kept in sync. A regression test covers duplicate diagnostics and first-occurrence lookup in explicit mode. No runtime or bundle improvement is claimed until measured; CI, consumer install and browser parity must be verified before merging. The private MDS bridge was unavailable in this review environment; the checked-in DESIGN.md was consulted. A possible MDS observation is to reuse a required indexing pass for diagnostics rather than adding a second traversal, provided behavior and diagnostics remain intact. This is not a validated general principle.

## Handoff and onboarding — interaction refinement

User feedback: requiring Read state, target selection and Request change exposes the simulator rather than demonstrating the benefit of shared intent. Handoff now reads its stage and revision when the person asks for help, then issues the next-stage request after a deliberate 1.2-second local simulation delay. The person can stop or edit/navigate; stale requests (including same-stage edits and leave/return) are rejected by the reducer. Both sources still use the same navigation policy. The interaction history remains a research aid. The SDK onboarding keeps the existing deterministic bridge and policies but replaces developer snapshot controls with one assist/stop action and a confirmation in the navigation row. No change to the distributed core or dependencies. The deliberate delay belongs to the local experiment, not a product default. Candidate for MDS: expose intent, not implementation. Private MDS bridge and local runtime unavailable; browser focus, mobile, reduced motion and visual parity pending. Reducer regression added; do not claim visual acceptance from CI alone.

## Intent continuity — integrated controls

The assistant action now sits with Back and Continue in both labs, with one status area and no additional debug surface in the onboarding. The SDK lab validates each action against the latest accepted draft rather than render-captured state, preserves deliberate human-cleared fields, and derives a new sample plan when resumed. A deliberate blank can require manual correction; no automatic retry or final submission. The existing local bridge remains allowlisted and opt-in. UI SDK's documented WebMCP registration exposes snapshot/query/act in compatible browsers (https://ui-sdk.dev/docs/agents/connect-an-agent/webmcp); this lab does not yet register those tools or establish external browser-agent access. Compare native keyboard/DOM navigation against semantic actions in a separate bounded experiment before proposing a registry adapter. No SDK or core change in this pass. Local runtime, physical device and visual checks unavailable; CI and browser checks pending. MDS candidate: keep assistance beside the action it supports, and distinguish readable state from authorized intent.

## Access paths — validation and comparison candidate

The UI SDK onboarding now uses a shared field-aware navigation issue for manual actions and the deterministic sample planner. The planner stops at a known validation boundary instead of issuing impossible future navigation. The SDK callback still validates every accepted live transition. Invalid inputs are associated with the status message via ARIA and use a visible error border; 16px mobile input text protects against iOS focus zoom. No core/API/dependency change. Regression fixtures cover the complete, blocked and resumed plans.

Compare at /drafts/onboarding using a fresh page per run: (1) manual keyboard or pointer, (2) browser automation using only accessible controls, (3) Assist using the actual local UI SDK bridge. Use Café Studio, PEN, QR enabled; stop at Review without confirming. Repeat with existing USD, invalid currency, deliberate clear, interruption, and narrow viewport. Record successful completion, action counts (distinguish high-level semantic calls from DOM events), recovery and elapsed time; do not compare a scripted bridge with an actual LLM as if they were equivalent. A true external-agent test needs a compatible runtime; WebMCP registration is intentionally not enabled in this pass. References: https://developer.chrome.com/docs/ai/webmcp/best-practices and https://www.w3.org/WAI/tutorials/forms/multi-page/. Browser comparison and screen-reader/device checks pending.

## Core — shared navigation intent

Promote the handoff finding into the existing navigation primitive, without adding agent-specific APIs or dependencies. A root-local intent clock invalidates older guarded requests when a newer valid direct or guarded request arrives, even before a controlled owner commits a value. Keep the control-local epoch for target/disabled changes and unmount. Pending controls expose aria-busy and data-pending for assistive technology and consumer styling; the default UI is unchanged. Pending validation is not forcibly canceled and a denied newer request does not revive an older one. The application still owns workflow validation, persistence and actual authorization. Regression tests cover competing guards and direct controlled requests. Registry source and embedded payloads updated together. CI and independent visual, screen-reader and performance checks are pending; no bundle savings claimed.
