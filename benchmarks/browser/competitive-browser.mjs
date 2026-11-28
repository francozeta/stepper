import assert from "node:assert/strict";
import axe from "axe-core";
import { summarize } from "./interaction-study.mjs";

const durationMetrics = ["ScriptDuration", "LayoutDuration", "RecalcStyleDuration", "TaskDuration"];

export const timingScript = String.raw`
  window.__timing = {
    react: [], mounted: null,
    arm(step, state, control) {
      let resolve;
      this.target = { step, state, control, start: control ? undefined : performance.now() };
      this.pending = new Promise(done => { resolve = done; });
      this.resolve = resolve;
    },
    commit(step, state) {
      const target = this.target;
      if (!target || target.start === undefined || target.step !== step || target.state !== state) return;
      this.target = null;
      this.resolve(performance.now() - target.start);
    }
  };
  document.addEventListener("click", event => {
    const target = window.__timing.target;
    if (target?.control && event.target.closest("[data-bench-control]")?.dataset.benchControl === target.control) {
      target.start = performance.now();
    }
  }, true);
`;

async function verifyPanel(page, index) {
  const panels = page.locator("[data-bench-panel]:visible");
  await panels.and(page.locator('[data-bench-panel="' + index + '"]')).waitFor();
  assert.equal(await panels.count(), 1, "Expected exactly one visible panel");
}

async function inspectAccessibility(page) {
  await page.addScriptTag({ content: axe.source });
  const violations = await page.evaluate(async () => (await window.axe.run()).violations.map(v => ({
    id: v.id, impact: v.impact, targets: v.nodes.map(n => n.target),
  })));
  const first = page.locator('[data-bench-step="0"]');
  await first.focus();
  await page.keyboard.press("ArrowRight");
  const afterArrow = await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve({
      focus: document.activeElement.dataset.benchStep,
      current: document.querySelector("main").dataset.benchCurrent,
      state: document.querySelector("main").dataset.benchState,
      focusOutline: getComputedStyle(document.activeElement).outlineWidth,
    })));
  }));
  await page.keyboard.press("Enter");
  const afterEnter = await page.locator("main").getAttribute("data-bench-state");
  return {
    violations, afterArrow, afterEnter,
    listRole: await page.locator("[data-bench-list]").evaluate(el => el.getAttribute("role") ?? el.tagName.toLowerCase()),
    customButtonHosts: await page.locator("button[data-bench-host][data-bench-step]").count(),
  };
}

