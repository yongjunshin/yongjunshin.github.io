import { describe, it, expect } from "vitest";
import {
  sortByYearDesc,
  sortProjects,
  sortByDateDesc,
  sortNewsEntries,
  endYearKey,
  importanceKey,
  compareProjects,
} from "../../src/lib/sort";

describe("endYearKey", () => {
  it("maps a number to itself and null/undefined to +Infinity", () => {
    expect(endYearKey(2022)).toBe(2022);
    expect(endYearKey(null)).toBe(Number.POSITIVE_INFINITY);
    expect(endYearKey(undefined)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("importanceKey", () => {
  it("maps a number to itself and undefined to +Infinity", () => {
    expect(importanceKey(3)).toBe(3);
    expect(importanceKey(undefined)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("compareProjects", () => {
  it("orders by start year first", () => {
    expect(compareProjects({ start_year: 2024 }, { start_year: 2020 })).toBeLessThan(0);
    expect(compareProjects({ start_year: 2017 }, { start_year: 2020 })).toBeGreaterThan(0);
  });
  it("breaks ties by end year (present first)", () => {
    expect(
      compareProjects(
        { start_year: 2020, end_year: 2022 },
        { start_year: 2020, end_year: 2019 },
      ),
    ).toBeLessThan(0);
  });
  it("breaks remaining ties by importance ascending", () => {
    expect(
      compareProjects(
        { start_year: 2020, end_year: 2020, importance: 1 },
        { start_year: 2020, end_year: 2020, importance: 2 },
      ),
    ).toBeLessThan(0);
  });
});

describe("sortByYearDesc", () => {
  it("sorts by year descending, stable for ties", () => {
    const input = [
      { year: 2019, k: "a" },
      { year: 2024, k: "b" },
      { year: 2019, k: "c" },
    ];
    expect(sortByYearDesc(input).map((x) => x.k)).toEqual(["b", "a", "c"]);
  });
  it("does not mutate the input array", () => {
    const input = [{ year: 1 }, { year: 2 }];
    sortByYearDesc(input);
    expect(input.map((x) => x.year)).toEqual([1, 2]);
  });
});

describe("sortProjects", () => {
  it("sorts by start desc, then end desc (present first), then importance asc", () => {
    const input = [
      { id: "becs", start_year: 2020, end_year: 2022, importance: 2 },
      { id: "sdi", start_year: 2024, end_year: null },
      { id: "sesos", start_year: 2017, end_year: 2022, importance: 1 },
      { id: "onthefly", start_year: 2017, end_year: 2019, importance: 4 },
      { id: "becs2", start_year: 2020, end_year: 2019, importance: 9 },
    ];
    expect(sortProjects(input).map((x) => x.id)).toEqual([
      "sdi",
      "becs",
      "becs2",
      "sesos",
      "onthefly",
    ]);
  });
  it("orders same start+end by importance (undefined last)", () => {
    const input = [
      { id: "noimp", start_year: 2017, end_year: 2017 },
      { id: "imp5", start_year: 2017, end_year: 2017, importance: 5 },
    ];
    expect(sortProjects(input).map((x) => x.id)).toEqual(["imp5", "noimp"]);
  });
});

describe("sortByDateDesc", () => {
  it("sorts ISO date strings descending", () => {
    const input = [{ date: "2021-05-12" }, { date: "2024-12-23" }, { date: "2020-12-21" }];
    expect(sortByDateDesc(input).map((x) => x.date)).toEqual([
      "2024-12-23",
      "2021-05-12",
      "2020-12-21",
    ]);
  });
});

describe("sortNewsEntries", () => {
  it("sorts collection entries by data.date descending", () => {
    const input = [
      { id: "a", data: { date: new Date("2024-02-05T00:00:00Z") } },
      { id: "b", data: { date: new Date("2026-06-17T00:00:00Z") } },
    ];
    expect(sortNewsEntries(input).map((x) => x.id)).toEqual(["b", "a"]);
  });
});
