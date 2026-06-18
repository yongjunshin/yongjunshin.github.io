import { describe, it, expect } from "vitest";
import { authorDisplay, normalizeName, isMe } from "../../src/lib/authors";

describe("authorDisplay", () => {
  it("joins firstName + lastName, or lastName only", () => {
    expect(authorDisplay({ lastName: "Shin", firstName: "Yong-Jun" })).toBe("Yong-Jun Shin");
    expect(authorDisplay({ lastName: "현상원" })).toBe("현상원");
  });
});

describe("normalizeName", () => {
  it("lowercases and strips punctuation/space (keeps hangul)", () => {
    expect(normalizeName("Shin, Yong-Jun")).toBe("shinyongjun");
    expect(normalizeName("현 상원")).toBe("현상원");
  });
});

describe("isMe", () => {
  const aliases = ["Yong-Jun Shin", "Shin, Yong-Jun", "Shin"];

  it("matches the owner in 'First Last' form", () => {
    expect(isMe({ lastName: "Shin", firstName: "Yong-Jun" }, aliases)).toBe(true);
  });
  it("matches when only lastName is present (firstName absent branch)", () => {
    expect(isMe({ lastName: "Shin" }, aliases)).toBe(true);
  });
  it("does not match other people", () => {
    expect(isMe({ lastName: "Lee", firstName: "Junhee" }, aliases)).toBe(false);
    expect(isMe({ lastName: "현상원" }, aliases)).toBe(false);
  });
  it("ignores empty candidates (no false positive on empty name)", () => {
    expect(isMe({ lastName: "" }, [""])).toBe(false);
  });
});
