export interface ArticleCardProps {
  readonly item: Record<string, unknown>;
  readonly showDek?: boolean;
  readonly imageRatio?: "landscape" | "square";
}

export type ArticleCard = (props: ArticleCardProps, theme: unknown) => unknown;
