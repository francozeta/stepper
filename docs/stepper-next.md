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
