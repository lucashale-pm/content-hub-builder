import type { Theme } from "../../themes/types";

export interface PageContentProps {
  readonly heading?: string;
  readonly subheading?: string;
  readonly paragraphs?: readonly { readonly text?: string }[];
}

export type PageContent = (props: PageContentProps, theme: Theme) => HTMLElement;
