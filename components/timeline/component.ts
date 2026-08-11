export type TimelineEvent = {
  date: string;
  year: string;
  heading: string;
  paragraph: string;
  author?: string;
  linkText?: string;
  linkUrl?: string;
};

export type TimelineProps = {
  heading: string;
  subheading?: string;
  events: TimelineEvent[];
  followCtaText?: string;
  followCtaUrl?: string;
};
