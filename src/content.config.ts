import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * 콘텐츠 컬렉션은 모두 프로젝트 루트의 contents/ 폴더를 가리킨다.
 * 오너는 contents/ 안의 파일만 추가/수정하면 된다 (제약 C-6, NFR-MAINT).
 */

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./contents/news" }),
  schema: z.object({
    date: z.coerce.date(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./contents/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    institution: z.string().optional(),
    role: z.string().optional(),
    period: z.string(), // 화면 표기용, 예: "2024 – Present"
    start_year: z.number(), // 시간 역순 정렬 키
    end_year: z.number().nullable().optional(), // null/없음 = 진행중(Present)
    importance: z.number().optional(),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: "*.md", base: "./contents/home" }),
  schema: z.object({}).passthrough(),
});

export const collections = { news, projects, home };
