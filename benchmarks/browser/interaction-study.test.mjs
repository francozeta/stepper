import assert from "node:assert/strict";
import test from "node:test";
import { rotatedOrder, summarize } from "./interaction-study.mjs";

test("each variant occupies every position once", () => {
  const items = ["a", "b", "c", "d", "e"];
  const rounds = items.map((_, round) => rotatedOrder(items, round));
  for (let position = 0; position < items.length; position++) {
    assert.deepEqual(new Set(rounds.map(round => round[position])), new Set(items));
  }
  assert.deepEqual(items, ["a", "b", "c", "d", "e"]);
});

test("summary is independent of order and preserves tail samples", () => {
  assert.deepEqual(summarize([100, 2, 5, 1, 3]), { count: 5, median: 3, p90: 100, min: 1, max: 100 });
  assert.equal(summarize([1, 9, 5, 3]).median, 4);
  assert.throws(() => summarize([]));
  assert.throws(() => summarize([NaN]));
  assert.throws(() => summarize([-1]));
});
