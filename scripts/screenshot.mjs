import { chromium } from "@playwright/test";

const base = process.env.BASE || "http://localhost:4321";
const shots = [
  ["/", "main"],
  ["/cv/", "cv"],
  ["/publications/", "publications"],
  ["/projects/", "projects"],
  ["/projects/sdi/", "project-sdi"],
  ["/patents/", "patents"],
];

const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
for (const [path, name] of shots) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  console.log("shot", name);
}
// mobile main page
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mp = await m.newPage();
await mp.goto(base + "/", { waitUntil: "networkidle" });
await mp.screenshot({ path: "screenshots/main-mobile.png", fullPage: true });
console.log("shot main-mobile");
await browser.close();
