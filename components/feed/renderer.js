const fallbackTheme = { color: { accent: "#ff6600", background: "#ffffff", ink: "#1a1a1a", muted: "#737373", border: "#e6e6e6", labelNews: "#008a80", labelAnalysis: "#7156c8", labelGuide: "#a85c00" }, font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" }, radius: { card: "16px" } };
const text = (value) => typeof value === "string" ? value.trim() : "";
const items = (value) => Array.isArray(value) ? value : [];
const labelClass = (label) => `hub-feed__label--${text(label).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
const bundledAssets = { "./assets/maya-chen.png": new URL("./assets/maya-chen.png", import.meta.url).href, "./assets/raj-patel.png": new URL("./assets/raj-patel.png", import.meta.url).href, "./assets/jordan-lee.png": new URL("./assets/jordan-lee.png", import.meta.url).href };
const assetUrl = (value) => bundledAssets[text(value)] || text(value);
function element(tag, className, content) { const node = document.createElement(tag); node.className = className; if (content !== undefined) node.textContent = text(content); return node; }
function link(className, href) { const node = document.createElement("a"); node.className = className; node.href = text(href) || "#"; return node; }
function youtubeEmbedUrl(value) { try { const url = new URL(text(value)); const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.split("/").at(-1); return id ? `https://www.youtube-nocookie.com/embed/${id}` : ""; } catch { return ""; } }
function videoFrame(url, title, className) { const src = youtubeEmbedUrl(url); if (!src) return null; const frame = document.createElement("iframe"); frame.className = className; frame.src = src; frame.title = text(title) || "YouTube video"; frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"; frame.allowFullscreen = true; return frame; }
function metadata(article) {
  const meta = element("div", "hub-feed__metadata");
  if (text(article.avatarUrl) && text(article.author)) { const avatar = document.createElement("img"); avatar.className = "hub-feed__avatar"; avatar.src = assetUrl(article.avatarUrl); avatar.alt = ""; meta.append(avatar); }
  if (text(article.author)) meta.append(element("span", "hub-feed__author", article.author));
  if (text(article.posted)) meta.append(element("time", "hub-feed__posted", article.posted));
  [["comments", "💬"], ["reactions", "♡"]].forEach(([name, icon]) => { if (!text(article[name])) return; const metric = element("span", "hub-feed__metric"); metric.setAttribute("aria-label", `${text(article[name])} ${name}`); metric.append(element("span", "hub-feed__metric-icon", icon), document.createTextNode(text(article[name]))); meta.append(metric); });
  return meta;
}
function renderArticle(article) {
  const item = link("hub-feed__item", article.href);
  const content = element("div", "hub-feed__item-content");
  if (text(article.label)) content.append(element("span", `hub-feed__label ${labelClass(article.label)}`, article.label));
  if (text(article.title)) content.append(element("h3", "hub-feed__item-title", article.title));
  const meta = metadata(article); if (meta.childElementCount) content.append(meta);
  if (text(article.imageUrl)) { const thumbnail = document.createElement("img"); thumbnail.className = "hub-feed__thumbnail"; thumbnail.src = assetUrl(article.imageUrl); thumbnail.alt = text(article.imageAlt); item.append(content, thumbnail); } else item.append(content);
  return item;
}
function renderInlineVideo(item) {
  const video = element("article", "hub-feed__video-item");
  const frame = videoFrame(item.videoUrl, item.videoHeading, "hub-feed__inline-video");
  if (frame) video.append(frame);
  if (text(item.videoHeading)) video.append(element("h3", "hub-feed__video-title", item.videoHeading));
  return video;
}

export function renderFeed(values, theme = fallbackTheme) {
  const colors = { ...fallbackTheme.color, ...theme?.color }; const fonts = { ...fallbackTheme.font, ...theme?.font }; const radius = { ...fallbackTheme.radius, ...theme?.radius };
  const feed = element("section", "hub-feed"); feed.dataset.component = "feed";
  Object.entries({ "--hub-feed-accent": colors.accent, "--hub-feed-background": colors.background, "--hub-feed-ink": colors.ink, "--hub-feed-muted": colors.muted, "--hub-feed-border": colors.border, "--hub-feed-label-news": colors.labelNews, "--hub-feed-label-analysis": colors.labelAnalysis, "--hub-feed-label-guide": colors.labelGuide, "--hub-feed-display-font": fonts.display, "--hub-feed-body-font": fonts.body, "--hub-feed-radius": radius.card }).forEach(([name, value]) => feed.style.setProperty(name, value));
  const header = element("header", "hub-feed__header"); const heading = element("div", "hub-feed__heading");
  if (text(values.eyebrow)) heading.append(element("p", "hub-feed__eyebrow", values.eyebrow)); if (text(values.date)) heading.append(element("h2", "hub-feed__date", values.date));
  header.append(heading); feed.append(header);
  const filters = items(values.filters).filter((filter) => text(filter?.label));
  if (values.showFilters && filters.length) { const filterList = element("div", "hub-feed__filters"); filterList.setAttribute("aria-label", "Feed filters"); filters.forEach((filter, index) => { const button = element("button", `hub-feed__filter${filter.selected || (!filters.some((item) => item.selected) && index === 0) ? " is-selected" : ""}`, filter.label); button.type = "button"; button.setAttribute("aria-pressed", String(button.classList.contains("is-selected"))); button.addEventListener("click", () => { filterList.querySelectorAll(".hub-feed__filter").forEach((item) => { item.classList.remove("is-selected"); item.setAttribute("aria-pressed", "false"); }); button.classList.add("is-selected"); button.setAttribute("aria-pressed", "true"); }); filterList.append(button); }); feed.append(filterList); }
  if (values.showFeatured !== false) {
    const featured = values.featured || {};
    if (featured.contentType === "YouTube video") { const feature = element("section", "hub-feed__featured-video"); if (text(featured.videoHeading)) feature.append(element("h3", "hub-feed__featured-video-heading", featured.videoHeading)); if (text(featured.videoSubheading)) feature.append(element("p", "hub-feed__featured-video-subheading", featured.videoSubheading)); const frame = videoFrame(featured.videoUrl, featured.videoHeading, "hub-feed__featured-video-frame"); if (frame) feature.append(frame); if (feature.childElementCount) feed.append(feature); }
    else { const feature = link("hub-feed__featured", featured.href); const imageWrap = element("div", "hub-feed__feature-media"); if (text(featured.imageUrl)) { const image = document.createElement("img"); image.className = "hub-feed__feature-image"; image.src = assetUrl(featured.imageUrl); image.alt = text(featured.imageAlt); imageWrap.append(image); } if (text(featured.label)) imageWrap.append(element("span", `hub-feed__label hub-feed__label--feature ${labelClass(featured.label)}`, featured.label)); const body = element("div", "hub-feed__feature-body"); if (text(featured.title)) body.append(element("h3", "hub-feed__feature-title", featured.title)); if (text(featured.summary)) body.append(element("p", "hub-feed__summary", featured.summary)); const meta = metadata(featured); if (meta.childElementCount) body.append(meta); feature.append(imageWrap, body); if (feature.childElementCount) feed.append(feature); }
  }
  const list = element("div", "hub-feed__list"); items(values.articles).forEach((item) => { const output = item?.contentType === "YouTube video" ? renderInlineVideo(item) : renderArticle(item || {}); if (output.childElementCount) list.append(output); }); if (list.childElementCount) feed.append(list);
  if (text(values.loadMoreLabel)) { const more = element("button", "hub-feed__more", values.loadMoreLabel); more.type = "button"; feed.append(more); }
  return feed;
}
