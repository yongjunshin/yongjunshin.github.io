import { describe, it, expect } from "vitest";
import { formatPatentDate, formatNewsDate } from "../../src/lib/format";

describe("formatPatentDate", () => {
  it("formats a valid ISO date", () => {
    expect(formatPatentDate("2024-12-23")).toBe("December 23, 2024");
    expect(formatPatentDate("2021-05-12")).toBe("May 12, 2021");
  });
  it("returns input unchanged when format does not match", () => {
    expect(formatPatentDate("23-12-2024")).toBe("23-12-2024");
  });
  it("returns input unchanged when month is out of range", () => {
    expect(formatPatentDate("2024-13-01")).toBe("2024-13-01");
  });
});

describe("formatNewsDate", () => {
  it("formats a Date as YYYY.MM.DD (UTC)", () => {
    expect(formatNewsDate(new Date("2026-06-17T00:00:00Z"))).toBe("2026.06.17");
    expect(formatNewsDate(new Date("2024-02-05T00:00:00Z"))).toBe("2024.02.05");
  });
});
