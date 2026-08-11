export type RankingsTableRow = {
  rank?: string;
  title: string;
  iconUrl?: string;
  value?: string;
  movement?: "up" | "down" | "same";
  movementText?: string;
  ctaUrl?: string;
};

export type RankingsTableProps = {
  displayType: "Rankings" | "Table";
  heading?: string;
  subheading?: string;
  rows: RankingsTableRow[];
  rowCtaText?: string;
  footerCtaText?: string;
  footerCtaUrl?: string;
};
