export type StanceChoice = { label: string; percent: string; emoji?: string };
export type StanceComment = { username: string; text: string; upvotes?: string; flairText?: string; flairColor?: string; flairTextColor?: "White" | "Black" };
export type StanceItem = {
  author?: string;
  role?: string;
  avatarUrl?: string;
  flairText?: string;
  flairColor?: string;
  flairTextColor?: "White" | "Black";
  statement?: string;
  body?: string;
  sourceText?: string;
  sourceUrl?: string;
  selectedChoice?: string;
  comments?: StanceComment[];
};

export type StanceProps = { heading?: string; subheading?: string; voteMode: "2 choices" | "5 choices"; twoChoices?: StanceChoice[]; spiceChoices?: StanceChoice[]; stances: StanceItem[] };
