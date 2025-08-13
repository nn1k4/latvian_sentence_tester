import { isDatePattern } from "../latvianSegmentation";

describe("isDatePattern", () => {
  it("returns true for day and month", () => {
    const text = "Tikšanās notiks 15. janvārī";
    const dotIndex = text.indexOf(".");
    expect(isDatePattern(text, dotIndex)).toBe(true);
  });

  it("returns true for weekday abbreviations", () => {
    const text = "Tiksimies 5. pirmd.";
    const dotIndex = text.indexOf(".");
    expect(isDatePattern(text, dotIndex)).toBe(true);
  });

  it("returns false for non-date patterns", () => {
    const text = "Viņš nopirka 15. automašīnu";
    const dotIndex = text.indexOf(".");
    expect(isDatePattern(text, dotIndex)).toBe(false);
  });
});
