import { expect, test } from "@playwright/test";

const forbidden = [
  "manus-storage",
  "__manus__",
  "BUILT_IN_FORGE",
  "filebin.net",
  "%VITE_ANALYTICS_",
  "Ancient Wisdom. Modern Intelligence.",
];

test.describe("production security boundaries", () => {
  test("application shell and linked bundles contain no forbidden runtime markers", async ({ request }) => {
    const page = await request.get("/");
    expect(page.ok()).toBeTruthy();
    const html = await page.text();

    for (const marker of forbidden) expect(html).not.toContain(marker);

    const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|mjs|css)(?:\?[^\"]*)?)"/g)].map((match) => match[1]);
    expect(assets.length).toBeGreaterThan(0);

    for (const asset of [...new Set(assets)]) {
      const response = await request.get(asset);
      expect(response.ok(), `Asset failed: ${asset}`).toBeTruthy();
      const content = await response.text();
      for (const marker of forbidden) expect(content, `${asset} contains ${marker}`).not.toContain(marker);
    }
  });

  test("security.txt publishes canonical disclosure guidance", async ({ request }) => {
    const response = await request.get("/.well-known/security.txt");
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain("Contact: https://divyanexus.omsaravanabhava.org/contact");
    expect(text).toContain("Canonical: https://divyanexus.omsaravanabhava.org/.well-known/security.txt");
    expect(text).toContain("Preferred-Languages: en, ta");
  });
});
