# Consumer installation evidence

## PR #48 verification

The consolidated verifier ran on Windows with Node 22.23.5, npm and shadcn 4.8.2. It installed `stepper`, `stepper-demo` and `stepper-intent-onboarding` from the review branch’s HTTP registry namespace. Both Base Nova and Radix Nova passed strict typechecking, bundled the documented first flow, and rendered the installed blocks and legacy host composition on the server.

| Preset | UI alias | Component alias |
| --- | --- | --- |
| Base Nova | `@/components/ui` | `@/components` |
| Radix Nova | `@/ui` | `@/widgets` |

Windows required invoking the installed JavaScript CLIs through Node. In the clean Base Nova fixture, generated Button and Field modules imported `class-variance-authority` without a matching dependency in their registry manifests. The onboarding block now declares it. The Radix fixture uses its preset's `radix-ui` dependency. Both configurations retain their own aliases and UI components.

Run `node scripts/verify-consumer-install.mjs` against the generated local JSON. For the HTTP namespace path, start the review site and set `STEPPER_REGISTRY_URL=http://localhost:3000/` before the same command. The verifier creates a disposable configured project. The separate production consumer used a Base Nova Next.js app with Tailwind v4 to test styled hydration and navigation. These checks cover two presets and simulated validation.

## Historical environment and scope

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

The original sandbox stopped after 116.524 seconds, with 60.599 seconds of active CPU and 58.24 MB of ingress. It ran the constituent installation commands. The consolidated verifier and separate browser checks are recorded above. The verifier resolves transitive versions at execution time.

## Preset independence

Keep the consumer's current preset and UI alias. Base UI is a composition dependency, not a Base Nova preset requirement. The tested Base Nova and Radix Nova cases do not establish support for all presets. Published demo/onboarding items are distinct from the subscription-checkout research preview, which has no registry item. Documentation now avoids advertising its nonexistent command. No additional sandbox or browser execution in this documentation pass.
