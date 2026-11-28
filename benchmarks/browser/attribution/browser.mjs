import assert from "node:assert/strict";
import { summarize } from "../interaction-study.mjs";
import { startCpu } from "./cpu.mjs";
import { interactionTrace, startTrace } from "./trace.mjs";

const windowMs = 180;
const durations = ["ScriptDuration", "LayoutDuration", "RecalcStyleDuration", "TaskDuration"];

function collectLongTasks(tasks, start, end) {
  return tasks.filter(([at, ms]) => at < end && at + ms > start);
}

function renderWork({ commits, components, calls }, start, end) {
  const commitList = commits.filter(entry => start <= entry.start && entry.commit < end);
  const componentWork = {};
  const groupFor = name => componentWork[name] ??= { renders: 0, trackEntries: 0, inclusiveMs: 0 };
  for (const { name, at } of calls) {
    if (start <= at && at < end) groupFor(name).renders += 1;
  }
  for (const entry of components) {
    if (entry.start < start || entry.end >= end) continue;
    const group = groupFor(entry.name);
    group.trackEntries += 1;
    group.inclusiveMs += Math.max(0, entry.end - entry.start);
  }
  return {
    commits: commitList.length,
    appActualMs: commitList.reduce((total, entry) => total + entry.duration, 0),
    components: componentWork,
  };
}

