import { describe, expect, it } from "vitest";
import { sanitiseLocalLearningProgress } from "../../client/src/lib/localLearningProgress";

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
});
