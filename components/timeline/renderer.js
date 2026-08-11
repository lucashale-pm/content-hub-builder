const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderTimeline(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-timeline";
  section.dataset.component = "timeline";
  section.style.setProperty("--hub-timeline-background", theme?.color?.surface || "#161616");
  section.style.setProperty("--hub-timeline-ink", theme?.color?.text || "#ffffff");
  section.style.setProperty("--hub-timeline-card-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-timeline-card-ink", theme?.color?.ink || "#1a1a1a");
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
  const subheading = text(values.subheading);
  if (subheading) {
    const element = document.createElement("p");
    element.className = "hub-timeline__subheading";
    element.textContent = subheading;
    section.append(element);
  }

  const events = Array.isArray(values.events) ? values.events.filter((event) => text(event?.heading)) : [];
  if (events.length) {
    const list = document.createElement("ol");
    list.className = "hub-timeline__list";
    const setExpanded = (nextItem) => {
      list.querySelectorAll(".hub-timeline__event").forEach((item) => {
        const isExpanded = item === nextItem;
        item.classList.toggle("is-expanded", isExpanded);
        item.querySelector(".hub-timeline__trigger")?.setAttribute("aria-expanded", String(isExpanded));
      });
    };
    events.forEach((event, index) => {
      const item = document.createElement("li");
      item.className = `hub-timeline__event${index === 0 ? " is-expanded" : ""}`;
      const trigger = document.createElement("button");
      trigger.className = "hub-timeline__trigger";
      trigger.type = "button";
      trigger.setAttribute("aria-expanded", String(index === 0));
      trigger.addEventListener("click", () => setExpanded(item));
      const marker = document.createElement("span");
      marker.className = "hub-timeline__marker";
      marker.setAttribute("aria-hidden", "true");
      const date = document.createElement("p");
      date.className = "hub-timeline__date";
      date.textContent = [text(event.date), text(event.year)].filter(Boolean).join(" ");
      const eventHeading = document.createElement("h3");
      eventHeading.className = "hub-timeline__event-heading";
      eventHeading.textContent = text(event.heading);
      const chevron = document.createElement("span");
      chevron.className = "hub-timeline__chevron";
      chevron.setAttribute("aria-hidden", "true");
      chevron.textContent = "▾";
      trigger.append(marker, date, eventHeading, chevron);
      const content = document.createElement("div");
      content.className = "hub-timeline__event-content";
      item.append(trigger, content);
      const author = text(event.author);
      if (author) {
        const byline = document.createElement("p");
        byline.className = "hub-timeline__author";
        byline.textContent = author;
        content.append(byline);
      }
      const paragraph = text(event.paragraph);
      if (paragraph) {
        const copy = document.createElement("p");
        copy.className = "hub-timeline__paragraph";
        copy.textContent = paragraph;
        content.append(copy);
      }
      const linkText = text(event.linkText);
      const linkUrl = text(event.linkUrl);
      if (linkText && linkUrl) {
        const link = document.createElement("a");
        link.className = "hub-timeline__link";
        link.href = linkUrl;
        link.textContent = linkText;
        content.append(link);
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
  section.hidden = !heading && !subheading && !events.length;
  return section;
}
