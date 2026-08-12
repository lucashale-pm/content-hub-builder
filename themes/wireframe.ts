import type { Theme } from "./types";

export const wireframeTheme: Theme = {
  brand: "wireframe",
  color: {
    accent: "#171717", rankingAccent: "#171717", contributionIconSurface: "#f4f4f5", contributionProgressSurface: "#e4e4e7",
    surface: "#171717", text: "#ffffff", background: "#ffffff", ink: "#171717", muted: "#737373", border: "#d4d4d8",
    labelNews: "#525252", labelAnalysis: "#525252", labelGuide: "#525252",
  },
  font: { display: "Arial, sans-serif", body: "Arial, sans-serif" },
  typography: { h1: { fontFamily: "Arial, sans-serif", fontSize: "48px", fontWeight: 700, lineHeight: "1", letterSpacing: "-.035em" } },
  typeScale: { display: "48px", h2: "24px", h3: "20px", body: "16px", small: "14px", label: "12px" },
  radius: { card: "12px" },
};
