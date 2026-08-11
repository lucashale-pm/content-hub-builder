import type { ContentItem, ContentRepository } from "./types";

export class InMemoryContentRepository implements ContentRepository {
  constructor(private readonly items: readonly ContentItem[]) {}

  getByIds(ids: readonly string[]): readonly ContentItem[] {
    const byId = new Map(this.items.map((item) => [item.id, item]));
    return ids.flatMap((id) => {
      const item = byId.get(id);
      return item ? [item] : [];
    });
  }

  findByTags(tags: readonly string[]): readonly ContentItem[] {
    return this.items.filter((item) => tags.some((tag) => item.tags.includes(tag)));
  }
}
