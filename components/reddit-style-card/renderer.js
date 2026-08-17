const text = (value) => typeof value === "string" ? value.trim() : "";
const bundledAssets = {
  "./assets/maya-chen.png": new URL("../feed/assets/maya-chen.png", import.meta.url).href,
  "./assets/jordan-lee.png": new URL("../feed/assets/jordan-lee.png", import.meta.url).href,
  "./assets/raj-patel.png": new URL("../feed/assets/raj-patel.png", import.meta.url).href,
};
const assetUrl = (value) => bundledAssets[text(value)] || text(value);

function metricIcon(kind) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("hub-reddit-card__metric-icon");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("stroke-width", "1.8");
  path.setAttribute("d", kind === "comments" ? "M21 11.5a8.2 8.2 0 0 1-8.5 7.5 9.6 9.6 0 0 1-4.1-.9L3 19l1.1-4.2A7.2 7.2 0 0 1 3 11.5 8.2 8.2 0 0 1 11.5 4 8.2 8.2 0 0 1 21 11.5Z" : "M20.8 8.7c0 5.3-8.8 10.1-8.8 10.1S3.2 14 3.2 8.7A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.7Z");
  svg.append(path);
  return svg;
}

function appendText(parent, tag, className, value) {
  const content = text(value);
  if (!content) return;
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = content;
  parent.append(element);
}

export function renderRedditStyleCard(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-reddit-card";
  section.dataset.component = "reddit-style-card";
  section.style.setProperty("--hub-reddit-surface", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-reddit-ink", theme?.color?.ink || "#171717");
  section.style.setProperty("--hub-reddit-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-reddit-border", theme?.color?.border || "#d4d4d8");
  section.style.setProperty("--hub-reddit-accent", theme?.color?.accent || "#171717");
  section.style.setProperty("--hub-reddit-font", theme?.font?.body || "Inter, sans-serif");

  const card = document.createElement(text(values.href) ? "a" : "article");
  card.className = "hub-reddit-card__article";
  if (card instanceof HTMLAnchorElement) card.href = text(values.href);

  const header = document.createElement("div");
  header.className = "hub-reddit-card__header";
  const hubIcon = text(values.hubIconUrl);
  if (hubIcon) {
    const image = document.createElement("img");
    image.className = "hub-reddit-card__hub-icon";
    image.src = assetUrl(hubIcon);
    image.alt = "";
    header.append(image);
  } else {
    const fallback = document.createElement("span");
    fallback.className = "hub-reddit-card__hub-icon hub-reddit-card__hub-icon--fallback";
    fallback.textContent = text(values.hubName).slice(0, 1).toUpperCase() || "H";
    header.append(fallback);
  }
  const identity = document.createElement("div");
  identity.className = "hub-reddit-card__identity";
  appendText(identity, "strong", "hub-reddit-card__hub-name", values.hubName);
  appendText(identity, "span", "hub-reddit-card__published", values.published);
  header.append(identity);
  const follow = document.createElement("span");
  follow.className = "hub-reddit-card__follow";
  follow.textContent = text(values.followLabel) || "Follow";
  header.append(follow);
  card.append(header);

  const body = document.createElement("div");
  body.className = "hub-reddit-card__body";
  appendText(body, "h3", "hub-reddit-card__title", values.title);
  appendText(body, "p", "hub-reddit-card__summary", values.summary);
  const imageUrl = text(values.imageUrl);
  if (imageUrl) {
    const image = document.createElement("img");
    image.className = "hub-reddit-card__image";
    image.src = assetUrl(imageUrl);
    image.alt = text(values.imageAlt);
    body.append(image);
  }
  card.append(body);

  let byline = null;
  if (text(values.authorName)) {
    byline = document.createElement("div");
    byline.className = "hub-reddit-card__byline";
    if (text(values.authorAvatarUrl)) {
      const avatar = document.createElement("img");
      avatar.className = "hub-reddit-card__author-avatar";
      avatar.src = assetUrl(values.authorAvatarUrl);
      avatar.alt = "";
      byline.append(avatar);
    }
    const author = document.createElement("div");
    appendText(author, "strong", "hub-reddit-card__author", values.authorName);
    appendText(author, "span", "hub-reddit-card__role", values.authorRole);
    byline.append(author);
    card.append(byline);
  }

  const engagement = document.createElement("div");
  engagement.className = "hub-reddit-card__engagement";
  if (text(values.comments)) { const comments = document.createElement("span"); comments.className = "hub-reddit-card__metric"; comments.append(metricIcon("comments"), document.createTextNode(text(values.comments))); engagement.append(comments); }
  if (text(values.reactions)) { const reactions = document.createElement("span"); reactions.className = "hub-reddit-card__metric"; reactions.append(metricIcon("reactions"), document.createTextNode(text(values.reactions))); engagement.append(reactions); }
  if (engagement.childElementCount) {
    if (byline) byline.append(engagement);
    else card.append(engagement);
  }

  section.append(card);
  section.hidden = !text(values.title) && !imageUrl;
  return section;
}
