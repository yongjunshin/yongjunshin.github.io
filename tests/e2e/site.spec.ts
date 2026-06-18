import { test, expect } from "@playwright/test";

test("home: hero, social, 5 news, 6 highlighted publications", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-name")).toHaveText("Yong-Jun Shin");
  await expect(page.locator(".hero .social a")).toHaveCount(5);
  await expect(page.locator(".news-item")).toHaveCount(5);
  await expect(page.locator(".pub")).toHaveCount(6);
});

test("nav reaches each page with expected content counts", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Publications", exact: true }).click();
  await expect(page).toHaveURL(/\/publications\/?$/);
  await expect(page.locator(".pub")).toHaveCount(28);

  await page.getByRole("link", { name: "Patents", exact: true }).click();
  await expect(page).toHaveURL(/\/patents\/?$/);
  await expect(page.locator(".patent")).toHaveCount(4);

  await page.getByRole("link", { name: "CV", exact: true }).click();
  await expect(page).toHaveURL(/\/cv\/?$/);
  await expect(page.locator(".cv-section")).toHaveCount(5);
});

test("projects: list row navigates to detail page with rendered markdown", async ({ page }) => {
  await page.goto("/projects/");
  await expect(page.locator(".proj-row")).toHaveCount(5);
  // 최신순 → 첫 행은 SDI
  await page.locator(".proj-row").first().click();
  await expect(page).toHaveURL(/\/projects\/sdi\/?$/);
  await expect(page.locator("h1.page-title")).toHaveText("SDI");
  await expect(page.locator(".project-body img").first()).toBeVisible();
});

test("publications: owner name underlined + action buttons present", async ({ page }) => {
  await page.goto("/publications/");
  await expect(page.locator(".author.me").first()).toBeVisible();
  await expect(page.locator(".pub").first().locator("a", { hasText: "PDF" })).toBeVisible();
});

test("bibtex copy button copies clean bibtex to clipboard", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/publications/");
  const btn = page.locator(".js-bibtex").first();
  await btn.click();
  await expect(btn).toHaveText("Copied!");
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toContain("@");
  expect(clip).not.toContain("selected"); // 커스텀 필드는 제거됨
});

test("cv: download PDF link points to a pdf", async ({ page }) => {
  await page.goto("/cv/");
  await expect(page.locator("a.cv-download")).toHaveAttribute("href", /\.pdf/);
});

test("no broken images on key pages (each src returns 200)", async ({ page, request }) => {
  for (const path of ["/", "/publications/", "/projects/sdi/"]) {
    await page.goto(path);
    const srcs = await page
      .locator("img")
      .evaluateAll((imgs) => imgs.map((el) => (el as HTMLImageElement).src).filter(Boolean));
    expect(srcs.length).toBeGreaterThan(0);
    for (const src of srcs) {
      const res = await request.get(src);
      expect(res.status(), `image ${src}`).toBe(200);
    }
  }
});

test("active nav item is highlighted per page", async ({ page }) => {
  await page.goto("/cv/");
  await expect(page.locator(".nav-link.active")).toHaveText("CV");
});

test("mobile viewport: hero and nav render", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator(".hero-name")).toBeVisible();
  await expect(page.locator(".nav-brand")).toBeVisible();
  await ctx.close();
});
