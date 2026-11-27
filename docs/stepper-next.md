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
