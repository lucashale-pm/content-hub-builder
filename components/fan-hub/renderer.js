const fallbackTheme = { color: { accent: "#536dfe", background: "#fff", ink: "#1a1a1a", muted: "#737373", border: "#b8b8b8", surface: "#f4f4f5" }, font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" } };
const text = (value) => typeof value === "string" ? value.trim() : "";
const items = (value) => Array.isArray(value) ? value : [];
const link = (className, href) => { const node = document.createElement("a"); node.className = className; node.href = text(href) || "#"; return node; };
const bundledAssets = { "./assets/maya-chen.png": new URL("../feed/assets/maya-chen.png", import.meta.url).href, "./assets/raj-patel.png": new URL("../feed/assets/raj-patel.png", import.meta.url).href, "./assets/jordan-lee.png": new URL("../feed/assets/jordan-lee.png", import.meta.url).href };
const assetUrl = (value) => bundledAssets[text(value)] || text(value);

export function renderFanHub(values, theme = fallbackTheme) {
  const colors = { ...fallbackTheme.color, ...theme?.color };
  const fonts = { ...fallbackTheme.font, ...theme?.font };
  const section = document.createElement("section");
  section.className = "hub-fan-hub";
  section.dataset.component = "fan-hub";
  Object.entries({ "--hub-fan-hub-accent": colors.accent, "--hub-fan-hub-background": colors.background, "--hub-fan-hub-ink": colors.ink, "--hub-fan-hub-muted": colors.muted, "--hub-fan-hub-border": colors.border, "--hub-fan-hub-surface": colors.surface, "--hub-fan-hub-display-font": fonts.display, "--hub-fan-hub-body-font": fonts.body }).forEach(([name, value]) => section.style.setProperty(name, value));

  const title = text(values.gameTitle);
  if (!title) { section.hidden = true; return section; }

  const header = document.createElement("header");
  header.className = "hub-fan-hub__header";
  const heading = text(values.hubUrl) ? link("hub-fan-hub__title-link", values.hubUrl) : document.createElement("h2");
  if (heading instanceof HTMLAnchorElement) heading.setAttribute("aria-label", `Open ${title} fan hub`);
  if (heading instanceof HTMLAnchorElement) { const titleElement = document.createElement("h2"); titleElement.textContent = title; heading.append(titleElement); } else heading.textContent = title;
  header.append(heading);
  section.append(header);

  if (text(values.storiesLabel)) { const storiesHeading = document.createElement("p"); storiesHeading.className = "hub-fan-hub__stories-label"; storiesHeading.textContent = text(values.storiesLabel); section.append(storiesHeading); }
  const carousel = document.createElement("div");
  carousel.className = "hub-fan-hub__carousel";
  const articleList = document.createElement("div");
  articleList.className = "hub-fan-hub__articles";
  items(values.articles).slice(0, 4).forEach((article) => {
    if (!article || typeof article !== "object") return;
    const card = text(article.href) ? link("hub-fan-hub__article", article.href) : document.createElement("article");
    const media = document.createElement("div"); media.className = "hub-fan-hub__article-media";
    if (text(article.imageUrl)) { const image = document.createElement("img"); image.src = text(article.imageUrl); image.alt = text(article.imageAlt); media.append(image); }
    if (text(article.label)) { const label = document.createElement("span"); label.className = "hub-fan-hub__article-label"; label.textContent = text(article.label); media.append(label); }
    card.append(media);
    if (text(article.headline)) { const headline = document.createElement("h3"); headline.textContent = text(article.headline); card.append(headline); }
    const byline = document.createElement("div"); byline.className = "hub-fan-hub__byline";
    if (text(article.avatarUrl) && text(article.author)) { const avatar = document.createElement("img"); avatar.src = assetUrl(article.avatarUrl); avatar.alt = ""; byline.append(avatar); }
    if (text(article.author)) { const author = document.createElement("span"); author.className = "hub-fan-hub__article-author"; author.textContent = text(article.author); byline.append(author); }
    if (text(article.posted)) { const posted = document.createElement("span"); posted.className = "hub-fan-hub__article-posted"; posted.textContent = text(article.posted); byline.append(posted); }
    if (byline.childElementCount) card.append(byline);
    const metrics = document.createElement("div"); metrics.className = "hub-fan-hub__metrics";
    [["comments", "💬"], ["reactions", "♡"]].forEach(([field, icon]) => {
      if (!text(article[field])) return;
      const metric = document.createElement("span"); metric.className = "hub-fan-hub__metric"; metric.setAttribute("aria-label", `${text(article[field])} ${field}`);
      const metricIcon = document.createElement("span"); metricIcon.className = "hub-fan-hub__metric-icon"; metricIcon.textContent = icon;
      metric.append(metricIcon, document.createTextNode(text(article[field]))); metrics.append(metric);
    });
    if (metrics.childElementCount) card.append(metrics);
    if (card.childElementCount) articleList.append(card);
  });
  carousel.append(articleList);
  if (articleList.childElementCount > 2) {
    const arrow = document.createElement("button"); arrow.type = "button"; arrow.className = "hub-fan-hub__arrow"; arrow.setAttribute("aria-label", text(values.scrollLabel) || `Show more ${title} stories`); arrow.textContent = "›";
    const scrollForward = () => articleList.scrollBy({ left: Math.max(articleList.clientWidth * 0.82, 180), behavior: "smooth" });
    arrow.addEventListener("click", scrollForward);
    carousel.append(arrow);
    section.cleanup = () => arrow.removeEventListener("click", scrollForward);
  }
  if (articleList.childElementCount) section.append(carousel);
  if (text(values.hubUrl) && text(values.ctaText)) {
    const cta = link("hub-fan-hub__cta", values.hubUrl);
    cta.textContent = text(values.ctaText);
    const arrow = document.createElement("span"); arrow.textContent = "→"; arrow.setAttribute("aria-hidden", "true");
    cta.append(document.createTextNode(" "), arrow);
    section.append(cta);
  }
  return section;
}
