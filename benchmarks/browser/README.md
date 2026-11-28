# Browser comparison

The expensive browser comparison is opt-in (`workflow_dispatch`), not triggered by routine pull request updates. Once its workflow is present on the default branch, select the desired review branch in Actions and run it explicitly. Local execution remains available. The lightweight internal benchmark remains in Verify. The first browser CI attempt failed before execution because the pinned Playwright did not support Ubuntu 26.04; the workflow now pins Ubuntu 24.04. No browser measurements were produced in that run. Reports and resolved locks have seven-day artifact retention; archive useful evidence separately before expiry.

The first competitive run uses actual Ark UI 5.40.0 and Stepperize 8.0.0 packages, the repository's current Stepper source, and a plain React/HTML control. Stepperize v8 is a pinned comparison, not a claim to be latest. React 19.2.5 and esbuild production settings are shared; Stepper uses Base UI 1.9.0 in this isolated fixture. No production or registry dependencies change. The generated npm lock is preserved as an artifact; transitive resolutions may vary until replayed with that lock.

A realistic business onboarding uses the same controlled app fields, staged validation, review and human confirmation. There is no backend; a manually released Promise simulates server validation deterministically. Stepper uses its button guard; Stepperize its root guard; Ark and native use an explicit application-owned async guard with revision protection. This is a comparison of implemented integrations, not a claim of equal library responsibility. The owner-change test writes a controlled value while pending; it does not prove human/agent priority or cancellation of external side effects. The keyboard probe records differences rather than treating automatic and manual activation as equivalent. Native is a useful minimum, not a full accessible component-library substitute.

Desktop Chromium and 390px touch emulation at 4x CPU slowdown run identical tests. Seven measured samples after two warm-ups time 80 synchronous controlled updates; this is not frame time, real iPhone or a live LLM test. Raw and gzip bundle sizes include React, app and adapter; compare absolute and incremental cost versus native, not package tarball size. Shared simple CSS intentionally excludes each project's visual theme. Adapter line count is indicative, not a developer time study. Failures are recorded and fail the comparison; no omitted failed variants.

Run in a disposable directory (the runner writes generated files):
```sh
repo="$PWD"
tmp="$(mktemp -d)"
cp -R benchmarks/browser/. "$tmp/"
(cd "$tmp" && npm install --ignore-scripts --no-audit --no-fund && npx --no-install playwright install chromium && STEPPER_REPO="$repo" node run.mjs)
```

Next comparators: Dice UI Base at pinned commit 391f1ef1a015e34666b25aa00c07de4a80feeea1; its registry requires direction and icon generation dependencies, so include the real installed source in a separate fixture rather than stubbing its behavior. Also test installed consumer code in a real product, current Stepperize release, actual WebKit and physical mobile, async network abort, and independent developers. No comparative results until the workflow has run. References: https://ark-ui.com/docs/components/steps, https://www.stepperize.com/docs/v8/api/react/primitives, https://www.stepperize.com/docs/v8/guides/navigation.

First successful exploratory browser run: [captured Vercel Sandbox measurements](results/2026-11-27-vercel.json). Direct dependency versions are recorded; the disposable VM's full lock was not retained. This run used Playwright 1.65.1 rather than the CI pin, and is separate from the failed GitHub Actions run.

Second-pass harness: pin Playwright 1.65.1 (verified in the prior sandbox), use the actual first-run core revision via git show, and build it beside the candidate with identical dependencies. Requires that revision in the Git checkout. Record esbuild minified byte attribution by package and raw metafiles; these attributions are not additive gzip costs. Build all variants first; run desktop in forward order and mobile in reverse order. This is still not randomized repeated whole-suite testing. Retain the complete resolved dependency lock on CI. The source registry and public API remain unchanged except for the candidate native rendering fast path.

Second successful exploratory run: [same-VM baseline and candidate results](results/2026-11-27-vercel-v2.json), including package byte attribution and lock checksum. Complete lock and raw metafiles were not retained. Chromium Headless Shell only was installed for this run.

### Class-merging size study (opt-in)

After installing the isolated benchmark dependencies, run `node cn-study.mjs` (no browser installation needed). It measures complete gzip bundles for native and actual Stepper under three synthetic consumer contexts: plain, a shared full cn helper, and a shared application-fitted cn helper. Both fitted builds share the same corpus to isolate addition of Stepper. It checks ten scanned class override cases and deletes generated files. No results yet; do not interpret this as full shadcn install or visual parity. Real consumer and custom theme validation remain required.
