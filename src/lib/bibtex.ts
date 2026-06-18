import { parse } from "@retorquere/bibtex-parser";

/** 논문 저자. firstName 이 없을 수 있다(예: 한글 이름). */
export interface Author {
  firstName?: string;
  lastName: string;
}

/** 파싱된 논문 1건 (에셋 URL 해석 전). */
export interface Publication {
  key: string;
  type: string;
  title: string;
  authors: Author[];
  venue: string;
  year: number;
  selected: boolean;
  preview?: string;
  pdf?: string;
  website?: string;
  slides?: string;
  poster?: string;
  supp?: string;
  /** 화면 출력/복사용 깔끔한 BibTeX (내부 커스텀 필드 제거). */
  bibtex: string;
}

/** 출력 BibTeX 에서 제거할 al-folio 내부 커스텀 필드들. */
const CUSTOM_FIELDS = new Set([
  "selected",
  "preview",
  "pdf",
  "website",
  "slides",
  "poster",
  "supp",
  "bibtex_show",
  "abbr",
  "abstract",
  "altmetric",
  "arxiv",
  "blog",
  "code",
  "html",
  "dimensions",
]);

/** 파서가 string | string[] 로 줄 수 있는 값을 단일 문자열로 정규화. */
export function fieldToString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value.length > 0 ? String(value[0]) : undefined;
  return String(value);
}

/** journal → booktitle → publisher 순으로 출판지(venue) 선택. */
export function pickVenue(fields: Record<string, unknown>): string {
  return (
    fieldToString(fields.journal) ??
    fieldToString(fields.booktitle) ??
    fieldToString(fields.publisher) ??
    ""
  );
}

/** {lastName, firstName} 목록을 BibTeX author 문자열("Last, First and ...")로 직렬화. */
export function authorsToBibtex(authors: Author[]): string {
  return authors
    .map((a) => (a.firstName ? `${a.lastName}, ${a.firstName}` : a.lastName))
    .join(" and ");
}

interface RawEntry {
  type: string;
  key: string;
  fields: Record<string, unknown>;
}

/** 커스텀 필드를 제외한 깔끔한 BibTeX 문자열 생성. */
export function serializeEntry(entry: RawEntry): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(entry.fields)) {
    if (CUSTOM_FIELDS.has(k)) continue;
    if (k === "author") {
      parts.push(`  author = {${authorsToBibtex(v as Author[])}}`);
      continue;
    }
    const val = fieldToString(v);
    if (val !== undefined) parts.push(`  ${k} = {${val}}`);
  }
  return `@${entry.type}{${entry.key},\n${parts.join(",\n")}\n}`;
}

/** BibTeX 원문 → Publication[] (순수 함수, 정렬/에셋해석 없음). */
export function parseBibtex(raw: string): Publication[] {
  // sentenceCase:false → venue/title 의 원문 대소문자를 보존한다.
  const bib = parse(raw, { sentenceCase: false });
  return bib.entries.map((entry) => {
    const f = entry.fields as Record<string, unknown>;
    const authors: Author[] = ((f.author as Author[] | undefined) ?? []).map((a) => ({
      firstName: a.firstName,
      lastName: a.lastName,
    }));
    const year = Number.parseInt(fieldToString(f.year) ?? "", 10);
    return {
      key: entry.key,
      type: entry.type,
      title: fieldToString(f.title) ?? "",
      authors,
      venue: pickVenue(f),
      year: Number.isNaN(year) ? 0 : year,
      selected: /true/i.test(fieldToString(f.selected) ?? ""),
      preview: fieldToString(f.preview),
      pdf: fieldToString(f.pdf),
      website: fieldToString(f.website),
      slides: fieldToString(f.slides),
      poster: fieldToString(f.poster),
      supp: fieldToString(f.supp),
      bibtex: serializeEntry({ type: entry.type, key: entry.key, fields: f }),
    };
  });
}
