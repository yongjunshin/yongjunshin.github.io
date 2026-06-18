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

export function getPatents(): Patent[] {
  const file = path.resolve(process.cwd(), "contents/patents/patents.yml");
  const list = yaml.load(fs.readFileSync(file, "utf-8")) as Patent[];
  return sortByDateDesc(list);
}
