import type { Theme } from "../../themes/types";

export interface VerticalVideoProps {
  readonly heading: string;
}

export type VerticalVideo = (props: VerticalVideoProps, theme: Theme) => HTMLElement;
