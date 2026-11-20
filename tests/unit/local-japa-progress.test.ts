import { describe, expect, it } from "vitest";
import { defaultJapaProgress, mergeJapaProgress, sanitiseJapaProgress } from "../../client/src/lib/localJapaProgress";

describe("browser-local japa backup", () => {
  const a = "murugan-saravanabhava", b = "shiva-panchakshara";

  it("preserves valid counts even if they exceed a reduced goal", () => {
    expect(sanitiseJapaProgress({ selectedId: a, goal: 21, counts: { [a]: 80, [b]: 1008 } }))
      .toEqual({ selectedId: a, goal: 21, counts: { [a]: 80, [b]: 1008 } });
  });
  it("rejects malformed backups and filters unknown IDs and invalid counts", () => {
    expect(sanitiseJapaProgress(null)).toBeNull();
    expect(sanitiseJapaProgress({ counts: [] })).toBeNull();
    expect(sanitiseJapaProgress({ selectedId: "missing", goal: 999, counts: {
      [a]: 6, [b]: -1, "hanuman-namah": 1.5, "rama-jayam": 1009, "unknown": 50,
      "ayyappa-sharanam": "12", "peace-asato": Infinity,
    }})).toEqual({ selectedId: a, goal: 108, counts: { [a]: 6 } });
  });
  it("ignores inherited counts and prototype fields", () => {
    const counts = Object.create({ [a]: 108 });
    counts[b] = 4;
    Object.defineProperty(counts, "__proto__", { value: { polluted: true }, enumerable: true });
    expect(sanitiseJapaProgress({ selectedId: a, goal: 108, counts })?.counts).toEqual({ [b]: 4 });
  });
  it("restores a fresh browser from a valid checkpoint", () => {
    const backup = { selectedId: b, goal: 54, counts: { [b]: 12 } };
    expect(mergeJapaProgress(null, backup)).toEqual(backup);
  });
  it("keeps higher counts, local preferences, and avoids duplicate import inflation", () => {
    const local = { selectedId: a, goal: 108, counts: { [a]: 80, [b]: 4 } };
    const backup = { selectedId: b, goal: 21, counts: { [a]: 21, [b]: 12 } };
    const expected = { selectedId: a, goal: 108, counts: { [a]: 80, [b]: 12 } };
    expect(mergeJapaProgress(local, backup)).toEqual(expected);
    expect(mergeJapaProgress(expected, backup)).toEqual(expected);
    expect(mergeJapaProgress(local, undefined)).toEqual(local);
  });
  it("does not share mutable default counts", () => {
    const one = defaultJapaProgress();
    one.counts[a] = 2;
    expect(defaultJapaProgress().counts).toEqual({});
  });
});
