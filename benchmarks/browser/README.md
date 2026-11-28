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

### Measured class-merging results

[Captured results](results/2026-11-27-cn-study.json): in the shared-full fixture, Stepper adds 6,056 gzip bytes, compared with 17,229 bytes in the plain fixture. Fitted tables retain 50/384 groups and match all ten scanned pairs. They reduce the full shared Stepper app from 78,605 to 75,472 gzip bytes, not a standalone core reduction.

For legacy shadcn consumers, install optional dependencies only in this disposable fixture: `npm install --no-save --ignore-scripts --no-audit --no-fund clsx@2.1.1 tailwind-merge@3.5.0` and run `node cn-study.mjs --legacy`. The original legacy experiment was a temporary adaptation of the normal script and a separate parity probe; the consolidated flag is an unrerun equivalent. The duplicate engine path adds 16,814 bytes, whereas sharing the legacy helper adds 6,090. Legacy output differed for logical insets (9/10 string parity); do not automatically swap helpers or claim CSS equivalence. Full default cn remains the registry contract.

Third-pass browser harness adds the measured native fast-path revision 4cc8f9e as a separate same-run comparator (`stepper-previous`), alongside the original 5cd44a9 baseline and current candidate. Full Git history required. No timing result yet.

Third run: [reactive isolation results](results/2026-11-27-vercel-v3.json). Candidate passed functionality but throttled median worsened in this run; it was rejected and the previous core restored. The third-run harness is preserved at d838361. Default harness returns to comparing original and current core; the captured candidate revision remains reproducible through Git. Samples overlap and VM/order effects are not eliminated.

### Final measurement protocol (opt-in)

Run `node --test interaction-study.test.mjs` for the aggregation/order unit checks. Run `node run.mjs --interactions` with the same browser dependencies installed, or opt into interactions in the manual browser workflow. An existing local Chromium can be selected with `STEPPER_CHROMIUM_EXECUTABLE`; record the actual browser version alongside the Playwright version. Each of five rounds per profile rotates all five implementations through each order position once. Every round collects three forward/reverse cycles after a warmup. Simulated server wait is excluded. The observer checks actual input visibility and retained draft. Each round records a two-animation-frame proxy and Chrome DevTools totals for script, layout, style and task time. These measures include observation and automation overhead.

The [local Windows run](results/2026-11-27-local-interactions.json) recorded all 50 rounds at `1e31336` on Chromium 156 and Node 22. Each implementation has 15 samples per direction and profile. The [V2 review notes](../../docs/stepper-next.md#v2-release-review) give median/p90 results, profiling attribution and experimental limits. Keep these results separate from the earlier stress measurements and retain the rejected V3 result.

### Final competitive protocol

Use the committed dependency lock in a disposable copy. The default run builds plain and shared-`cn` variants, then measures the shared-`cn` ones. Set `STEPPER_CHROMIUM_EXECUTABLE` to reuse an existing Chromium. Otherwise install the pinned Playwright Chromium shell in the disposable directory.

```sh
repo="$PWD"
tmp="$(mktemp -d)"
cp benchmarks/browser/*.mjs benchmarks/browser/*.txt benchmarks/browser/package*.json "$tmp/"
cd "$tmp"
npm ci --ignore-scripts --no-audit --no-fund
# Run if a local Chromium path is unavailable.
npx --no-install playwright install --only-shell chromium
export STEPPER_REPO="$repo"
node competitive.mjs --smoke
node competitive.mjs
node competitive.mjs --cpu
node competitive.mjs --react
node competitive.mjs --guard
```

The measurement commands write `timing.json`, `cpu.json`, `react.json` and `guard.json` under `results/competitive/`. The CPU and guard probes save local Chrome profiles and map their samples to the bundled sources in the aggregate report. The guard probe focuses on the built-in Back and guarded Continue path used in the original mobile finding. The React pass uses the production profiling renderer. Interpret profiled durations separately from the production timing pass. Run the modes sequentially to keep browser contention comparable.

The fixtures hold React, React DOM, shared app code, fixtures, CSS and workflow rules constant. The source copy for Dice UI is pinned to `391f1ef1`. Its local import paths and Lucide icon use match the registry transform. All third-party sources are obtained through official packages or the pinned public source. The isolated dependencies and fixture are excluded from the production app and registry.

See [the final comparative report](competitive-validation.md) for the captured measurements and integration findings.
