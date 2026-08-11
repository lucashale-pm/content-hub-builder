import type { ContentRepository } from "../content/types";
import type { HubPageConfig, SectionConfig } from "../../pages/types";

export type SectionRenderer = (section: SectionConfig, itemIds: readonly string[]) => unknown;

export function resolveSectionIds(section: SectionConfig, content: ContentRepository): readonly string[] {
  const items = section.selection.kind === "ids"
    ? content.getByIds(section.selection.ids)
    : content.findByTags(section.selection.tags).slice(0, section.selection.limit);
  return items.map((item) => item.id);
}

export function renderPage(page: HubPageConfig, content: ContentRepository, render: SectionRenderer): readonly unknown[] {
  return page.sections.map((section) => render(section, resolveSectionIds(section, content)));
}
