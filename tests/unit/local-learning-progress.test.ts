import { describe, expect, it } from "vitest";
import { mergeLocalLearningProgress, sanitiseLocalLearningProgress } from "../../client/src/lib/localLearningProgress";

describe("local learning progress validation", () => {
  it("keeps only array-backed journeys and unique non-empty step identifiers", () => {
    expect(sanitiseLocalLearningProgress({
      "gita-context": ["step-1", "step-1", "", "step-2", 12],
      "veda-foundations": "not-an-array",
      "temple-context": ["visit", null, "reflect"],
    })).toEqual({
      "gita-context": ["step-1", "step-2"],
      "temple-context": ["visit", "reflect"],
    });
  });

  it("rejects non-object roots", () => {
    expect(sanitiseLocalLearningProgress(null)).toEqual({});
    expect(sanitiseLocalLearningProgress([])).toEqual({});
    expect(sanitiseLocalLearningProgress("unsafe")).toEqual({});
  });

  it("merges overlapping journeys without deleting later local completions", () => {
    expect(mergeLocalLearningProgress(
      { "gita-context": ["new-step", "shared-step"], "veda-foundations": ["intro"] },
      { "gita-context": ["shared-step", "old-step", "old-step"], "temple-context": ["visit"] },
    )).toEqual({
      "gita-context": ["new-step", "shared-step", "old-step"],
      "veda-foundations": ["intro"],
      "temple-context": ["visit"],
    });
  });

  it("remains idempotent when the same backup is restored twice", () => {
    const local = { "gita-context": ["step-2"] };
    const backup = { "gita-context": ["step-1", "step-2"] };
    const once = mergeLocalLearningProgress(local, backup);
    expect(mergeLocalLearningProgress(once, backup)).toEqual(once);
  });

  it("ignores invalid journey values and preserves existing progress", () => {
    expect(mergeLocalLearningProgress({ "gita-context": ["latest"] }, {
      "gita-context": "not-an-array",
      "veda-foundations": [22, "", "study", "study"],
    })).toEqual({ "gita-context": ["latest"], "veda-foundations": ["study"] });
    expect(mergeLocalLearningProgress({ "gita-context": ["latest"] }, null)).toEqual({
      "gita-context": ["latest"],
    });
  });

  it("handles a '__proto__' journey name without mutating the object prototype", () => {
    const payload = JSON.parse('{"__proto__":["safe-step"]}');
    const merged = mergeLocalLearningProgress({}, payload);
    expect(Object.prototype.hasOwnProperty.call(merged, "__proto__")).toBe(true);
    expect(Object.getPrototypeOf(merged)).toBe(Object.prototype);
    expect(({} as Record<string, unknown>)["safe-step"]).toBeUndefined();
  });
});
