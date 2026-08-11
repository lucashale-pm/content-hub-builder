import type { ContentItem } from "../../src/content/types";
import type { ArticleCard } from "../article-card/component";
import type { Theme } from "../../themes/types";

export interface ContentCarouselProps {
  readonly title: string;
  readonly items: readonly ContentItem[];
  readonly card: ArticleCard;
  readonly cardOptions?: Readonly<Record<string, unknown>>;
}

export type ContentCarousel = (props: ContentCarouselProps, theme: Theme) => unknown;
