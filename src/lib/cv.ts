import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export interface CvItem {
  name?: string;
  value?: string;
  title?: string;
  institution?: string;
  url?: string;
  year?: string;
  details?: string[];
}

export interface CvSection {
  title: string;
  type: "map" | "timeline";
  contents: CvItem[];
}

export function getCv(): CvSection[] {
  const file = path.resolve(process.cwd(), "contents/cv/cv.yml");
  return yaml.load(fs.readFileSync(file, "utf-8")) as CvSection[];
}

/** configs 의 cv_pdf_filename 에 해당하는 PDF URL 을 contents/cv/ 에서 해석. */
const cvPdfMods = import.meta.glob("/contents/cv/*.pdf", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function getCvPdfUrl(filename: string): string | undefined {
  for (const [key, url] of Object.entries(cvPdfMods)) {
    if (key.endsWith("/" + filename)) return url;
  }
  return undefined;
}
