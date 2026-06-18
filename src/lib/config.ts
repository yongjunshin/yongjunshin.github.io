import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

/**
 * 사이트 설정. 모든 개인정보/링크는 configs/site.yml 에서 읽는다 (제약 C-6).
 * 코드에는 개인정보를 하드코딩하지 않는다.
 */
export interface SiteLinks {
  email?: string;
  orcid?: string;
  google_scholar?: string;
  github?: string;
  linkedin?: string;
}

export interface SiteConfig {
  site_url: string;
  site_title: string;
  nav_brand: string;
  display_name: string;
  role_subtitle: string;
  my_name_aliases: string[];
  links: SiteLinks;
  home_news_count: number;
  cv_pdf_filename: string;
  copyright_name: string;
  accent_color: string;
}

let _cache: SiteConfig | null = null;

export function getSiteConfig(): SiteConfig {
  if (_cache) return _cache;
  const file = path.resolve(process.cwd(), "configs/site.yml");
  const raw = fs.readFileSync(file, "utf-8");
  _cache = yaml.load(raw) as SiteConfig;
  return _cache;
}

/** Resolve an external URL for a given social link key. Empty value -> null. */
export function socialUrl(key: keyof SiteLinks, value: string | undefined): string | null {
  if (!value) return null;
  switch (key) {
    case "email":
      return `mailto:${value}`;
    case "orcid":
      return `https://orcid.org/${value}`;
    case "google_scholar":
      return `https://scholar.google.com/citations?user=${value}`;
    case "github":
      return `https://github.com/${value}`;
    case "linkedin":
      return `https://www.linkedin.com/in/${value}`;
    default:
      return null;
  }
}
