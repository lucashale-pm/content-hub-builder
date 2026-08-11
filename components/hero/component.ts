import type { Theme } from "../../themes/types";

export type HeroMedia =
  | { readonly kind: "image"; readonly src: string; readonly alt: string }
  | { readonly kind: "video"; readonly src: string; readonly poster: string; readonly alt: string };

export interface HeroProps {
  readonly eyebrow?: string;
  readonly headline: string;
  readonly subheadline: string;
  readonly followers: string;
  readonly updated: string;
  readonly media: HeroMedia;
}

export type Hero = (props: HeroProps, theme: Theme) => HTMLElement;
