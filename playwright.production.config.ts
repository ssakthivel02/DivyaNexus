import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "production-wave8-live.spec.ts",
  timeout: 45_000,
  expect: { timeout: 12_000 },
  retries: 1,
  workers: 1,
  reporter: [["list"], ["junit", { outputFile: "test-results/production-wave8-live.xml" }]],
  use: {
    baseURL: "https://divyanexus.omsaravanabhava.org",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    serviceWorkers: "block",
  },
  projects: [{ name: "production-chromium", use: { ...devices["Desktop Chrome"] } }],
});
