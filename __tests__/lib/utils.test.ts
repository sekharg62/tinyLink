import { cn, generateCode, isValidUrl } from "@/lib/utils";

describe("cn", () => {
  it("merges class names correctly", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
    expect(cn("class1", undefined, "class2")).toBe("class1 class2");
  });
});

describe("generateCode", () => {
  it("generates a code of length between 6 and 8", () => {
    const code = generateCode();
    expect(code.length).toBeGreaterThanOrEqual(6);
    expect(code.length).toBeLessThanOrEqual(8);
  });

  it("generates only alphanumeric characters", () => {
    const code = generateCode();
    expect(/^[A-Za-z0-9]+$/.test(code)).toBe(true);
  });
});

describe("isValidUrl", () => {
  it("returns true for valid URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://example.com")).toBe(true);
    expect(isValidUrl("https://example.com/path")).toBe(true);
  });

  it("returns false for invalid URLs", () => {
    expect(isValidUrl("invalid")).toBe(false);
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("not-a-url")).toBe(false);
  });
});
