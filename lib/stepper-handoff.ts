// App-owned navigation policy. Both UI and programmatic requests pass here.
// This is a lab fixture, not part of the distributed Stepper primitive.
export const stages = ["account", "preferences", "review"] as const;
export type Stage = (typeof stages)[number];
export type Source = "human" | "agent";
export type Request = { type: "navigate"; source: Source; target: string; expectedStage?: Stage; expectedRevision?: number };
export type Entry = { source: Source; target: string; result: "accepted" | "blocked"; message: string };
export type State = {
  stage: Stage;
  revision: number;
  workspace: string;
  updates: boolean;
  history: Entry[];
};
export const initialState: State = { stage: "account", revision: 0, workspace: "", updates: false, history: [] };

export type Action = Request | { type: "workspace"; value: string } | { type: "updates"; value: boolean };

export function handoffReducer(state: State, action: Action): State {
  if (action.type === "workspace") return action.value === state.workspace ? state : { ...state, workspace: action.value, revision: state.revision + 1 };
  if (action.type === "updates") return action.value === state.updates ? state : { ...state, updates: action.value, revision: state.revision + 1 };

  const target = stages.find((stage) => stage === action.target);
  let reason: string | undefined;
  if ((action.expectedStage !== undefined && action.expectedStage !== state.stage) ||
      (action.expectedRevision !== undefined && action.expectedRevision !== state.revision)) {
    reason = "Your changes were kept. Continue yourself or ask the assistant again.";
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
    revision: reason || !target ? state.revision : state.revision + 1,
    history: [...state.history.slice(-5), entry],
  };
}
