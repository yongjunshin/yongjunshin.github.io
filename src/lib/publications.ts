import fs from "node:fs";
import path from "node:path";
import { parseBibtex, type Publication } from "./bibtex";
import { sortByYearDesc } from "./sort";

/**
 * 논문 에셋(preview/pdf/slides)은 contents/publications/ 아래에 보관한다.
 * contents/ 는 Astro 의 정적 서빙 폴더(publicDir)이므로 그 안의 파일은 dev·프로덕션 모두에서
 * 안정적으로 서빙된다(브라우저 네비게이션 포함). 디렉토리 구조가 그대로 URL 경로가 된다.
 * 빌드/SSR 시 디렉토리를 읽어 {소문자 파일명 → URL} 맵을 만든다 (대소문자 불일치에도 견고).
 */
const CONTENTS_DIR = path.resolve(process.cwd(), "contents");

function buildUrlMap(relDir: string, urlBase: string): Map<string, string> {
  const dir = path.join(CONTENTS_DIR, relDir);
  const map = new Map<string, string>();
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      map.set(file.toLowerCase(), `${urlBase}/${encodeURIComponent(file)}`);
    }
  }
  return map;
}

const previews = buildUrlMap("publications/previews", "/publications/previews");
const pdfs = buildUrlMap("publications/pdfs", "/publications/pdfs");
const slides = buildUrlMap("publications/slides", "/publications/slides");

function lookup(map: Map<string, string>, filename?: string): string | undefined {
  if (!filename) return undefined;
  // 외부 URL(예: pdf={https://arxiv.org/...})은 그대로 사용 (al-folio 호환)
  if (filename.includes("://")) return filename;
  return map.get(filename.toLowerCase());
}

/** 에셋 URL 이 해석된 논문. */
export interface ResolvedPublication extends Publication {
  previewUrl?: string;
  pdfUrl?: string;
  slidesUrl?: string;
  posterUrl?: string;
}

function resolveAssets(pub: Publication): ResolvedPublication {
  return {
    ...pub,
    previewUrl: lookup(previews, pub.preview),
    pdfUrl: lookup(pdfs, pub.pdf),
    slidesUrl: lookup(slides, pub.slides),
    posterUrl: lookup(slides, pub.poster),
  };
}

let _cache: ResolvedPublication[] | null = null;

/** 모든 논문, 연도 역순 정렬 + 에셋 해석. */
export function getPublications(): ResolvedPublication[] {
  if (_cache) return _cache;
  const file = path.resolve(process.cwd(), "contents/publications/papers.bib");
  const raw = fs.readFileSync(file, "utf-8");
  _cache = sortByYearDesc(parseBibtex(raw)).map(resolveAssets);
  return _cache;
}

/** highlight(selected=true) 논문만. */
export function getSelectedPublications(): ResolvedPublication[] {
  return getPublications().filter((p) => p.selected);
}
