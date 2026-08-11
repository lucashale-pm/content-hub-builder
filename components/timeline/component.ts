export type TimelineEvent = {
  date: string;
  year: string;
  heading: string;
  paragraph: string;
  linkText?: string;
  linkUrl?: string;
};

export type TimelineProps = {
  heading: string;
  events: TimelineEvent[];
  followCtaText?: string;
  followCtaUrl?: string;
};
