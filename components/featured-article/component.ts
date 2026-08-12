export type FeaturedContentProps = {
  contentType: "Article" | "YouTube video";
  heading?: string;
  subheading?: string;
  label?: string;
  title: string;
  summary?: string;
  imageUrl: string;
  imageAlt?: string;
  author?: string;
  avatarUrl?: string;
  posted?: string;
  comments?: string;
  reactions?: string;
  href?: string;
  videoUrl?: string;
};
