const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderImageGallery(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-image-gallery";
  section.dataset.component = "image-gallery";
  section.style.setProperty("--hub-gallery-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-gallery-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-gallery-accent", theme?.color?.accent || "#ff6600");
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
    const gallery = document.createElement("div");
    gallery.className = "hub-image-gallery__gallery";
    const track = document.createElement("div");
    track.className = "hub-image-gallery__track";
    track.tabIndex = 0;
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
    gallery.append(track);

    if (images.length > 1) {
      const controls = document.createElement("div");
      controls.className = "hub-image-gallery__controls";
      controls.setAttribute("aria-label", "Gallery controls");
      const previous = document.createElement("button");
      previous.className = "hub-image-gallery__arrow";
      previous.type = "button";
      previous.setAttribute("aria-label", "Previous image");
      previous.textContent = "←";
      const dots = document.createElement("div");
      dots.className = "hub-image-gallery__dots";
      dots.setAttribute("aria-label", "Choose gallery image");
      const next = document.createElement("button");
      next.className = "hub-image-gallery__arrow";
      next.type = "button";
      next.setAttribute("aria-label", "Next image");
      next.textContent = "→";

      const dotButtons = images.map((_, index) => {
        const dot = document.createElement("button");
        dot.className = "hub-image-gallery__dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Show image ${index + 1}`);
        dot.addEventListener("click", () => track.scrollTo({ left: track.clientWidth * index, behavior: "smooth" }));
        dots.append(dot);
        return dot;
      });
      const setActive = () => {
        const activeIndex = Math.min(images.length - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
        dotButtons.forEach((dot, index) => {
          const isActive = index === activeIndex;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-current", isActive ? "true" : "false");
        });
        previous.disabled = activeIndex === 0;
        next.disabled = activeIndex === images.length - 1;
      };
      previous.addEventListener("click", () => track.scrollBy({ left: -track.clientWidth, behavior: "smooth" }));
      next.addEventListener("click", () => track.scrollBy({ left: track.clientWidth, behavior: "smooth" }));
      track.addEventListener("scroll", setActive, { passive: true });
      setActive();
      controls.append(previous, dots, next);
      gallery.append(controls);
    }
    section.append(gallery);
  }
  section.hidden = !heading && !images.length;
  return section;
}
