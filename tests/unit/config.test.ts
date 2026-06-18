import { describe, it, expect } from "vitest";
import { getSiteConfig, socialUrl } from "../../src/lib/config";

describe("getSiteConfig", () => {
  it("loads configs/site.yml and caches the result", () => {
    const c1 = getSiteConfig();
    const c2 = getSiteConfig();
    expect(c1.display_name).toBe("Yong-Jun Shin");
    expect(c1.accent_color).toMatch(/^#/);
    expect(Array.isArray(c1.my_name_aliases)).toBe(true);
    expect(c2).toBe(c1); // 두 번째 호출은 캐시된 동일 참조
  });
});

describe("socialUrl", () => {
  it("builds a URL for each platform", () => {
    expect(socialUrl("email", "a@b.com")).toBe("mailto:a@b.com");
    expect(socialUrl("orcid", "0000-0001")).toBe("https://orcid.org/0000-0001");
    expect(socialUrl("google_scholar", "XYZ")).toBe(
      "https://scholar.google.com/citations?user=XYZ",
    );
    expect(socialUrl("github", "user")).toBe("https://github.com/user");
    expect(socialUrl("linkedin", "user")).toBe("https://www.linkedin.com/in/user");
  });
  it("returns null for empty/undefined value", () => {
    expect(socialUrl("email", undefined)).toBeNull();
    expect(socialUrl("github", "")).toBeNull();
  });
  it("returns null for an unknown key (default branch)", () => {
    expect(socialUrl("unknown" as never, "x")).toBeNull();
  });
});
