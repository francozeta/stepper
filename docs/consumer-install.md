# Consumer installation evidence

## Environment and scope

- Revision tested: `50871b2d77fa16b141099f235ca3d52d78a8bbf1`.
- One disposable Vercel Sandbox, 1 vCPU / 2 GB, Node 24.22.3 (universal image), no persistence.
- shadcn CLI 4.8.2; React / React DOM 19.2.5; TypeScript 5.9.3; Tailwind 4.2.4; esbuild 0.28.1.
- A minimal configured consumer, not a generated full shadcn project. The CLI installed the actual `public/stepper.json` from the checkout. It resolved Base UI 1.9.0 and cn 0.5.2.
- Base Nova: default `@/components/ui` alias. Radix Nova: `@/ui` alias in the same disposable project. Both created the expected file, passed strict TypeScript and esbuild bundling of the full controlled quickstart. Radix initial SSR smoke verified current step and correct panel.
- No live namespace fetch, full template initialization, visual styling, hydration or browser interaction. No blocks installed. No full lockfile retained.

## Defect and correction

Base Nova output lacked three `asChild={asChild}` attributes on the internal StepperElement; Radix Nova preserved them. TypeScript did not catch the lost forwarding. This is a source transformation issue, not a public API design change.

Changed the internal prop to `legacyAsChild`, aliasing it back to `asChild` in StepperElement. Both patched local JSON installs retained all three attributes and passed strict TypeScript. Rendered custom legacy trigger (anchor), content (section), and next (anchor) with their expected data-slot on the host in both presets. Radix patched quickstart initial server markup also passed. The exact tested patch is applied to the canonical file and public mirrors. Keep the public deprecated asChild API during migration.

## Reproduce manually

From a configured TypeScript React / Tailwind v4 consumer with shadcn 4.8.2, install from the review checkout:

```bash
npx shadcn@4.8.2 add /absolute/path/to/stepper/public/stepper.json
```

Use base-nova first, then radix-nova with a different UI alias in a disposable consumer. Do not overwrite application-owned components without consent. Verify the generated file contains three `legacyAsChild={asChild}` JSX attributes. Copy the complete controlled example from the installation documentation, adjust the import to your UI alias, run `tsc --noEmit` and bundle it. For markup smoke, render with React DOM Server and assert the active step, only its visible panel, and custom hosts on the legacy composition path.

## Resources

Sandbox stopped after 116.524 seconds; 60.599 seconds active CPU, 58.24 MB ingress. No Chromium download or second session. An opt-in consolidated reproduction script is available: `node scripts/verify-consumer-install.mjs` (Node 22+, npm, Linux/macOS, network access). It installs into a temporary directory, uses the actual quickstart from lib/docs.ts, checks both installed styles and removes the directory. Its constituent commands were tested in the VM; the consolidated script itself has not been run. It resolves transitive versions at execution time. Follow-up: preserve a full lock and validate actual browser CSS/hydration. Do not describe this as a visual or full template test.

## Preset independence

Keep the consumer's current preset and UI alias. Base UI is a composition dependency, not a Base Nova preset requirement. The tested Base Nova and Radix Nova cases do not establish support for all presets. Published demo/onboarding items are distinct from the subscription-checkout research preview, which has no registry item. Documentation now avoids advertising its nonexistent command. No additional sandbox or browser execution in this documentation pass.
