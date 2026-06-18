import { describe, it, expect } from "vitest";
import {
  fieldToString,
  pickVenue,
  authorsToBibtex,
  serializeEntry,
  parseBibtex,
} from "../../src/lib/bibtex";

describe("fieldToString", () => {
  it("returns undefined for undefined and null", () => {
    expect(fieldToString(undefined)).toBeUndefined();
    expect(fieldToString(null)).toBeUndefined();
  });
  it("handles arrays (empty -> undefined, non-empty -> first)", () => {
    expect(fieldToString([])).toBeUndefined();
    expect(fieldToString(["a", "b"])).toBe("a");
  });
  it("stringifies scalars", () => {
    expect(fieldToString("y")).toBe("y");
    expect(fieldToString(42)).toBe("42");
  });
});

describe("pickVenue", () => {
  it("prefers journal, then booktitle, then publisher, else empty", () => {
    expect(pickVenue({ journal: "J", booktitle: "B", publisher: "P" })).toBe("J");
    expect(pickVenue({ booktitle: "B", publisher: "P" })).toBe("B");
    expect(pickVenue({ publisher: "P" })).toBe("P");
    expect(pickVenue({})).toBe("");
  });
});

describe("authorsToBibtex", () => {
  it("serializes with and without firstName", () => {
    expect(
      authorsToBibtex([
        { lastName: "Shin", firstName: "Yong-Jun" },
        { lastName: "현상원" },
      ]),
    ).toBe("Shin, Yong-Jun and 현상원");
  });
});

describe("serializeEntry", () => {
  it("includes author + normal fields, skips custom + empty fields", () => {
    const out = serializeEntry({
      type: "article",
      key: "k",
      fields: {
        author: [{ lastName: "Doe", firstName: "J" }],
        title: "T",
        selected: "true", // custom -> skipped
        empty: [], // -> undefined -> skipped
      },
    });
    expect(out).toContain("@article{k,");
    expect(out).toContain("author = {Doe, J}");
    expect(out).toContain("title = {T}");
    expect(out).not.toContain("selected");
    expect(out).not.toContain("empty");
  });
});

describe("parseBibtex", () => {
  const bib = `
@article{a, title={Hello World}, author={Shin, Yong-Jun and Lee, Junhee}, journal={J Foo}, year={2024}, selected={true}, pdf={a.pdf}, preview={a.jpg}, website={http://x}, slides={s.pdf}, poster={p.pdf}, supp={http://s}}
@inproceedings{c, title={Conf Paper}, booktitle={Proc X}, year={2020}, selected={false}}
@phdthesis{d, title={Thesis}, publisher={KAIST}}
@misc{e}
`;
  const pubs = parseBibtex(bib);

  it("parses all entries", () => {
    expect(pubs).toHaveLength(4);
  });
  it("defaults missing title to empty string", () => {
    const e = pubs.find((p) => p.key === "e")!;
    expect(e.title).toBe("");
  });
  it("maps standard fields and selected=true", () => {
    const a = pubs.find((p) => p.key === "a")!;
    expect(a.title).toBe("Hello World");
    expect(a.authors).toHaveLength(2);
    expect(a.venue).toBe("J Foo");
    expect(a.year).toBe(2024);
    expect(a.selected).toBe(true);
    expect(a.pdf).toBe("a.pdf");
    expect(a.preview).toBe("a.jpg");
    expect(a.website).toBe("http://x");
    expect(a.slides).toBe("s.pdf");
    expect(a.poster).toBe("p.pdf");
    expect(a.supp).toBe("http://s");
    expect(a.bibtex).toContain("@article{a,");
  });
  it("handles selected=false and booktitle venue", () => {
    const c = pubs.find((p) => p.key === "c")!;
    expect(c.selected).toBe(false);
    expect(c.venue).toBe("Proc X");
  });
  it("handles missing year (-> 0) and missing author (-> [])", () => {
    const d = pubs.find((p) => p.key === "d")!;
    expect(d.year).toBe(0);
    expect(d.authors).toEqual([]);
    expect(d.venue).toBe("KAIST");
  });
});
