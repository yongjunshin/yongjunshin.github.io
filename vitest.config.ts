import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    coverage: {
      provider: "v8",
      // 순수 기능 로직 모듈만 커버리지 대상 (branch 100% 요구).
      // fs / import.meta.glob 을 쓰는 데이터 로더는 통합/E2E 로 검증한다.
      include: [
        "src/lib/bibtex.ts",
        "src/lib/authors.ts",
        "src/lib/format.ts",
        "src/lib/sort.ts",
        "src/lib/config.ts",
      ],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
      reporter: ["text-summary"],
    },
  },
});