export async function runRound(browser, url, variant, { mode, cpuRate, cycles, viewport, sourceMap, bundleUrl }) {
  const profile = mode === "react";
  const timing = mode === "timing";
  const cpu = mode === "cpu";
  const context = await browser.newContext({
    viewport,
    reducedMotion: variant.motion ? "no-preference" : "reduce",
    colorScheme: "light",
  });
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const cdp = await context.newCDPSession(page);
    if (cpuRate !== 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuRate });
    await cdp.send("Performance.enable");
    const endTrace = timing && await startTrace(cdp);
    const metrics = async () => Object.fromEntries(
      (await cdp.send("Performance.getMetrics")).metrics.map(({ name, value }) => [name, value])
    );
    const delta = (before, after) => Object.fromEntries(durations.map(key => {
      assert(Number.isFinite(before[key]) && Number.isFinite(after[key]), "Missing CDP metric " + key);
      return [key, Math.max(0, (after[key] - before[key]) * 1000)];
    }));

    const beforeStartup = await metrics();
    await page.goto(url);
    await page.waitForFunction(() => window.__bench.mounted !== null && performance.getEntriesByName("first-contentful-paint").length > 0);
    const afterStartup = await metrics();
    const startupCdp = delta(beforeStartup, afterStartup);
    const startup = await page.evaluate(() => ({
      commitMs: window.__bench.mounted,
      fcpMs: performance.getEntriesByName("first-contentful-paint")[0].startTime,
      versions: window.__bench.versions,
    }));
    assert.deepEqual(startup.versions, { react: variant.react, reactDom: variant.react });
    startup.cdpMs = startupCdp;

    const field = page.locator("[data-bench-field]");
    const control = kind => page.locator('[data-bench-control="' + kind + '"]');
    const samples = [];
    const verifyState = step => page.evaluate(step => {
      const active = document.querySelector('[aria-current="step"]');
      const panels = Array.from(document.querySelectorAll("[data-bench-panel]")).filter(panel => !panel.hidden);
      return document.querySelector("main").dataset.benchStep === step &&
        active?.dataset.benchTrigger === step &&
        active.getAttribute("aria-controls") === panels[0]?.id &&
        panels.length === 1 && panels[0].dataset.benchPanel === step;
    }, step);

    assert(await verifyState("0"), "Expected the first controlled panel");
    assert.equal(await page.locator("[data-bench-trigger]").count(), variant.count);
    assert(await control("back").isDisabled());
    const css = await page.evaluate(() => {
      const root = document.querySelector('[data-slot="stepper"]');
      const list = document.querySelector('[data-slot="stepper-list"]');
      const trigger = document.querySelector("[data-bench-trigger]");
      return {
        listDisplay: getComputedStyle(list).display,
        listOverflow: getComputedStyle(list).overflowX,
        triggerTag: trigger.tagName,
        triggerType: trigger.type,
        connectorTransition: root && getComputedStyle(root).transitionProperty,
      };
    });
    assert.equal(css.listDisplay, "flex");
    assert.equal(css.listOverflow, "auto");
    assert.equal(css.triggerTag, "BUTTON");
    assert.equal(css.triggerType, "button");
    const cursorMotion = variant.motion && variant.cursor !== "instant";
    assert.equal(css.connectorTransition, variant.impl === "native" ? null : cursorMotion ? "--stepper-progress" : "none");

    let id = 0;
    async function act(kind, expected, key, collect) {
      const edit = kind === "edit";
      let point;
      if (edit) {
        await field.focus();
      } else {
        const box = await control(kind).boundingBox();
        assert(box && await control(kind).isEnabled(), "Expected a visible and enabled " + kind);
        point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
        await page.mouse.move(point.x, point.y);
        // Keep hover transitions outside the sampled click in both motion modes.
        await page.waitForTimeout(variant.motion || timing ? 160 : 30);
      }

      await page.evaluate(sample => window.__bench.arm(sample), { id: id++, kind, expected, trace: timing && collect });
      const before = timing && await metrics();
      if (edit) await page.keyboard.press(key);
      else await page.mouse.click(point.x, point.y);
      await page.waitForTimeout(timing ? windowMs : 75);
      const cdpMs = timing ? delta(before, await metrics()) : undefined;
      const sample = await page.evaluate(() => window.__bench.active);
      assert(Number.isFinite(sample.started) && Number.isFinite(sample.committed),
        "Missing trusted event or React layout-effect marker: " + JSON.stringify(sample));
      assert(await verifyState(edit ? "0" : expected), "Unexpected controlled panel after " + kind);
      if (edit) {
        assert.equal(await field.inputValue(), expected);
        assert.equal(await page.locator("[data-bench-draft]").textContent(), expected);
      }
      if (collect) samples.push({ ...sample, eventToCommitMs: sample.committed - sample.started, cdpMs });
    }

    if (variant.impl === "stepper") {
      await page.evaluate(() => {
        const root = document.querySelector('[data-slot="stepper"]');
        window.__bench.motionEvents = [];
        function record(event) {
          if (event.target === root && event.propertyName === "--stepper-progress") {
            window.__bench.motionEvents.push(event.type);
          }
        }
        root.addEventListener("transitionrun", record);
        root.addEventListener("transitionend", record);
        window.__bench.stopMotionProbe = () => {
          root.removeEventListener("transitionrun", record);
          root.removeEventListener("transitionend", record);
          return window.__bench.motionEvents;
        };
      });
    }
    // Warm code paths and retain an application-owned draft across step changes.
    await act("edit", "a", "a", false);
    await act("forward", "1", undefined, false);
    if (variant.cursor) {
      css.forwardCursor = await page.locator('[data-slot="stepper"]').evaluate(el =>
        getComputedStyle(el).getPropertyValue("--stepper-progress").trim()
      );
      assert.equal(css.forwardCursor, variant.cursor === "frozen" ? "0" : "1");
    }
    await act("back", "0", undefined, false);
    assert.equal(await field.inputValue(), "a");
    if (variant.impl === "stepper") {
      css.motionEvents = await page.evaluate(() => window.__bench.stopMotionProbe());
      if (cursorMotion) assert(css.motionEvents.includes("transitionrun"), "Expected an animated connector");
      else assert.deepEqual(css.motionEvents, []);
    }
    await act("edit", "", "Backspace", false);

    // Rotate workload order with the round's configured order in the caller.
    const navigate = async () => {
      for (let i = 0; i < cycles; i++) {
        await act("forward", "1", undefined, true);
        await act("back", "0", undefined, true);
      }
    };
    const edit = async () => {
      for (let i = 0; i < cycles; i++) {
        await act("edit", "a", "a", true);
        await act("edit", "", "Backspace", true);
      }
    };
    const endCpu = cpu && await startCpu(cdp, sourceMap, bundleUrl);
    for (const workload of variant.editFirst ? [edit, navigate] : [navigate, edit]) await workload();
    if (endCpu) {
      assert(Number.isFinite(afterStartup.NavigationStart), "Missing CDP monotonic navigation start");
      const cpuGroups = await endCpu(samples, afterStartup.NavigationStart);
      for (const [index, groups] of cpuGroups.entries()) samples[index].cpuSamples = groups;
      assert(cpuGroups.some(groups => groups["react-dom"]), "No renderer samples in the CPU profile window");
    }

    const events = timing && await endTrace();
    const data = await page.evaluate(() => ({
      longTasks: window.__bench.longTasks,
      commits: window.__bench.commits,
      components: window.__bench.components,
      calls: window.__bench.calls,
    }));
    startup.longTasks = collectLongTasks(data.longTasks, 0, Math.max(startup.commitMs, startup.fcpMs));
    if (profile) {
      startup.render = renderWork(data, 0, startup.commitMs + 40);
      assert(startup.render.commits > 0 && startup.render.components.App?.trackEntries > 0, "React profile tracks were empty");
    }
    for (const sample of samples) {
      sample.longTasks = collectLongTasks(data.longTasks, sample.started, sample.started + windowMs);
      if (timing) Object.assign(sample, interactionTrace(events, sample, windowMs));
      if (profile) {
        sample.render = renderWork(data, sample.captured - 0.25, sample.committed + 40);
        assert(sample.render.commits > 0, "No React commit recorded for " + sample.kind);
      }
    }
    assert.deepEqual(errors, []);
    return { startup, css, samples };
  } finally {
    await context.close();
  }
}

