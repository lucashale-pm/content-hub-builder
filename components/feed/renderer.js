const fallbackTheme = {
  color: { accent: "#ff6600", background: "#ffffff", ink: "#1a1a1a", muted: "#737373", border: "#e6e6e6", labelNews: "#008a80", labelAnalysis: "#7156c8", labelGuide: "#a85c00" },
  font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" },
  radius: { card: "16px" },
};

const text = (value) => typeof value === "string" ? value : "";
const articles = (value) => Array.isArray(value) ? value : [];
const labelClass = (label) => `hub-feed__label--${text(label).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
const bundledAssets = {
  "./assets/maya-chen.png": new URL("./assets/maya-chen.png", import.meta.url).href,
  "./assets/raj-patel.png": new URL("./assets/raj-patel.png", import.meta.url).href,
  "./assets/jordan-lee.png": new URL("./assets/jordan-lee.png", import.meta.url).href,
};
const assetUrl = (value) => {
  const source = text(value);
  return bundledAssets[source] || source;
};

function element(tag, className, content) {
  const node = document.createElement(tag);
  node.className = className;
  if (content !== undefined) node.textContent = text(content);
  return node;
}

function link(className, href) {
  const node = document.createElement("a");
  node.className = className;
  node.href = text(href) || "#";
  return node;
}

function metadata(article) {
  const meta = element("div", "hub-feed__metadata");
  const avatar = document.createElement("img");
  avatar.className = "hub-feed__avatar";
  avatar.src = assetUrl(article.avatarUrl);
  avatar.alt = "";
  meta.append(avatar, element("span", "hub-feed__author", article.author), element("time", "hub-feed__posted", article.posted));
  const comments = element("span", "hub-feed__metric");
  comments.setAttribute("aria-label", `${text(article.comments)} comments`);
  comments.append(element("span", "hub-feed__metric-icon", "💬"), document.createTextNode(text(article.comments)));
  const reactions = element("span", "hub-feed__metric");
  reactions.setAttribute("aria-label", `${text(article.reactions)} reactions`);
  reactions.append(element("span", "hub-feed__metric-icon", "♡"), document.createTextNode(text(article.reactions)));
  meta.append(comments, reactions);
  return meta;
}

export function renderFeed(values, theme = fallbackTheme) {
  const colors = { ...fallbackTheme.color, ...theme?.color };
  const fonts = { ...fallbackTheme.font, ...theme?.font };
  const radius = { ...fallbackTheme.radius, ...theme?.radius };
  const feed = element("section", "hub-feed");
  feed.dataset.component = "feed";
  Object.entries({ "--hub-feed-accent": colors.accent, "--hub-feed-background": colors.background, "--hub-feed-ink": colors.ink, "--hub-feed-muted": colors.muted, "--hub-feed-border": colors.border, "--hub-feed-label-news": colors.labelNews, "--hub-feed-label-analysis": colors.labelAnalysis, "--hub-feed-label-guide": colors.labelGuide, "--hub-feed-display-font": fonts.display, "--hub-feed-body-font": fonts.body, "--hub-feed-radius": radius.card }).forEach(([name, value]) => feed.style.setProperty(name, value));

  const header = element("header", "hub-feed__header");
  const heading = element("div", "hub-feed__heading");
  heading.append(element("p", "hub-feed__eyebrow", values.eyebrow), element("h2", "hub-feed__date", values.date));
  const archive = link("hub-feed__archive", values.archiveHref);
  archive.textContent = `${text(values.archiveLabel)} →`;
  header.append(heading, archive);
  feed.append(header);

  const featured = values.featured || {};
  const feature = link("hub-feed__featured", featured.href);
  const featureImage = document.createElement("img");
  featureImage.className = "hub-feed__feature-image";
  featureImage.src = assetUrl(featured.imageUrl);
  featureImage.alt = text(featured.imageAlt);
  const featureLabel = element("span", `hub-feed__label hub-feed__label--feature ${labelClass(featured.label)}`, featured.label);
  const imageWrap = element("div", "hub-feed__feature-media");
  imageWrap.append(featureImage, featureLabel);
  const featureBody = element("div", "hub-feed__feature-body");
  featureBody.append(element("h3", "hub-feed__feature-title", featured.title), element("p", "hub-feed__summary", featured.summary), metadata(featured));
  feature.append(imageWrap, featureBody);
  feed.append(feature);

  const list = element("div", "hub-feed__list");
  articles(values.articles).forEach((article) => {
    const item = link("hub-feed__item", article.href);
    const content = element("div", "hub-feed__item-content");
    content.append(element("span", `hub-feed__label ${labelClass(article.label)}`, article.label), element("h3", "hub-feed__item-title", article.title), metadata(article));
    const thumbnail = document.createElement("img");
    thumbnail.className = "hub-feed__thumbnail";
    thumbnail.src = assetUrl(article.imageUrl);
    thumbnail.alt = text(article.imageAlt);
    item.append(content, thumbnail);
    list.append(item);
  });
  feed.append(list);
  const more = element("button", "hub-feed__more", values.loadMoreLabel);
  more.type = "button";
  feed.append(more);
  return feed;
}
