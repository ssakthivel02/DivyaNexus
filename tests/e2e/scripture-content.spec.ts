import { expect, test } from "@playwright/test";

const verifiedRecords = [
  {
    id: "rig-veda-1-1-1",
    heading: "Rig Veda 1.1.1 · Agni",
    original: "अग्निमीळे पुरोहितं",
    source: "Vedic Heritage Portal",
  },
  {
    id: "rig-veda-1-42",
    heading: "Rig Veda 1.42.1 · Pūṣan",
    original: "सं पूषन्नध्वनस्तिर",
    source: "Sanskrit Wikisource",
  },
  {
    id: "rig-veda-1-50",
    heading: "Rig Veda 1.50.1 · Sūrya",
    original: "उदु त्यं जातवेदसं",
    source: "Sanskrit Wikisource",
  },
  {
    id: "gita-2-47",
    heading: "Bhagavad Gita 2.47",
    original: "कर्मण्येवाधिकारस्ते",
    source: "Gita Supersite",
  },
  {
    id: "gita-4-7",
    heading: "Bhagavad Gita 4.7",
    original: "यदा यदा हि धर्मस्य",
    source: "Gita Supersite",
  },
] as const;

test.describe("verified scripture reader", () => {
  for (const record of verifiedRecords) {
    test(`${record.id} displays primary text, translation layers and provenance`, async ({ page }) => {
      const response = await page.goto(`/scriptures?record=${record.id}`, {
        waitUntil: "domcontentloaded",
      });

      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator(".route-loading")).toHaveCount(0, { timeout: 15_000 });
      await expect(page.getByRole("heading", { name: record.heading, exact: true })).toBeVisible();
      await expect(page.getByText(record.original, { exact: false })).toBeVisible();
      await expect(page.getByText("Original-language text · verified primary text")).toBeVisible();
      await expect(page.getByText("Tamil · DivyaNexus editorial translation")).toBeVisible();
      await expect(page.getByText("English · DivyaNexus editorial translation")).toBeVisible();
      await expect(page.getByText(record.source, { exact: false })).toBeVisible();
      await expect(page.getByRole("link", { name: "Open the source text in a new tab" })).toHaveAttribute(
        "target",
        "_blank",
      );
      await expect(
        page.getByText("Original-language text · not shown until an edition is verified"),
      ).toHaveCount(0);
    });
  }

  test("record trail switches between verified passages without a blank state", async ({ page }) => {
    await page.goto("/scriptures?record=rig-veda-1-1-1", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Rig Veda 1.1.1 · Agni", exact: true })).toBeVisible();

    await page.getByRole("button", { name: /Rig Veda 1\.50\.1 · Sūrya/ }).click();
    await expect(page.getByRole("heading", { name: "Rig Veda 1.50.1 · Sūrya", exact: true })).toBeVisible();
    await expect(page.getByText("उदु त्यं जातवेदसं", { exact: false })).toBeVisible();

    await page.getByRole("button", { name: /Bhagavad Gita 2\.47/ }).click();
    await expect(page.getByRole("heading", { name: "Bhagavad Gita 2.47", exact: true })).toBeVisible();
    await expect(page.getByText("கடமை", { exact: false })).toBeVisible();
  });
});
