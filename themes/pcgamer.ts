import type { Theme } from "./types";

export const pcgamerTheme: Theme = {
  brand: "pcgamer",
  color: { accent: "#e31b23", rankingAccent: "#e31b23", contributionIconSurface: "#f2f2f2", contributionProgressSurface: "#e7e7e7", surface: "#111111", text: "#ffffff", background: "#ffffff", ink: "#1a1a1a", muted: "#737373", border: "#e6e6e6", labelNews: "#b11f26", labelAnalysis: "#6b55ab", labelGuide: "#9c5900" },
  font: { display: "Roboto Condensed, sans-serif", body: "Arial, sans-serif" },
  typography: {
    h1: { fontFamily: "Roboto Condensed, sans-serif", fontSize: "clamp(40px, 13vw, 62px)", fontWeight: 700, lineHeight: ".92", letterSpacing: "-.025em" },
  },
  radius: { card: "0px" },
};
