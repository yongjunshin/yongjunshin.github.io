import fs from "node:fs";
import path from "node:path";
import { parseBibtex, type Publication } from "./bibtex";
import { sortByYearDesc } from "./sort";

/**
 * 논문 에셋(preview/pdf/slides)은 contents/publications/ 안에 보관하고,
 * Vite 의 import.meta.glob 으로 빌드 시 해시 URL 로 변환한다.
 * (개인 에셋이 contents/ 에 있으면서도 정상 서빙됨 — 제약 C-6)
 */
const previewMods = import.meta.glob("/contents/publications/previews/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const pdfMods = import.meta.glob("/contents/publications/pdfs/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const slideMods = import.meta.glob("/contents/publications/slides/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/** {경로: URL} → {소문자 파일명: URL} (대소문자 불일치에도 견고하게 매칭). */
function basenameMap(mods: Record<string, string>): Map<string, string> {
  const m = new Map<string, string>();
  for (const [key, url] of Object.entries(mods)) {
    m.set(path.basename(key).toLowerCase(), url);
  }
  return m;
}

const previews = basenameMap(previewMods);
const pdfs = basenameMap(pdfMods);
const slides = basenameMap(slideMods);

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
