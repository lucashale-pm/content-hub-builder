export type ContentSelection =
  | { readonly kind: "ids"; readonly ids: readonly string[] }
  | { readonly kind: "tags"; readonly tags: readonly string[]; readonly limit: number };

export interface SectionConfig {
  readonly id: string;
  readonly component: "content-carousel" | "content-grid";
  readonly title: string;
  readonly selection: ContentSelection;
  readonly options?: Readonly<Record<string, string | number | boolean>>;
}

export interface HubPageConfig {
  readonly id: string;
  readonly title: string;
  readonly sections: readonly SectionConfig[];
}