export async function runRound(browser, url, { mobile, audit, captureCpu }) {
  const context = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 },
    isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(6000);
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const cdp = await context.newCDPSession(page);
    if (mobile) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Performance.enable");
    if (captureCpu) {
      await cdp.send("Profiler.enable");
      await cdp.send("Profiler.setSamplingInterval", { interval: 500 });
      await cdp.send("Profiler.start");
    }
    const snapshot = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(m => [m.name, m.value]));
    const delta = (before, after) => Object.fromEntries(durationMetrics.map(key => [key, (after[key] - before[key]) * 1000]));
    const openMetrics = await snapshot();
    await page.goto(url);
    await verifyPanel(page, 0);
    const startup = {
      domMs: await page.evaluate(() => window.__timing.mounted),
      cdpMs: delta(openMetrics, await snapshot()),
    };
    await page.locator('[data-bench-field="business"]').fill("Café Studio");

    async function interaction(step, state, control) {
      const button = control && page.locator('[data-bench-control="' + control + '"]');
      const box = button && await button.boundingBox();
      if (control) assert(box && await button.isEnabled(), "Expected an enabled " + control);
      const before = await snapshot();
      await page.evaluate(({ step, state, control }) => {
        window.__timing.arm(step, state, control);
        if (!control) window.__timing.release();
      }, { step, state, control });
      if (box) {
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        if (mobile) await page.touchscreen.tap(x, y);
        else await page.mouse.click(x, y);
      }
      const domMs = await page.evaluate(async () => {
        let timeout;
        try {
          return await Promise.race([
            window.__timing.pending,
            new Promise((_, reject) => { timeout = setTimeout(() => reject(Error("Expected commit: " + JSON.stringify(window.__timing.target))), 4000); }),
          ]);
        } finally {
          clearTimeout(timeout);
        }
      });
      const after = await snapshot();
      await verifyPanel(page, step);
      return { domMs, cdpMs: delta(before, after) };
    }

    async function cycle(temp) {
      await page.evaluate(() => { window.__timing.react.length = 0; });
      const pending = await interaction(0, "checking", "next");
      const forward = await interaction(1, "ready");
      const back = await interaction(0, "ready", "back");
      assert.equal(await page.locator('[data-bench-field="business"]').inputValue(), "Café Studio");
      const render = await page.evaluate(() => window.__timing.react.slice());
      return { temp, pending, forward, back, render };
    }

    const cycles = [await cycle("cold"), await cycle("warm"), await cycle("warm")];
    const cpu = captureCpu ? (await cdp.send("Profiler.stop")).profile : undefined;
    await interaction(0, "checking", "next");
    await interaction(1, "ready");
    await page.locator('[data-bench-field="currency"]').fill("USD");
    await page.getByRole("checkbox", { name: "QR payments" }).check();
    await interaction(1, "checking", "next");
    const interrupt = await interaction(0, "interrupted", "back");
    const discard = await interaction(0, "discarded");
    assert.equal(await page.locator('[data-bench-field="business"]').inputValue(), "Café Studio");
    await interaction(0, "checking", "next");
    await interaction(1, "ready");
    assert.equal(await page.locator('[data-bench-field="currency"]').inputValue(), "USD");
    await interaction(1, "checking", "next");
    await interaction(2, "ready");
    assert.match(await page.locator('[data-bench-panel="2"]').innerText(), /Café Studio · USD · QR enabled/);
    await page.getByRole("button", { name: "Confirm setup" }).click();
    assert.equal(await page.locator("main").getAttribute("data-bench-state"), "confirmed");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), mobile ? 390 : 1280);
    let accessibility;
    if (audit) {
      await page.reload();
      await verifyPanel(page, 0);
      const next = page.locator('[data-bench-control="next"]');
      const name = page.locator('[data-bench-field="business"]');
      const initialNextEnabled = await next.isEnabled();
      if (!initialNextEnabled) {
        await name.fill("Café Studio");
        await name.clear();
      }
      await next.click();
      await page.locator('main[data-bench-state="invalid"]').waitFor();
      await verifyPanel(page, 0);
      await name.fill("Café Studio");
      accessibility = { initialNextEnabled, rejectsEmptyInput: true, ...await inspectAccessibility(page) };
    }
    assert.deepEqual(errors, []);
    return { startup, cycles, interrupt, discard, accessibility, cpu };
  } finally {
    await context.close();
  }
}

export function summarizeRounds(rounds) {
  const profiles = {};
  for (const mobile of [false, true]) {
    const group = rounds.filter(round => round.mobile === mobile && !round.error);
    if (!group.length) continue;
    const metrics = samples => ({
      ...summarize(samples.map(sample => sample.domMs)),
      cdpMedianMs: Object.fromEntries(durationMetrics.map(key => [
        key, summarize(samples.map(sample => Math.max(0, sample.cdpMs[key]))).median,
      ])),
    });
    const results = { startup: metrics(group.map(round => round.startup)) };
    for (const temp of ["cold", "warm"]) {
      const cycles = group.flatMap(round => round.cycles.filter(cycle => cycle.temp === temp));
      results[temp] = Object.fromEntries(["pending", "forward", "back"].map(key => [key, metrics(cycles.map(cycle => cycle[key]))]));
      if (cycles.some(cycle => cycle.render.length)) {
        results[temp].render = {
          commits: summarize(cycles.map(cycle => cycle.render.length)),
          renderMs: summarize(cycles.map(cycle => cycle.render.reduce((total, render) => total + render.actualDuration, 0))),
        };
      }
    }
    results.interrupt = metrics(group.map(round => round.interrupt));
    results.discard = metrics(group.map(round => round.discard));
    profiles[mobile ? "mobile4x" : "desktop"] = results;
  }
  return profiles;
}
