const text = (value) => typeof value === "string" ? value.trim() : "";
const icons = {
  review: "https://cdn.jsdelivr.net/npm/lucide-static@0.468.0/icons/pen-line.svg",
  write: "https://cdn.jsdelivr.net/npm/lucide-static@0.468.0/icons/book-open.svg",
  answer: "https://cdn.jsdelivr.net/npm/lucide-static@0.468.0/icons/circle-help.svg",
  poll: "https://cdn.jsdelivr.net/npm/lucide-static@0.468.0/icons/chart-no-axes-column-increasing.svg"
};

export function renderContributionTracker(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-contribution-tracker";
  section.dataset.component = "contribution-tracker";
  section.style.setProperty("--hub-contribution-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-contribution-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-contribution-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-contribution-accent", theme?.color?.contributionAccent || theme?.color?.accent || "#009b8f");
  section.style.setProperty("--hub-contribution-border", theme?.color?.border || "#e6e6e6");
  section.style.setProperty("--hub-contribution-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-contribution-body-font", theme?.font?.body || "Figtree, sans-serif");
  const heading = text(values.heading);
  if (heading) { const title = document.createElement("h2"); title.className = "hub-contribution-tracker__heading"; title.textContent = heading; section.append(title); }
  const panel = document.createElement("div"); panel.className = "hub-contribution-tracker__panel";
  const expertiseHeading = text(values.expertiseHeading);
  if (expertiseHeading) { const title = document.createElement("h3"); title.className = "hub-contribution-tracker__expertise"; title.textContent = expertiseHeading; panel.append(title); }
  const actions = Array.isArray(values.actions) ? values.actions.filter((action) => text(action?.label)).slice(0, 4) : [];
  if (actions.length) {
    const list = document.createElement("div"); list.className = "hub-contribution-tracker__actions";
    actions.forEach((action) => {
      const link = document.createElement(text(action.href) ? "a" : "div"); link.className = "hub-contribution-tracker__action";
      if (link instanceof HTMLAnchorElement) link.href = text(action.href);
      const icon = document.createElement("img"); icon.src = icons[text(action.icon)] || icons.write; icon.alt = "";
      const label = document.createElement("span"); label.textContent = text(action.label); link.append(icon, label); list.append(link);
    });
    panel.append(list);
  }
  const rankLine = document.createElement("div"); rankLine.className = "hub-contribution-tracker__rank-line";
  const rank = document.createElement("p"); rank.append("Your Contributor Rank: "); const rankName = document.createElement("strong"); rankName.textContent = text(values.currentRank); rank.append(rankName);
  const progressText = document.createElement("p"); progressText.textContent = text(values.progressText);
  rankLine.append(rank, progressText); panel.append(rankLine);
  const progress = document.createElement("div"); progress.className = "hub-contribution-tracker__progress";
  const fill = document.createElement("span"); const percent = Math.max(0, Math.min(100, Number.parseFloat(text(values.progressPercent)) || 0)); fill.style.width = `${percent}%`; progress.append(fill); panel.append(progress);
  const ranks = Array.isArray(values.ranks) ? values.ranks.filter((rank) => text(rank?.name)) : [];
  if (ranks.length) { const list = document.createElement("p"); list.className = "hub-contribution-tracker__ranks"; list.textContent = `Ranks: ${ranks.map((rank) => `${text(rank.name)}${text(rank.threshold) ? ` (${text(rank.threshold)})` : ""}`).join(" · ")}`; panel.append(list); }
  section.append(panel);
  const cards = Array.isArray(values.cards) ? values.cards.filter((card) => text(card?.heading)).slice(0, 4) : [];
  if (cards.length) { const list = document.createElement("div"); list.className = "hub-contribution-tracker__cards"; cards.forEach((card) => { const item = document.createElement("article"); item.className = "hub-contribution-tracker__card"; const title = document.createElement("h3"); title.textContent = text(card.heading); item.append(title); if (text(card.body)) { const body = document.createElement("p"); body.textContent = text(card.body); item.append(body); } if (text(card.ctaText) && text(card.ctaUrl)) { const link = document.createElement("a"); link.href = text(card.ctaUrl); link.textContent = text(card.ctaText); item.append(link); } list.append(item); }); section.append(list); }
  section.hidden = !heading && !actions.length && !cards.length;
  return section;
}
