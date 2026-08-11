import type { Theme } from "../../themes/types";

export interface SteamDataProps {
  readonly appId: string;
}

export type SteamData = (props: SteamDataProps, theme: Theme) => HTMLElement;
