const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderPageContent(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-page-content";
  section.dataset.component = "page-content";
  section.style.setProperty("--hub-content-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-content-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-content-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-content-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-content-body-font", theme?.font?.body || "Figtree, sans-serif");

  const heading = text(values.heading);
  const subheading = text(values.subheading);
  const paragraphs = Array.isArray(values.paragraphs) ? values.paragraphs.map((paragraph) => text(paragraph?.text)).filter(Boolean) : [];
  if (heading) {
    const element = document.createElement("h2");
    element.className = "hub-page-content__heading";
    element.textContent = heading;
    section.append(element);
  }
  if (subheading) {
    const element = document.createElement("p");
    element.className = "hub-page-content__subheading";
    element.textContent = subheading;
    section.append(element);
  }
  paragraphs.forEach((paragraph) => {
    const element = document.createElement("p");
    element.className = "hub-page-content__paragraph";
    element.textContent = paragraph;
    section.append(element);
  });
  section.hidden = !heading && !subheading && !paragraphs.length;
  return section;
}
