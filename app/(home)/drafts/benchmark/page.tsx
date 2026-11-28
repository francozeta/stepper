import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Performance and trade-offs - Stepper",
  description: "A measured baseline and an open comparison of multi-step primitives.",
  robots: { index: false, follow: false },
};

const run = "https://github.com/francozeta/stepper/actions/runs/46100276647";
const measures = [
  { label: "Trigger render callbacks", before: "1,920", after: "160", ratio: 160 / 1920, change: "91.7% fewer" },
  { label: "Median update time", before: "61.15 ms", after: "34.84 ms", ratio: 34.836254 / 61.153078, change: "43.0% lower" },
  { label: "Core source bytes", before: "40,764 B", after: "33,980 B", ratio: 33980 / 40764, change: "16.6% smaller" },
];

const alternatives = [
  { name: "Stepper", href: "https://github.com/francozeta/stepper/pull/48", strength: "Owned source, string IDs, Base UI composition", policy: "A newer valid request supersedes a pending button guard. Workflow policy stays in the app." },
  { name: "Stepperize v8", href: "https://www.stepperize.com/docs/v8/core-concepts/navigation-lifecycle", strength: "Typed workflow, staged data, branching and guards", policy: "Pending navigation returns a pending result; authoritative changes cancel obsolete transitions. AbortSignal is exposed." },
  { name: "Dice UI", href: "https://diceui.com/docs/components/base/stepper", strength: "Source registry, Base UI render, validation and completion", policy: "Root onValidate, activation modes and item-level disabled state. Race behavior not measured here." },
  { name: "Ark UI", href: "https://ark-ui.com/docs/components/steps", strength: "Headless multi-framework steps, linear policy", policy: "Index-based controlled state with validity and skipping hooks. Async race behavior not measured here." },
  { name: "shadcn.io / UI SDK", href: "https://www.shadcn.io/ui/ui-sdk/steps", strength: "Steps composed from UI SDK primitives", policy: "SDK-based composition is already available elsewhere. External-agent interoperability not measured here." },
];

