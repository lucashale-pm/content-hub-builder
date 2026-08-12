const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderFeaturedArticle(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-featured-article";
  section.dataset.component = "featured-article";
  section.style.setProperty("--hub-featured-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-featured-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-featured-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-featured-accent", theme?.color?.accent || "#ff6600");
  section.style.setProperty("--hub-featured-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-featured-body-font", theme?.font?.body || "Figtree, sans-serif");
  const heading = text(values.heading);
  if (heading) { const title = document.createElement("h2"); title.className = "hub-featured-article__heading"; title.textContent = heading; section.append(title); }
  const article = document.createElement(text(values.href) ? "a" : "article"); article.className = "hub-featured-article__card";
  if (article instanceof HTMLAnchorElement) article.href = text(values.href);
  if (text(values.imageUrl)) { const media = document.createElement("div"); media.className = "hub-featured-article__media"; const image = document.createElement("img"); image.src = text(values.imageUrl); image.alt = text(values.imageAlt); media.append(image); if (text(values.label)) { const label = document.createElement("span"); label.className = "hub-featured-article__label"; label.textContent = text(values.label); media.append(label); } article.append(media); }
  const body = document.createElement("div"); body.className = "hub-featured-article__body";
  if (text(values.title)) { const title = document.createElement("h3"); title.textContent = text(values.title); body.append(title); }
  if (text(values.summary)) { const summary = document.createElement("p"); summary.className = "hub-featured-article__summary"; summary.textContent = text(values.summary); body.append(summary); }
  const metaParts = [["author", values.author], ["posted", values.posted], ["comments", values.comments], ["reactions", values.reactions]].filter(([, value]) => text(value));
  if (metaParts.length) { const meta = document.createElement("div"); meta.className = "hub-featured-article__meta"; if (text(values.avatarUrl) && text(values.author)) { const avatar = document.createElement("img"); avatar.src = text(values.avatarUrl); avatar.alt = ""; meta.append(avatar); } metaParts.forEach(([name, value]) => { const item = document.createElement("span"); item.className = `hub-featured-article__${name}`; item.textContent = text(value); meta.append(item); }); body.append(meta); }
  article.append(body); section.append(article);
  section.hidden = !heading && !text(values.title) && !text(values.imageUrl);
  return section;
}
