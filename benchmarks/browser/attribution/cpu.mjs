import { TraceMap, originalPositionFor } from "@jridgewell/trace-mapping";

function leafSource(frame, map, bundleUrl) {
  if (frame.url !== bundleUrl || frame.lineNumber < 0) {
    return frame.functionName.startsWith("(") ? frame.functionName : "browser/automation";
  }
  const { source } = originalPositionFor(map, {
    line: frame.lineNumber + 1, column: frame.columnNumber,
  });
  if (!source) return "unmapped bundle";
  const packages = [...source.matchAll(/node_modules\/((?:@[^/]+\/)?[^/]+)/g)];
  const name = packages.at(-1)?.[1] ?? source.split("/").at(-1);
  return name.startsWith("react-dom") ? "react-dom" : name;
}

export async function startCpu(cdp, sourceMap, bundleUrl) {
  const map = new TraceMap(sourceMap);
  await cdp.send("Profiler.enable");
  await cdp.send("Profiler.setSamplingInterval", { interval: 250 });
  await cdp.send("Profiler.start");
  return async (samples, navigationStart) => {
    const { profile } = await cdp.send("Profiler.stop");
    const sources = new Map(profile.nodes.map(({ id, callFrame }) => [id, leafSource(callFrame, map, bundleUrl)]));
    const groups = samples.map(() => ({}));
    // Chrome navigationStart and V8 profile timestamps share the monotonic
    // clock. Count leaf samples inside each event-to-commit interval.
    let timestamp = profile.startTime;
    for (const [index, id] of profile.samples.entries()) {
      timestamp += profile.timeDeltas[index];
      const source = sources.get(id);
      if (source === "(idle)") continue;
      const fromNavigationMs = (timestamp - navigationStart * 1e6) / 1e3;
      const interaction = samples.findIndex(sample => sample.started <= fromNavigationMs && fromNavigationMs <= sample.committed);
      if (interaction < 0) continue;
      groups[interaction][source] = (groups[interaction][source] ?? 0) + 1;
    }
    return groups;
  };
}
