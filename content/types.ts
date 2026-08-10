export interface ContentItem {
  readonly id: string;
  readonly title: string;
  readonly dek?: string;
  readonly href: string;
  readonly imageUrl?: string;
  readonly imageAlt?: string;
  readonly tags?: readonly string[];
}
