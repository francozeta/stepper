// Interaction study: real browser events, not a stress loop or INP claim.
// The page records the first DOM mutation with the expected visible panel,
// then two animation frames as a presentation proxy. Layout reads and the
// observer have overhead; compare like for like, never call this paint time.
export function rotatedOrder(items, round) {
  const offset = round % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

export function summarize(values) {
  if (!values.length || values.some(value => !Number.isFinite(value) || value < 0)) {
    throw new Error("Invalid or empty timing samples");
  }
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  return {
    count: n,
    median: n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2,
    p90: sorted[Math.ceil(n * 0.9) - 1],
    min: sorted[0],
    max: sorted[n - 1],
  };
}

async function arm(page, kind, target) {
  await page.evaluate(({ kind, target }) => {
    const buttonName = "Back";
    const selector = target === 0 ? 'input[data-bench-field="business"]' : 'input[data-bench-field="currency"]';
    let started;
    let observer;
    let timer;
    let complete = false;
    let onClick;
    const finish = () => {
      observer?.disconnect();
      clearTimeout(timer);
      document.removeEventListener("click", onClick, true);
    };
    const check = () => {
      if (started === undefined || complete) return;
      const expected = document.querySelector(selector);
      const previous = document.querySelector(target === 0 ? 'input[data-bench-field="currency"]' : 'input[data-bench-field="business"]');
      const visible = element => element && element.getClientRects().length > 0 && getComputedStyle(element).visibility === "visible";
      if (!visible(expected) || visible(previous)) return;
      complete = true;
      const domMs = performance.now() - started;
      finish();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        window.__interaction.result = { domMs, twoFrameProxyMs: performance.now() - started };
      }));
    };
    const start = () => {
      if (started !== undefined) return;
      started = performance.now();
      observer = new MutationObserver(check);
      observer.observe(document.getElementById("root"), { subtree: true, childList: true, attributes: true, characterData: true });
      timer = setTimeout(() => {
        finish();
        window.__interaction.error = "Expected panel did not become visible";
      }, 3000);
      // Also handles an event that commits synchronously.
      queueMicrotask(check);
    };
    onClick = event => {
      if (event.target instanceof Element && event.target.closest("button")?.textContent.trim() === buttonName) start();
    };
    window.__interaction = {
      result: null, error: null,
      release() { start(); window.__bench.release(); },
      dispose: finish,
    };
    if (kind === "back") document.addEventListener("click", onClick, true);
  }, { kind, target });
}

async function readSample(page) {
  await page.waitForFunction(() => window.__interaction.result || window.__interaction.error, { timeout: 5000 });
  return page.evaluate(() => {
    if (window.__interaction.error) throw new Error(window.__interaction.error);
    return window.__interaction.result;
  });
}

export async function measureInteractions(browser, name, url, mobile, round) {
  const context = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 },
    isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const samples = [];
  try {
    const cdp = await context.newCDPSession(page);
    if (mobile) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Performance.enable");
    const metrics = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(({ name, value }) => [name, value]));
    await page.goto(url);
    const business = page.getByRole("textbox", { name: "Business name" });
    const currency = page.getByRole("textbox", { name: "Currency" });
    await business.fill("Cafe Studio");
    const cycle = async (collect) => {
      await page.getByRole("button", { name: "Continue", exact: true }).click({ timeout: 3000 });
      await page.getByRole("status").filter({ hasText: "Checking" }).waitFor({ timeout: 3000 });
      await arm(page, "release", 1);
      await page.evaluate(() => window.__interaction.release());
      const forward = await readSample(page);
      await currency.waitFor({ state: "visible", timeout: 3000 });
      await business.waitFor({ state: "hidden", timeout: 3000 });
      await arm(page, "back", 0);
      await page.getByRole("button", { name: "Back", exact: true }).click({ timeout: 3000 });
      const back = await readSample(page);
      await business.waitFor({ state: "visible", timeout: 3000 });
      await currency.waitFor({ state: "hidden", timeout: 3000 });
      if (await business.inputValue() !== "Cafe Studio") throw new Error("Business draft lost");
      if (collect) samples.push({ forward, back });
    };
    await cycle(false);
    const before = await metrics();
    for (let i = 0; i < 3; i++) await cycle(true);
    const after = await metrics();
    const cdpDeltaMs = Object.fromEntries(["ScriptDuration", "LayoutDuration", "RecalcStyleDuration", "TaskDuration"]
      .filter(key => Number.isFinite(before[key]) && Number.isFinite(after[key]))
      .map(key => [key, (after[key] - before[key]) * 1000]));
    if (errors.length) throw new Error(errors.join("; "));
    return { name, mobile, round, samples, cdpDeltaMs, pageErrors: errors };
  } finally {
    await context.close();
  }
}
