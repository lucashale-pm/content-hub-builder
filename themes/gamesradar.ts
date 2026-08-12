import type { Theme } from "./types";

export const gamesradarTheme: Theme = {
  brand: "gamesradar",
  color: { accent: "#ff6600", rankingAccent: "#6bdd73", contributionAccent: "#008a80", contributionIconSurface: "#f2f2f4", contributionProgressSurface: "#eceef0", surface: "#161616", text: "#ffffff", background: "#ffffff", ink: "#1a1a1a", muted: "#737373", border: "#e6e6e6", labelNews: "#008a80", labelAnalysis: "#7156c8", labelGuide: "#a85c00" },
  font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" },
  typography: {
    h1: { fontFamily: "Figtree, sans-serif", fontSize: "clamp(40px, 13vw, 64px)", fontWeight: 400, lineHeight: ".9", letterSpacing: "-.04em" },
  },
  radius: { card: "16px" },
};
