export interface Theme {
  readonly brand: "gamesradar" | "pcgamer";
  readonly color: {
    readonly accent: string;
    readonly surface: string;
    readonly text: string;
    readonly background: string;
    readonly ink: string;
    readonly muted: string;
    readonly border: string;
    readonly labelNews: string;
    readonly labelAnalysis: string;
    readonly labelGuide: string;
  };
  readonly font: { readonly display: string; readonly body: string };
  readonly typography: {
    readonly h1: {
      readonly fontFamily: string;
      readonly fontSize: string;
      readonly fontWeight: number;
      readonly lineHeight: string;
      readonly letterSpacing: string;
    };
  };
  readonly radius: { readonly card: string };
}
