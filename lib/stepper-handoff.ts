// App-owned navigation policy. Both UI and programmatic requests pass here.
// This is a lab fixture, not part of the distributed Stepper primitive.
export const stages = ["account", "preferences", "review"] as const;
export type Stage = (typeof stages)[number];
export type Source = "human" | "agent";
export type Request = { type: "navigate"; source: Source; target: string; expectedStage?: Stage };
export type Entry = { source: Source; target: string; result: "accepted" | "blocked"; message: string };
export type State = {
  stage: Stage;
  workspace: string;
  updates: boolean;
  history: Entry[];
};
export const initialState: State = { stage: "account", workspace: "", updates: false, history: [] };

export type Action = Request | { type: "workspace"; value: string } | { type: "updates"; value: boolean };

export function handoffReducer(state: State, action: Action): State {
  if (action.type === "workspace") return { ...state, workspace: action.value };
  if (action.type === "updates") return { ...state, updates: action.value };

  const target = stages.find((stage) => stage === action.target);
  let reason: string | undefined;
  if (action.expectedStage !== undefined && action.expectedStage !== state.stage) {
    reason = "The interface changed. Read the current stage and try again.";
  } else if (!target) {
    reason = "Unknown stage.";
  } else if (target === state.stage) {
    return state;
  } else if (target !== "account" && !state.workspace.trim()) {
    reason = "Enter a workspace name before continuing.";
  } else if (stages.indexOf(target) > stages.indexOf(state.stage) + 1) {
    reason = "Complete the intermediate stage first.";
  }
  const entry: Entry = {
    source: action.source,
    target: action.target,
    result: reason ? "blocked" : "accepted",
    message: reason ?? "Moved to " + target + ".",
  };
  return {
    ...state,
    stage: reason || !target ? state.stage : target,
    history: [...state.history.slice(-5), entry],
  };
}