const fields = [
  "eventToCommitMs", "eventToNextPaintMs", "inputDelayMs", "processingMs", "presentationDelayMs",
  "styleWindowMs", "styleAfterPaintMs", "layoutWindowMs", "paintWorkWindowMs",
];

function longTaskStats(samples) {
  const times = samples.flatMap(sample => sample.longTasks.map(([, duration]) => duration));
  return {
    count: times.length,
    affectedSamples: samples.filter(sample => sample.longTasks.length).length,
    longestMs: times.length ? Math.max(...times) : null,
  };
}

function summarizeCdp(samples) {
  return Object.fromEntries(durations.map(key => [key, summarize(samples.map(sample => sample.cdpMs[key]))]));
}

function summarizeRenders(renders) {
  const names = [...new Set(renders.flatMap(render => Object.keys(render.components)))].sort();
  return {
    commits: summarize(renders.map(render => render.commits)),
    appActualMs: summarize(renders.map(render => render.appActualMs)),
    components: Object.fromEntries(names.map(name => [name, {
      renders: summarize(renders.map(render => render.components[name]?.renders ?? 0)),
      trackEntries: summarize(renders.map(render => render.components[name]?.trackEntries ?? 0)),
      inclusiveMs: summarize(renders.map(render => render.components[name]?.inclusiveMs ?? 0)),
    }])),
  };
}

export function summarizeRounds(rounds, mode) {
  const measured = rounds.filter(round => !round.error);
  if (!measured.length) return {};
  const starts = measured.map(round => round.startup);
  const summary = { startup: {
    commitMs: summarize(starts.map(start => start.commitMs)),
    fcpMs: summarize(starts.map(start => start.fcpMs)),
    cdpMs: summarizeCdp(starts),
    longTasks: longTaskStats(starts),
  } };
  if (mode === "react") summary.startup.render = summarizeRenders(starts.map(start => start.render));
  for (const kind of ["forward", "back", "edit"]) {
    const samples = measured.flatMap(round => round.samples.filter(sample => sample.kind === kind));
    const result = { count: samples.length, longTasks: longTaskStats(samples) };
    if (mode === "timing") {
      result.cdpMs = summarizeCdp(samples);
      result.paintStatus = {};
      for (const sample of samples) result.paintStatus[sample.paintStatus] = (result.paintStatus[sample.paintStatus] ?? 0) + 1;
      for (const name of fields) {
        const values = samples.map(sample => sample[name]).filter(value => Number.isFinite(value));
        if (values.length) result[name] = summarize(values);
      }
    } else if (mode === "react") {
      result.render = summarizeRenders(samples.map(sample => sample.render));
    } else {
      result.leafSamples = {};
      for (const sample of samples) {
        for (const [name, count] of Object.entries(sample.cpuSamples)) {
          result.leafSamples[name] = (result.leafSamples[name] ?? 0) + count;
        }
      }
    }
    summary[kind] = result;
  }
  return summary;
}
