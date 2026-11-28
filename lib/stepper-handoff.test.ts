import { describe, expect, it } from "vitest";
import { handoffReducer, initialState, type Source } from "./stepper-handoff";

describe("handoff navigation policy", () => {
  for (const source of ["human", "agent"] as const satisfies readonly Source[]) {
    it("applies the same required field and sequential policy to " + source, () => {
      const blocked = handoffReducer(initialState, { type: "navigate", source, target: "preferences" });
      expect(blocked.stage).toBe("account");
      expect(blocked.history.at(-1)?.result).toBe("blocked");
      const filled = handoffReducer(blocked, { type: "workspace", value: "Studio" });
      const skipped = handoffReducer(filled, { type: "navigate", source, target: "review" });
      expect(skipped.stage).toBe("account");
      const next = handoffReducer(skipped, { type: "navigate", source, target: "preferences" });
      expect(next.stage).toBe("preferences");
      expect(next.history.at(-1)?.result).toBe("accepted");
    });
  }

  it("rejects a stale snapshot after a human change and preserves input", () => {
    let state = handoffReducer(initialState, { type: "workspace", value: "Studio" });
    state = handoffReducer(state, { type: "navigate", source: "human", target: "preferences" });
    state = handoffReducer(state, { type: "updates", value: true });
    state = handoffReducer(state, { type: "navigate", source: "agent", target: "account", expectedStage: "account" });
    expect(state.stage).toBe("preferences");
    expect(state.history.at(-1)?.result).toBe("blocked");
    state = handoffReducer(state, { type: "navigate", source: "agent", target: "review", expectedStage: "preferences" });
    expect(state.stage).toBe("review");
    expect(state.workspace).toBe("Studio");
    expect(state.updates).toBe(true);
  });

  it("rejects pending assistance after editing the same stage or leaving and returning", () => {
    const filled = handoffReducer(initialState, { type: "workspace", value: "Studio" });
    const pending = { type: "navigate", source: "agent", target: "preferences", expectedStage: "account", expectedRevision: filled.revision } as const;
    const edited = handoffReducer(filled, { type: "workspace", value: "My studio" });
    const rejected = handoffReducer(edited, pending);
    expect(rejected.stage).toBe("account");
    expect(rejected.workspace).toBe("My studio");
    expect(rejected.history.at(-1)?.result).toBe("blocked");

    const forward = handoffReducer(filled, { type: "navigate", source: "human", target: "preferences" });
    const back = handoffReducer(forward, { type: "navigate", source: "human", target: "account" });
    expect(handoffReducer(back, pending).history.at(-1)?.result).toBe("blocked");
    const retry = handoffReducer(back, { ...pending, expectedRevision: back.revision });
    expect(retry.stage).toBe("preferences");
  });

  it("rejects unknown targets", () => {
    const state = handoffReducer(initialState, { type: "navigate", source: "agent", target: "unknown" });
    expect(state.stage).toBe("account");
    expect(state.history.at(-1)?.result).toBe("blocked");
  });
});
