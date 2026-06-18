/**
 * 콘텐츠/설정 시나리오 테스트.
 * 유저가 실제로 할 법한 변경(설정 값 수정 + 뉴스 추가)을 가한 뒤 빌드하여
 * 산출물에 제대로 반영되는지 검증하고, 끝나면 원상복구한다.
 *
 *   실행: node tests/scenario/run-scenario.mjs   (또는 npm run test:scenario)
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const cfgPath = path.join(root, "configs/site.yml");
const newsPath = path.join(root, "contents/news/2099-12-31.md");
const cfgBackup = fs.readFileSync(cfgPath, "utf-8");

let failed = false;
const assert = (cond, msg) => {
  if (cond) {
    console.log("  ✓", msg);
  } else {
    failed = true;
    console.error("  ✗", msg);
  }
};

try {
  console.log("[scenario] applying user-style changes (config + new news)...");
  const modified = cfgBackup
    .replace(/accent_color:\s*"[^"]*"/, 'accent_color: "#0d9488"')
    .replace(/display_name:\s*"[^"]*"/, 'display_name: "Scenario Tester"');
  fs.writeFileSync(cfgPath, modified);
  fs.writeFileSync(newsPath, "---\ndate: 2099-12-31\n---\n\n🧪 Scenario test news item.\n");

  console.log("[scenario] rebuilding...");
  execSync("npm run build", { cwd: root, stdio: "ignore" });

  console.log("[scenario] asserting output reflects the changes:");
  const home = fs.readFileSync(path.join(root, "dist/index.html"), "utf-8");
  assert(home.includes("#0d9488"), "changed accent_color is applied site-wide");
  assert(home.includes("Scenario Tester"), "changed display_name appears on home");
  assert(home.includes("Scenario test news item"), "new news item shows in latest-5 on home");
  const newsPage = fs.readFileSync(path.join(root, "dist/news/index.html"), "utf-8");
  assert(newsPage.includes("Scenario test news item"), "new news item shows on /news/ archive");
} finally {
  console.log("[scenario] restoring originals + clean rebuild...");
  fs.writeFileSync(cfgPath, cfgBackup);
  if (fs.existsSync(newsPath)) fs.rmSync(newsPath);
  execSync("npm run build", { cwd: root, stdio: "ignore" });
}

if (failed) {
  console.error("[scenario] FAILED");
  process.exit(1);
}
console.log("[scenario] ALL PASSED");
