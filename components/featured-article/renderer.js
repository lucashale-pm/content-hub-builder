const text = (value) => typeof value === "string" ? value.trim() : "";
const defaultVideos = { gamesradar: "https://www.youtube.com/watch?v=LDlHHOv6MN8", pcgamer: "https://www.youtube.com/watch?v=Q6_KYI3gnFE" };
function youtubeEmbedUrl(value) {
  try {
    const url = new URL(value);
    const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.split("/").at(-1);
    return id ? "https://www.youtube-nocookie.com/embed/" + id : "";
  } catch { return ""; }
}

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
  const isVideo = values.contentType === "YouTube video";
  const isStandard = !isVideo && values.presentation === "Standard";
  section.classList.toggle("is-standard", isStandard);
  if (heading && !isStandard) { const title = document.createElement("h2"); title.className = "hub-featured-article__heading"; title.textContent = heading; section.append(title); }
  if (isVideo) {
    const subheading = text(values.subheading);
    if (subheading) { const copy = document.createElement("p"); copy.className = "hub-featured-article__subheading"; copy.textContent = subheading; section.append(copy); }
    const source = text(values.videoUrl) || defaultVideos[theme?.brand === "pcgamer" ? "pcgamer" : "gamesradar"];
    const embedUrl = youtubeEmbedUrl(source);
    if (embedUrl) { const video = document.createElement("iframe"); video.className = "hub-featured-article__video"; video.src = embedUrl; video.title = heading || "Featured YouTube video"; video.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"; video.allowFullscreen = true; section.append(video); }
    section.hidden = !heading && !subheading && !embedUrl;
    return section;
  }
  if (isStandard) {
    const article = document.createElement(text(values.href) ? "a" : "article"); article.className = "hub-featured-article__standard";
    if (article instanceof HTMLAnchorElement) article.href = text(values.href);
    const body = document.createElement("div"); body.className = "hub-featured-article__standard-content";
    if (text(values.label)) { const label = document.createElement("span"); label.className = "hub-featured-article__standard-label"; label.textContent = text(values.label); body.append(label); }
    if (text(values.title)) { const title = document.createElement("h3"); title.textContent = text(values.title); body.append(title); }
    const metaParts = [["author", values.author], ["posted", values.posted], ["comments", values.comments], ["reactions", values.reactions]].filter(([, value]) => text(value));
    if (metaParts.length) {
      const meta = document.createElement("div"); meta.className = "hub-featured-article__meta hub-featured-article__standard-meta";
      if (text(values.avatarUrl) && text(values.author)) { const avatar = document.createElement("img"); avatar.className = "hub-featured-article__avatar"; avatar.src = text(values.avatarUrl); avatar.alt = ""; meta.append(avatar); }
      metaParts.forEach(([name, value]) => { const item = document.createElement("span"); item.className = `hub-featured-article__${name}`; if (name === "comments" || name === "reactions") { const icon = document.createElement("span"); icon.className = "hub-featured-article__standard-metric-icon"; icon.textContent = name === "comments" ? "💬" : "♡"; item.append(icon); } item.append(document.createTextNode(text(value))); meta.append(item); });
      body.append(meta);
    }
    article.append(body);
    if (text(values.imageUrl)) { const image = document.createElement("img"); image.className = "hub-featured-article__standard-thumbnail"; image.src = text(values.imageUrl); image.alt = text(values.imageAlt); article.append(image); }
    section.append(article);
    section.hidden = !text(values.title) && !text(values.imageUrl);
    return section;
  }
  const article = document.createElement(text(values.href) ? "a" : "article"); article.className = "hub-featured-article__card";
  if (article instanceof HTMLAnchorElement) article.href = text(values.href);
  if (text(values.author) || text(values.posted)) {
    const postHeader = document.createElement("div"); postHeader.className = "hub-featured-article__post-header";
    if (text(values.avatarUrl) && text(values.author)) { const avatar = document.createElement("img"); avatar.className = "hub-featured-article__post-avatar"; avatar.src = text(values.avatarUrl); avatar.alt = ""; postHeader.append(avatar); }
    const identity = document.createElement("div"); identity.className = "hub-featured-article__post-identity";
    if (text(values.author)) { const author = document.createElement("strong"); author.textContent = text(values.author); identity.append(author); }
    if (text(values.posted)) { const posted = document.createElement("span"); posted.textContent = text(values.posted); identity.append(posted); }
    if (identity.childElementCount) postHeader.append(identity);
    const more = document.createElement("span"); more.className = "hub-featured-article__post-more"; more.textContent = "•••"; more.setAttribute("aria-hidden", "true"); postHeader.append(more);
    article.append(postHeader);
  }
  if (text(values.imageUrl)) { const media = document.createElement("div"); media.className = "hub-featured-article__media"; const image = document.createElement("img"); image.src = text(values.imageUrl); image.alt = text(values.imageAlt); media.append(image); if (text(values.label)) { const label = document.createElement("span"); label.className = "hub-featured-article__label"; label.textContent = text(values.label); media.append(label); } article.append(media); }
  const engagement = document.createElement("div"); engagement.className = "hub-featured-article__engagement";
  [["comments", "💬"], ["reactions", "♡"]].forEach(([name, icon]) => {
    if (!text(values[name])) return;
    const metric = document.createElement("span"); metric.className = `hub-featured-article__${name}`; metric.setAttribute("aria-label", `${text(values[name])} ${name}`);
    const metricIcon = document.createElement("span"); metricIcon.className = "hub-featured-article__engagement-icon"; metricIcon.textContent = icon;
    metric.append(metricIcon, document.createTextNode(text(values[name]))); engagement.append(metric);
  });
  if (engagement.childElementCount) article.append(engagement);
  const body = document.createElement("div"); body.className = "hub-featured-article__body";
  if (text(values.title)) { const title = document.createElement("h3"); title.textContent = text(values.title); body.append(title); }
  if (text(values.summary)) { const summary = document.createElement("p"); summary.className = "hub-featured-article__summary"; summary.textContent = text(values.summary); body.append(summary); }
  article.append(body); section.append(article);
  section.hidden = !heading && !text(values.title) && !text(values.imageUrl);
  return section;
}
