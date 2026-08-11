const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderRankingsTable(values, theme) {
  const section = document.createElement("section");
  const brand = theme?.brand === "pcgamer" ? "pcgamer" : "gamesradar";
  const isRanking = values.displayType !== "Table";
  section.className = "hub-rankings-table";
  section.dataset.component = "rankings-table";
  section.dataset.theme = brand;
  section.dataset.display = isRanking ? "rankings" : "table";
  section.style.setProperty("--hub-rankings-surface", theme?.color?.surface || "#161616");
  section.style.setProperty("--hub-rankings-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-rankings-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-rankings-text", theme?.color?.text || "#ffffff");
  section.style.setProperty("--hub-rankings-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-rankings-border", theme?.color?.border || "#e6e6e6");
  section.style.setProperty("--hub-rankings-accent", theme?.color?.rankingAccent || theme?.color?.accent || "#6bdd73");
  section.style.setProperty("--hub-rankings-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-rankings-body-font", theme?.font?.body || "Figtree, sans-serif");
  const heading = text(values.heading);
  const subheading = text(values.subheading);
  if (heading || subheading) {
    const header = document.createElement("header");
    header.className = "hub-rankings-table__header";
    if (heading) { const title = document.createElement("h2"); title.textContent = heading; header.append(title); }
    if (subheading) { const copy = document.createElement("p"); copy.textContent = subheading; header.append(copy); }
    section.append(header);
  }
  const rows = Array.isArray(values.rows) ? values.rows.filter((row) => text(row?.title)) : [];
  if (rows.length) {
    const list = document.createElement("ol");
    list.className = "hub-rankings-table__rows";
    rows.forEach((row, index) => {
      const item = document.createElement("li");
      item.className = "hub-rankings-table__row";
      if (isRanking) { const rank = document.createElement("span"); rank.className = "hub-rankings-table__rank"; rank.textContent = String(index + 1); item.append(rank); }
      const iconUrl = text(row.iconUrl);
      if (iconUrl) { const image = document.createElement("img"); image.className = "hub-rankings-table__icon"; image.src = iconUrl; image.alt = ""; item.append(image); }
      const title = document.createElement("p"); title.className = "hub-rankings-table__title"; title.textContent = text(row.title); item.append(title);
      if (!isRanking && text(row.value)) { const value = document.createElement("span"); value.className = "hub-rankings-table__value"; value.textContent = text(row.value); item.append(value); }
      const ctaText = text(row.ctaText); const ctaUrl = text(row.ctaUrl);
      if (ctaText && ctaUrl) { const link = document.createElement("a"); link.className = "hub-rankings-table__row-cta"; link.href = ctaUrl; link.textContent = ctaText; item.append(link); }
      list.append(item);
    });
    section.append(list);
  }
  const footerText = text(values.footerCtaText); const footerUrl = text(values.footerCtaUrl);
  if (footerText && footerUrl) { const link = document.createElement("a"); link.className = "hub-rankings-table__footer-cta"; link.href = footerUrl; link.textContent = footerText; section.append(link); }
  section.hidden = !heading && !subheading && !rows.length;
  return section;
}
