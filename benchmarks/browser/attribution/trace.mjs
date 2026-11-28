const names = new Set([
  "EventTiming", "EventProcessing", "AnimationFrame::Presentation", "UpdateLayoutTree", "Layout", "PrePaint", "Paint",
]);

export async function startTrace(cdp) {
  const events = [];
  cdp.on("Tracing.dataCollected", ({ value }) => {
    for (const event of value) {
      if (names.has(event.name) || event.name.startsWith("stepper:")) events.push(event);
    }
  });
  const complete = new Promise(resolve => cdp.once("Tracing.tracingComplete", resolve));
  await cdp.send("Tracing.start", {
    traceConfig: { includedCategories: ["devtools.timeline", "blink.user_timing", "latency"] },
  });
  return async () => {
    await cdp.send("Tracing.end");
    await complete;
    return events;
  };
}

function scope(events, mark) {
  return events.filter(event => event.pid === mark.pid && event.tid === mark.tid);
}

function matchingEvent(events, mark, type) {
  return events.find(event => {
    if (event.name !== "EventTiming" || event.ph !== "b" || event.args?.data?.type !== type) return false;
    const data = event.args.data;
    const start = event.ts + 1000 * (data.processingStart - data.timeStamp);
    const end = event.ts + 1000 * (data.processingEnd - data.timeStamp);
    return start - 3 <= mark.ts && mark.ts <= end + 3;
  });
}

function traceDuration(events, name, from, to) {
  return events.reduce((total, event) => event.name === name && event.ph === "X"
    ? total + Math.max(0, Math.min(to, event.ts + event.dur) - Math.max(from, event.ts)) / 1000
    : total, 0);
}

export function interactionTrace(events, sample, windowMs) {
  const capture = events.find(event => event.name === "stepper:event:" + sample.id);
  const commit = events.find(event => event.name === "stepper:commit:" + sample.id);
  if (!capture || !commit) return { paintStatus: "missing mark" };
  const thread = scope(events, capture);
  const keyboard = sample.kind === "edit";
  const timing = matchingEvent(thread, capture, keyboard ? "keydown" : "click");
  if (!timing) return { paintStatus: "missing EventTiming" };

  const data = timing.args.data;
  const start = timing.ts;
  const end = start + 1000 * data.duration;
  const styleEnd = start + 1000 * windowMs;
  const phases = {
    inputDelayMs: data.processingStart - data.timeStamp,
    styleWindowMs: traceDuration(thread, "UpdateLayoutTree", start, styleEnd),
    layoutWindowMs: traceDuration(thread, "Layout", start, styleEnd),
    paintWorkWindowMs: traceDuration(thread, "PrePaint", start, styleEnd) + traceDuration(thread, "Paint", start, styleEnd),
  };
  const processing = thread.find(event => event.name === "EventProcessing" && event.ph === "b" &&
    event.args?.event_timing?.interaction_offset === data.interactionOffset &&
    event.args.event_timing.type === (keyboard ? "KEY_DOWN_EVENT" : "CLICK_EVENT") &&
    Math.abs(event.ts - (start + 1000 * phases.inputDelayMs)) <= 3);
  if (!processing) return { ...phases, paintStatus: "missing EventProcessing" };
  if (processing.args.fallback_reason !== "None") return { ...phases, paintStatus: processing.args.fallback_reason };
  if (!thread.some(event => event.name === "AnimationFrame::Presentation" && Math.abs(event.ts - end) <= 3)) {
    return { ...phases, paintStatus: "missing matching presentation" };
  }
  if (end < commit.ts) return { ...phases, paintStatus: "presentation before commit" };

  // In Chromium a printable key's input can run under keypress, after keydown.
  // Include that work in processing when both events share the presentation.
  const keypress = keyboard && thread.find(event => event.name === "EventTiming" && event.ph === "b" &&
    event.args?.data?.type === "keypress" && event.args.data.interactionOffset === data.interactionOffset &&
    Math.abs(event.ts + 1000 * event.args.data.duration - end) <= 3);
  const processingEnd = Math.max(data.processingEnd, keypress ? keypress.args.data.processingEnd : 0);
  const presentationDelayMs = data.timeStamp + data.duration - processingEnd;
  if (presentationDelayMs < 0) return { ...phases, paintStatus: "presentation before processing end" };

  return {
    ...phases,
    paintStatus: "presented",
    eventToNextPaintMs: data.duration,
    processingMs: processingEnd - data.processingStart,
    presentationDelayMs,
    styleAfterPaintMs: traceDuration(thread, "UpdateLayoutTree", end, styleEnd),
  };
}
