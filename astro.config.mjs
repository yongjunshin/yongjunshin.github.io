// @ts-check
import { defineConfig } from "astro/config";
import fs from "node:fs";
import yaml from "js-yaml";

// 개인정보(사이트 URL 포함)는 코드가 아니라 configs/site.yml 에서 읽습니다 (제약 C-6).
const site = /** @type {{ site_url: string }} */ (
  yaml.load(fs.readFileSync(new URL("./configs/site.yml", import.meta.url), "utf-8"))
);

// https://astro.build/config
export default defineConfig({
  site: site.site_url,
  base: "/",
  // contents/ 를 정적 서빙 폴더로 사용한다. 덕분에 오너는 PDF·이미지를 포함한 모든 콘텐츠를
  // contents/ 한 곳에만 두면 되고, 그 안의 파일은 dev·프로덕션 모두에서 그대로 서빙된다(404 없음).
  publicDir: "./contents",
  // /cv/ -> /cv/index.html 형태로 출력해 기존 URL 경로를 보존합니다 (제약 C-3).
  build: { format: "directory" },
  trailingSlash: "ignore",
});
