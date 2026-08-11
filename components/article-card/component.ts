import type { ContentItem } from "../../src/content/types";
import type { Theme } from "../../themes/types";

export interface ArticleCardProps {
  readonly item: ContentItem;
  readonly showDek?: boolean;
  readonly imageRatio?: "landscape" | "square";
}

export type ArticleCard = (props: ArticleCardProps, theme: Theme) => unknown;
