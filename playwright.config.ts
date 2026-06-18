import { defineConfig, devices } from "@playwright/test";

/**
 * E2E: 실제 빌드된 사이트를 프리뷰 서버로 띄우고 시스템 Chrome 으로 검증.
 * (Playwright 전용 브라우저 다운로드 없이 channel:"chrome" 사용 → 추가 비용 0)
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4321",
    trace: "off",
    screenshot: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
