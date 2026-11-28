export const instrumentation = String.raw`
  const bench = window.__bench = {
    active: null,
    mounted: null,
    commits: [],
    components: [],
    calls: [],
    longTasks: [],
    arm(sample) {
      this.active = sample;
    },
    commitStep(step) {
      this.mounted ??= performance.now();
      if (this.active?.kind !== "edit") this.commit(step);
    },
    commitEdit(draft) {
      if (this.active?.kind === "edit") this.commit(draft);
    },
    commit(value) {
      const sample = this.active;
      if (!sample || sample.started === undefined || sample.expected !== value) return;
      sample.committed = performance.now();
      if (sample.trace) performance.mark("stepper:commit:" + sample.id);
    },
    countRender(name) {
      this.calls.push({ name, at: performance.now() });
    },
  };

  function onInput(event) {
    const sample = bench.active;
    if (!sample || sample.started !== undefined || !event.isTrusted) return;
    const field = sample.kind === "edit";
    const selector = field ? "[data-bench-field]" : '[data-bench-control="' + sample.kind + '"]';
    if (event.type !== (field ? "keydown" : "click") || !event.target.closest(selector)) return;
    sample.started = event.timeStamp;
    sample.captured = performance.now();
    if (sample.trace) performance.mark("stepper:event:" + sample.id);
  }
  document.addEventListener("click", onInput, true);
  document.addEventListener("keydown", onInput, true);

  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) bench.longTasks.push([entry.startTime, entry.duration]);
  }).observe({ type: "longtask", buffered: true });

  if (window.__benchConfig.profile) {
    // React's profiling renderer emits inclusive subtree timings. Capture
    // them directly without a DevTools extension or patches to the core.
    const timeStamp = console.timeStamp;
    console.timeStamp = (name, start, end, track, group, color) => {
      if (track === "Components ⚛" && typeof start === "number" && typeof end === "number" &&
          color?.startsWith("primary")) {
        bench.components.push({ name, start, end });
      } else {
        timeStamp.call(console, name, start, end, track, group, color);
      }
    };
  }
`;
