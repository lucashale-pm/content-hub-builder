import type { ArticleCard } from "../article-card/component";

export interface ContentCarouselProps {
  readonly title: string;
  readonly items: readonly Record<string, unknown>[];
  readonly card: ArticleCard;
  readonly cardOptions?: Readonly<Record<string, unknown>>;
}

export type ContentCarousel = (props: ContentCarouselProps, theme: unknown) => unknown;
