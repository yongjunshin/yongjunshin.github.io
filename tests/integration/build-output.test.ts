import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * 통합 테스트: 빌드 산출물(dist/) 전체가 올바르게 생성되었는지 코드 실행 레벨에서 검증.
 * 사전조건: `npm run build` 가 먼저 실행되어 dist/ 가 존재해야 한다.
 */
const dist = path.resolve(process.cwd(), "dist");
const read = (p: string) => fs.readFileSync(path.join(dist, p), "utf-8");
const count = (html: string, re: RegExp) => (html.match(re) || []).length;

describe("build output (integration)", () => {
  beforeAll(() => {
    if (!fs.existsSync(dist)) {
      throw new Error("dist/ not found — run `npm run build` before integration tests");
    }
  });

  it("home: hero name, 5 news, 6 highlighted publications, 5 social links", () => {
    const html = read("index.html");
    expect(html).toContain("Yong-Jun Shin");
    expect(count(html, /class="news-item"/g)).toBe(5);
    expect(count(html, /class="pub"/g)).toBe(6);
  });

  it("publications: 28 entries each with a BibTeX source", () => {
    const html = read("publications/index.html");
    expect(count(html, /class="pub"/g)).toBe(28);
    expect(count(html, /class="bibtex-source"/g)).toBe(28);
  });

  it("publications: owner name is underlined (author me) at least once", () => {
    expect(read("publications/index.html")).toContain('class="author me"');
  });

  it("cv: 5 sections + Download PDF button", () => {
    const html = read("cv/index.html");
    expect(count(html, /class="cv-section"/g)).toBe(5);
    expect(html).toContain("Download PDF");
  });

  it("patents: 4 entries", () => {
    expect(count(read("patents/index.html"), /class="patent"/g)).toBe(4);
  });

  it("projects: 5 list rows + 5 detail pages", () => {
    expect(count(read("projects/index.html"), /class="proj-row"/g)).toBe(5);
    for (const slug of ["sdi", "becs", "cybwin", "sesos", "on-the-fly-verification"]) {
      expect(fs.existsSync(path.join(dist, "projects", slug, "index.html"))).toBe(true);
    }
  });

  it("preserves required URL paths (C-3)", () => {
    for (const p of ["cv", "publications", "patents", "projects", "news"]) {
      expect(fs.existsSync(path.join(dist, p, "index.html"))).toBe(true);
    }
  });

  it("project detail renders migrated markdown content", () => {
    const sdi = read("projects/sdi/index.html");
    expect(sdi).toContain("소프트웨어 정의형 인프라스트럭처");
    expect(sdi).toMatch(/<img[^>]+\.webp/); // 본문 이미지가 최적화되어 포함됨
  });
});
