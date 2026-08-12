export type ContributionAction = { label: string; icon: string; href?: string };
export type ContributionRank = { name: string; threshold: string };
export type ContributionCard = { heading: string; body?: string; ctaText?: string; ctaUrl?: string };

export type ContributionTrackerProps = {
  heading?: string;
  expertiseHeading?: string;
  actions: ContributionAction[];
  currentRank: string;
  progressText?: string;
  progressPercent: string;
  ranks: ContributionRank[];
  cards: ContributionCard[];
};
