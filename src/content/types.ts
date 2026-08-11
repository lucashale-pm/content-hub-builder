export type ContentType = "article" | "video" | "gallery";

export interface MediaAsset {
  readonly id: string;
  readonly type: "image" | "video";
  readonly url: string;
  readonly alt: string;
  readonly credit?: string;
}

export interface ContentItem {
  readonly id: string;
  readonly type: ContentType;
  readonly title: string;
  readonly dek?: string;
  readonly url: string;
  readonly image?: MediaAsset;
  readonly tags: readonly string[];
  readonly publishedAt?: string;
}

export interface ContentRepository {
  getByIds(ids: readonly string[]): readonly ContentItem[];
  findByTags(tags: readonly string[]): readonly ContentItem[];
}
