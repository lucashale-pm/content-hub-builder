import type { Theme } from "../../themes/types";

export interface FeedArticle {
  readonly label: string;
  readonly title: string;
  readonly summary?: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly author: string;
  readonly avatarUrl: string;
  readonly posted: string;
  readonly comments: string;
  readonly reactions: string;
  readonly href: string;
}

export interface FeedProps {
  readonly eyebrow: string;
  readonly date: string;
  readonly featured: FeedArticle;
  readonly articles: readonly FeedArticle[];
  readonly loadMoreLabel: string;
}

export type Feed = (props: FeedProps, theme: Theme) => HTMLElement;