export default function BenchmarkPage() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-3xl content-start gap-10 px-5 py-8 sm:py-14">
      <header className="grid gap-3">
        <Link href="/drafts/onboarding" className="w-fit text-xs text-muted-foreground hover:text-foreground">Stepper / Research / 007</Link>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Less work. More continuity.</h1>
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">A progress primitive should earn its place in your application. Here is what we measured, what other libraries already solve, and what we still need to prove.</p>
      </header>
      <section aria-labelledby="measured" className="grid gap-5 border-t pt-5">
        <div className="grid gap-1">
          <h2 id="measured" className="text-lg font-medium">Historical internal baseline · CI #100</h2>
          <p className="text-xs text-muted-foreground">24 steps · 80 updates · seven samples · same installed dependencies</p>
        </div>
        {measures.map((measure) => (
          <div key={measure.label} className="grid gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-1 text-sm">
              <span>{measure.label}</span><span className="font-medium">{measure.change}</span>
            </div>
            <div className="grid grid-cols-[5rem_1fr_6rem] items-center gap-2 text-xs">
              <span className="text-muted-foreground">Baseline</span>
              <span aria-hidden="true" className="h-3 rounded-sm bg-muted-foreground/25"/>
              <span className="text-right tabular-nums">{measure.before}</span>
              <span className="text-muted-foreground">Candidate</span>
              <span aria-hidden="true" className="h-3 rounded-sm bg-foreground" style={{ width: (measure.ratio * 100) + "%" }}/>
              <span className="text-right tabular-nums">{measure.after}</span>
            </div>
          </div>
        ))}
        <p className="text-xs leading-relaxed text-muted-foreground">Development React and jsdom, Node 24.15.0. Not production browser paint, bundle size, or a comparison with another library. Source size is raw UTF-8. <a href={run} className="underline underline-offset-2">CI #100 and raw measurements</a>.</p>
      </section>
      <section aria-labelledby="browser" className="grid gap-4 border-t pt-5">
        <h2 id="browser" className="text-lg font-medium">Production browser comparison</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">Five integrations, 50/50 checks, same VM. Median of seven samples of 80 controlled updates; 4× CPU slowdown on the mobile profile.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[24rem] text-left text-xs tabular-nums">
            <thead><tr className="border-b text-muted-foreground"><th scope="col" className="py-2 font-medium">Integration</th><th scope="col" className="py-2 text-right font-medium">Desktop</th><th scope="col" className="py-2 text-right font-medium">Mobile</th><th scope="col" className="py-2 text-right font-medium">Gzip</th></tr></thead>
            <tbody>{[
              ["Native", "4.8 ms", "23.1 ms", "61.33 kB"],
              ["Stepper before", "21.7 ms", "89.6 ms", "78.53 kB"],
              ["Stepper candidate", "19.0 ms", "81.9 ms", "78.55 kB"],
              ["Ark UI", "32.1 ms", "104.7 ms", "69.31 kB"],
              ["Stepperize", "18.0 ms", "61.2 ms", "66.70 kB"],
            ].map(([name,desktop,mobile,gzip]) => <tr key={name} className="border-b"><th scope="row" className="py-3 font-medium">{name}</th><td className="text-right">{desktop}</td><td className="text-right">{mobile}</td><td className="text-right">{gzip}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">One exploratory run; samples overlap. Mobile is emulated, not a physical device. The fastest library on the throttled profile was Stepperize. <a className="underline underline-offset-2" href="https://github.com/francozeta/stepper/blob/7a33c69c2e9db40cf6880f9d75d5785cd18c2945/benchmarks/browser/results/2026-11-27-vercel-v2.json">Captured measurements</a>.</p>
      </section>
      <section aria-labelledby="incremental" className="grid gap-4 border-t pt-5">
        <h2 id="incremental" className="text-lg font-medium">Pay for what you add.</h2>
        <p className="text-sm text-muted-foreground">The same Stepper source has a different incremental cost depending on the consumer&apos;s existing class helper.</p>
        {[
          { name: "Plain React", bytes: 17229 },
          { name: "Shared cn", bytes: 6056 },
          { name: "App-fitted cn", bytes: 6002 },
        ].map(item => <div className="grid gap-2" key={item.name}>
          <div className="flex justify-between gap-2 text-sm"><span>{item.name}</span><span className="font-medium tabular-nums">{(item.bytes / 1000).toFixed(2)} kB</span></div>
          <div className="h-3 rounded-sm bg-muted"><div aria-hidden="true" className="h-full rounded-sm bg-foreground" style={{ width: (item.bytes / 17229 * 100) + "%" }} /></div>
        </div>)}
        <p className="text-xs leading-relaxed text-muted-foreground">Incremental gzip bytes over the corresponding native control. Synthetic production bundle, not an installed shadcn application. App-fitted tables preserved ten scanned overrides. Sharing the legacy helper reduced duplicate bytes but differed on logical insets, so it is not an equivalent default. No core size reduction claimed.</p>
        <a href="https://github.com/francozeta/stepper/tree/refactor/reduction-pass/benchmarks/browser/results" className="w-fit text-sm underline underline-offset-2">Measurements and limitations</a>
      </section>
      <section aria-labelledby="race" className="grid gap-4 border-t pt-5">
        <h2 id="race" className="text-lg font-medium">When intent changes</h2>
        <p className="text-sm text-muted-foreground">A slow Continue guard is pending. A newer direct request asks for Review before the controlled owner commits the step.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2 rounded-xl border p-4"><span className="text-xs text-muted-foreground">Baseline · observed</span><span className="font-mono text-sm">Review → Preferences</span><span className="text-xs text-muted-foreground">The late guard emitted a stale request.</span></div>
          <div className="grid gap-2 rounded-xl border p-4"><span className="text-xs text-muted-foreground">Candidate · observed</span><span className="font-mono text-sm">Review</span><span className="text-xs text-muted-foreground">Only the newer request was emitted.</span></div>
        </div>
        <p className="text-xs text-muted-foreground">Requests, not committed destinations. The application controls actual selection and permissions. The guard itself is not forcibly aborted.</p>
        <Link href="/drafts/handoff" className="w-fit text-sm underline underline-offset-2">Try the shared-intent lab</Link>
      </section>
      <section aria-labelledby="tradeoffs" className="grid gap-4 border-t pt-5">
        <h2 id="tradeoffs" className="text-lg font-medium">Choose the contract, not the winner.</h2>
        <p className="text-sm text-muted-foreground">Documented capabilities, not head-to-head benchmark results. Each project solves a different part of the problem.</p>
        <div className="divide-y border-y">
          {alternatives.map((item) => (
            <div key={item.name} className="grid gap-2 py-4 sm:grid-cols-[10rem_1fr]">
              <a href={item.href} className="w-fit text-sm font-medium underline underline-offset-2">{item.name}</a>
              <div className="grid gap-1"><p className="text-sm">{item.strength}</p><p className="text-xs leading-relaxed text-muted-foreground">{item.policy}</p></div>
            </div>
          ))}
        </div>
      </section>
      <section aria-labelledby="reproduce" className="grid gap-3 border-t pt-5">
        <h2 id="reproduce" className="text-lg font-medium">Reproduce it.</h2>
        <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-3 text-sm"><code>pnpm benchmark</code></pre>
        <p className="text-xs leading-relaxed text-muted-foreground">Full Git checkout and installed dependencies required. Next comparison: identical controlled form, asynchronous guard, interruption, conditional step and keyboard tasks; record adapter code, incremental gzip, render work and recovery. Real installed consumer, repeated production measurements and external-agent access remain unverified.</p>
        <Link href="/drafts/onboarding" className="w-fit text-sm underline underline-offset-2">Explore the optional UI SDK experiment</Link>
      </section>
    </main>
  );
}
