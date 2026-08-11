const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderTimeline(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-timeline";
  section.dataset.component = "timeline";
  section.style.setProperty("--hub-timeline-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-timeline-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-timeline-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-timeline-accent", theme?.color?.accent || "#ff6600");
  section.style.setProperty("--hub-timeline-border", theme?.color?.border || "#e6e6e6");
  section.style.setProperty("--hub-timeline-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-timeline-body-font", theme?.font?.body || "Figtree, sans-serif");

  const heading = text(values.heading);
  if (heading) {
    const element = document.createElement("h2");
    element.className = "hub-timeline__heading";
    element.textContent = heading;
    section.append(element);
  }

  const events = Array.isArray(values.events) ? values.events.filter((event) => text(event?.heading)) : [];
  if (events.length) {
    const list = document.createElement("ol");
    list.className = "hub-timeline__list";
    events.forEach((event) => {
      const item = document.createElement("li");
      item.className = "hub-timeline__event";
      const marker = document.createElement("span");
      marker.className = "hub-timeline__marker";
      marker.setAttribute("aria-hidden", "true");
      const date = document.createElement("p");
      date.className = "hub-timeline__date";
      date.textContent = [text(event.date), text(event.year)].filter(Boolean).join(" ");
      const eventHeading = document.createElement("h3");
      eventHeading.className = "hub-timeline__event-heading";
      eventHeading.textContent = text(event.heading);
      item.append(marker, date, eventHeading);
      const paragraph = text(event.paragraph);
      if (paragraph) {
        const copy = document.createElement("p");
        copy.className = "hub-timeline__paragraph";
        copy.textContent = paragraph;
        item.append(copy);
      }
      const linkText = text(event.linkText);
      const linkUrl = text(event.linkUrl);
      if (linkText && linkUrl) {
        const link = document.createElement("a");
        link.className = "hub-timeline__link";
        link.href = linkUrl;
        link.textContent = linkText;
        item.append(link);
      }
      list.append(item);
    });
    section.append(list);
  }

  const ctaText = text(values.followCtaText);
  const ctaUrl = text(values.followCtaUrl);
  if (ctaText && ctaUrl) {
    const cta = document.createElement("a");
    cta.className = "hub-timeline__cta";
    cta.href = ctaUrl;
    cta.textContent = ctaText;
    section.append(cta);
  }
  section.hidden = !heading && !events.length;
  return section;
}
