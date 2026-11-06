import { describe, expect, it } from "vitest";
import { records } from "../../client/src/data/content";
import { knowledgeRelations } from "../../client/src/data/knowledgeRelations";

const recordIds = new Set(records.map((record) => record.id));
const allowedRouteTargets = new Set([
  "/scriptures",
  "/deities",
  "/temples",
  "/life-guidance",
  "/learning",
  "/glossary",
  "/audio",
  "/ask-divya",
]);

describe("Wave 10 knowledge relationship model", () => {
  it("rejects dangling record relationships", () => {
    for (const relation of knowledgeRelations) {
      expect(recordIds.has(relation.from), `${relation.id} has unknown source ${relation.from}`).toBe(true);
      const targetIsKnownRecord = recordIds.has(relation.to);
      const targetIsApprovedRoute = allowedRouteTargets.has(relation.to);
      expect(targetIsKnownRecord || targetIsApprovedRoute, `${relation.id} has unknown target ${relation.to}`).toBe(true);
    }
  });

  it("requires unique relationship ids", () => {
    const ids = knowledgeRelations.map((relation) => relation.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps rationale and Tamil labels explicit", () => {
    for (const relation of knowledgeRelations) {
      expect(relation.label.trim().length).toBeGreaterThan(8);
      expect(relation.tamilLabel.trim().length).toBeGreaterThan(4);
      expect(relation.rationale.trim().length).toBeGreaterThan(40);
    }
  });

  it("uses only declared editorial relation kinds", () => {
    const allowed = new Set(["study-next", "context", "concept", "practice"]);
    for (const relation of knowledgeRelations) expect(allowed.has(relation.kind)).toBe(true);
  });
});
