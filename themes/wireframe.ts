import type { Theme } from "./types";

export const wireframeTheme: Theme = {
  brand: "wireframe",
  color: {
    accent: "#171717", rankingAccent: "#171717", contributionIconSurface: "#f4f4f5", contributionProgressSurface: "#e4e4e7",
    surface: "#171717", text: "#ffffff", background: "#ffffff", ink: "#171717", muted: "#737373", border: "#d4d4d8",
    labelNews: "#525252", labelAnalysis: "#525252", labelGuide: "#525252",
  },
  font: { display: "Arial, sans-serif", body: "Arial, sans-serif" },
  typography: { h1: { fontFamily: "Arial, sans-serif", fontSize: "clamp(40px, 13vw, 56px)", fontWeight: 700, lineHeight: ".98", letterSpacing: "-.035em" } },
  radius: { card: "12px" },
};
