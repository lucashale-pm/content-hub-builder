export interface Theme {
  readonly brand: "gamesradar" | "pcgamer";
  readonly color: { readonly accent: string; readonly surface: string; readonly text: string };
  readonly font: { readonly display: string; readonly body: string };
  readonly radius: { readonly card: string };
}
