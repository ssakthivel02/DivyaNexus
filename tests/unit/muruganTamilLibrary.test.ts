import { describe, expect, it } from "vitest";
import {
  getPublishableMuruganWorks,
  muruganWorks,
  type MuruganWorkPublished,
} from "../../client/src/data/muruganTamilLibrary";

const approved: MuruganWorkPublished = {
  id: "verified-fixture",
  titleTa: "சோதனை நூல்",
  titleEn: "Test work",
  kind: "book",
  reviewStatus: "published",
  textTa: "தமிழ் மூல உரை — சோதனை வரி",
  sourceEdition: "Verified test fixture edition",
  sourceLocator: "fixture:1",
  redistributionBasis: "Test fixture written for this test",
  reviewer: "Fixture reviewer",
  reviewedAt: "2026-10-27",
};

describe("Murugan Tamil publication integrity", () => {
  it("does not publish pending titles", () => {
    expect(muruganWorks.length).toBeGreaterThan(0);
    expect(getPublishableMuruganWorks()).toEqual([]);
  });

  it("accepts an explicitly reviewed, evidenced Tamil fixture", () => {
    expect(getPublishableMuruganWorks([approved])).toEqual([approved]);
  });

  it("rejects repeated published identifiers", () => {
    expect(() => getPublishableMuruganWorks([approved, approved])).toThrow(/Duplicate Murugan work id/);
  });

  it.each([
    ["missing Tamil text", { textTa: "English text only" }],
    ["missing permission", { redistributionBasis: "" }],
    ["missing reviewer", { reviewer: "" }],
    ["HTML application shell", { textTa: "<html><body>தமிழ்</body></html>" }],
    ["placeholder text", { textTa: "தமிழ் source verification required" }],
  ])("rejects %s", (_label, changes) => {
    expect(() => getPublishableMuruganWorks([{ ...approved, ...changes }])).toThrow();
  });
});
