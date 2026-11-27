# Current state

## Stepper modernization — review branch

Active branch: refactor/base-ui-stepper. Review: PR #47. Prior commit d9f6b22 (UI SDK onboarding experiment) passed GitHub Actions and Vercel deployment. A green build does not establish real browser agent execution.

The cn migration candidate pins cn 0.5.2, preserves compatibility re-exports, removes direct clsx/tailwind-merge dependencies, and updates the registry to explicitly install cn. Lockfile generated with pnpm 9.15.3. Existing transitive dependencies may still use either old package. New CI and visual parity pending. cn requires Node >=22; test consumers and disclose the support boundary before release.

Read [DESIGN.md](./DESIGN.md) before editing UI and [modernization notes](./docs/stepper-next.md) for evidence and decisions. The five prior lab modes/cases and agent onboarding are retained. Next: verify latest CI, compare visual parity with d9f6b22, run actual SDK actions and keyboard/reduced-motion/rapid reversal tests; fix observed defects without redesign. Preserve registry and workflow ownership. Do not merge, publish or deploy to production until the owner approves.

MDS: local design contract records the approved method and feedback. The canonical parent is maintained separately; full private-source bootstrap and pinned consultation are pending a local authorized checkout. Do not import private skill files or private repository material into the public registry. See AGENTS.md for the local adoption procedure.
