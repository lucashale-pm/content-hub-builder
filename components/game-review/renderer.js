const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderGameReview(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-game-review";
  section.dataset.component = "game-review";
  section.style.setProperty("--hub-review-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-review-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-review-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-review-accent", theme?.color?.accent || "#ff6600");
  section.style.setProperty("--hub-review-border", theme?.color?.border || "#e6e6e6");
  section.style.setProperty("--hub-review-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-review-body-font", theme?.font?.body || "Figtree, sans-serif");

  const scores = document.createElement("div");
  scores.className = "hub-game-review__scores";
  const scoreItems = [["GR+ Score", text(values.grScore), "is-gr"]];
  if (values.showCommunityScores) scoreItems.push(["Your score", "+", "is-user"], ["User score", text(values.userScore), "is-community"]);
  scores.style.setProperty("--hub-review-score-count", String(scoreItems.length));
  scoreItems.forEach(([label, score, modifier]) => {
    const item = document.createElement("div");
    item.className = "hub-game-review__score";
    const scoreLabel = document.createElement("p");
    scoreLabel.className = "hub-game-review__score-label";
    scoreLabel.textContent = label;
    const badge = document.createElement("span");
    badge.className = `hub-game-review__badge ${modifier}`;
    badge.textContent = score || "—";
    item.append(scoreLabel, badge);
    scores.append(item);
  });
  section.append(scores);
  const linkText = text(values.reviewLinkText);
  const linkUrl = text(values.reviewLinkUrl);
  if (linkText && linkUrl) {
    const link = document.createElement("a");
    link.className = "hub-game-review__link";
    link.href = linkUrl;
    link.textContent = linkText;
    section.append(link);
  }
  return section;
}
