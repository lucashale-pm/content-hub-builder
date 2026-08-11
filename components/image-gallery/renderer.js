const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderImageGallery(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-image-gallery";
  section.dataset.component = "image-gallery";
  section.style.setProperty("--hub-gallery-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-gallery-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-gallery-display-font", theme?.font?.display || "Figtree, sans-serif");

  const heading = text(values.heading);
  if (heading) {
    const element = document.createElement("h2");
    element.className = "hub-image-gallery__heading";
    element.textContent = heading;
    section.append(element);
  }

  const images = Array.isArray(values.images) ? values.images.slice(0, 6).filter((image) => text(image?.imageUrl)) : [];
  if (images.length) {
    const track = document.createElement("div");
    track.className = "hub-image-gallery__track";
    track.setAttribute("aria-label", heading || "Image gallery");
    images.forEach((image) => {
      const item = document.createElement("div");
      item.className = "hub-image-gallery__item";
      const media = document.createElement("img");
      media.className = "hub-image-gallery__image";
      media.src = text(image.imageUrl);
      media.alt = text(image.imageAlt);
      item.append(media);
      track.append(item);
    });
    section.append(track);
  }
  section.hidden = !heading && !images.length;
  return section;
}
