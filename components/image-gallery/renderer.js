const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderImageGallery(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-image-gallery";
  section.dataset.component = "image-gallery";
  section.style.setProperty("--hub-gallery-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-gallery-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-gallery-accent", theme?.color?.accent || "#ff6600");
  section.style.setProperty("--hub-gallery-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-gallery-muted", theme?.color?.muted || "#737373");

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

    const controls = document.createElement("div");
    controls.className = "hub-image-gallery__controls";
    const metrics = document.createElement("div");
    metrics.className = "hub-image-gallery__metrics";
    [["comments", "💬"], ["reactions", "♡"]].forEach(([field, icon]) => {
      if (!text(values[field])) return;
      const metric = document.createElement("span"); metric.className = "hub-image-gallery__metric"; metric.setAttribute("aria-label", `${text(values[field])} ${field}`);
      const metricIcon = document.createElement("span"); metricIcon.className = "hub-image-gallery__metric-icon"; metricIcon.textContent = icon;
      metric.append(metricIcon, document.createTextNode(text(values[field]))); metrics.append(metric);
    });
    if (metrics.childElementCount) controls.append(metrics);

    if (images.length > 1) {
      const count = document.createElement("span");
      count.className = "hub-image-gallery__count";
      count.setAttribute("aria-live", "polite");
      gallery.append(count);
      const dots = document.createElement("div");
      dots.className = "hub-image-gallery__dots";
      dots.setAttribute("aria-label", "Choose gallery image");

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
        count.textContent = `${activeIndex + 1} / ${images.length}`;
      };
      track.addEventListener("scroll", setActive, { passive: true });
      setActive();
      controls.append(dots);
    }
    if (controls.childElementCount) gallery.append(controls);
    section.append(gallery);
  }
  section.hidden = !heading && !images.length;
  return section;
}
