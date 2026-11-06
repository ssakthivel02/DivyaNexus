import { KANDAR_ANUBHUTI_TAMIL } from "../../client/src/data/murugan/kandarAnubhutiTa";
import { describe, expect, it } from "vitest";
import {
  getPublishableMuruganWorks,
  splitMuruganReadingSections,
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

describe("Tamil source stanza integrity", () => {
  it("preserves line breaks and splits only explicit blank-line boundaries", () => {
    expect(splitMuruganReadingSections("முதல் வரி\nஇரண்டாம் வரி\n\nமூன்றாம் வரி")).toEqual([
      "முதல் வரி\nஇரண்டாம் வரி",
      "மூன்றாம் வரி",
    ]);
  });
  it("normalises Windows line endings without inventing stanza numbers", () => {
    expect(splitMuruganReadingSections("தமிழ் ஒன்று\r\n\r\nதமிழ் இரண்டு")).toEqual(["தமிழ் ஒன்று", "தமிழ் இரண்டு"]);
    expect(splitMuruganReadingSections("  ")).toEqual([]);
  });
});

describe("Tamil text completeness against verified edition", () => {
  it("rejects truncated works when a canonical section count is declared", () => {
    expect(() => getPublishableMuruganWorks([{ ...approved, expectedSectionCount: 2 }])).toThrow(/section count/);
  });
  it("accepts source-preserved sections matching a reviewed count", () => {
    expect(getPublishableMuruganWorks([{ ...approved, textTa: "தமிழ் ஒன்று\n\nதமிழ் இரண்டு", expectedSectionCount: 2 }])).toHaveLength(1);
  });
  it("rejects invalid canonical count metadata", () => {
    expect(() => getPublishableMuruganWorks([{ ...approved, expectedSectionCount: 0 }])).toThrow(/section count/);
  });
});

describe("Kandar Anubhuti staged complete source", () => {
  const sections = splitMuruganReadingSections(KANDAR_ANUBHUTI_TAMIL);
  it("includes the opening invocation and all numbered verses 1-51", () => {
    expect(sections).toHaveLength(52);
    expect(sections[0]).toContain("நெஞ்சக் கனகல்லு");
    sections.slice(1).forEach((verse, index) => expect(verse.trimEnd().endsWith(String(index + 1))).toBe(true));
    expect(sections[51]).toContain("குருவாய் வருவா");
  });
  it("keeps canonical four-line stanzas without HTML contamination", () => {
    expect(sections.every((verse) => verse.split("\n").length === 4)).toBe(true);
    expect(KANDAR_ANUBHUTI_TAMIL).not.toMatch(/<html|<script|source verification required/i);
  });
});
