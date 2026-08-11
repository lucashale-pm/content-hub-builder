export type RankingsTableRow = {
  title: string;
  iconUrl?: string;
  value?: string;
  ctaText?: string;
  ctaUrl?: string;
};

export type RankingsTableProps = {
  displayType: "Rankings" | "Table";
  heading?: string;
  subheading?: string;
  rows: RankingsTableRow[];
};
