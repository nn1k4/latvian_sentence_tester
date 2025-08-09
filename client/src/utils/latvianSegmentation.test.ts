import { splitIntoSentencesAdvanced } from "./latvianSegmentation";

describe("splitIntoSentencesAdvanced", () => {
  it("splits text into sentences", () => {
    const text = "Anna pamostas agri. Viņas mammai šodien ir dzimšanas diena.";
    expect(splitIntoSentencesAdvanced(text)).toEqual([
      "Anna pamostas agri.",
      "Viņas mammai šodien ir dzimšanas diena.",
    ]);
  });

  it("handles abbreviations and dates", () => {
    const text = "Dr. Bērziņš strādā u.c. darbus. Tikšanās notiks 15. janvārī.";
    expect(splitIntoSentencesAdvanced(text)).toEqual([
      "Dr. Bērziņš strādā u.c. darbus.",
      "Tikšanās notiks 15. janvārī.",
    ]);
  });
});
