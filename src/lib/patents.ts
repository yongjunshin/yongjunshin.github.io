import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { sortByDateDesc } from "./sort";

export interface Patent {
  title: string;
  title_en?: string;
  status: string;
  agency: string;
  number: string;
  inventors: string;
  date: string; // "YYYY-MM-DD"
}

/** YAML 의 date 가 따옴표 없이 적혀 Date 객체로 파싱돼도 안전하게 "YYYY-MM-DD" 문자열로 정규화. */
function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

export function getPatents(): Patent[] {
  const file = path.resolve(process.cwd(), "contents/patents/patents.yml");
  const raw = yaml.load(fs.readFileSync(file, "utf-8")) as Patent[];
  const list = raw.map((p) => ({ ...p, date: toIsoDate(p.date) }));
  return sortByDateDesc(list);
}
