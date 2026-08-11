import type { Theme } from "../../themes/types";

export interface GalleryImage {
  readonly imageUrl?: string;
  readonly imageAlt?: string;
}

export interface ImageGalleryProps {
  readonly heading?: string;
  readonly images?: readonly GalleryImage[];
}

export type ImageGallery = (props: ImageGalleryProps, theme: Theme) => HTMLElement;
