const text = (value) => typeof value === "string" ? value.trim() : "";
const list = (value) => Array.isArray(value) ? value : [];

function duration(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value)) return "";
  const whole = Math.round(value);
  const minutes = Math.floor(whole / 60);
  return `${minutes}:${String(whole % 60).padStart(2, "0")}`;
}

function child(element, tag, className, content) {
  const node = document.createElement(tag);
  node.className = className;
  if (content) node.textContent = content;
  element.append(node);
  return node;
}

function parseFeed(xml) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid video feed");
  return [...doc.querySelectorAll("item")].map((item) => ({
    title: text(item.querySelector("title")?.textContent),
    description: text(item.querySelector("description")?.textContent),
    videoUrl: item.querySelector("media\\:content, content")?.getAttribute("url") || text(item.querySelector("link")?.textContent),
    imageUrl: item.querySelector("media\\:thumbnail, thumbnail")?.getAttribute("url") || "",
    duration: duration(item.querySelector("media\\:content, content")?.getAttribute("duration")),
    category: text(item.querySelector("category")?.textContent) || "Video"
  })).filter((item) => item.title && item.imageUrl);
}

function poster(media, item) {
  media.replaceChildren();
  const image = document.createElement("img");
  image.className = "hub-video-radar__image";
  image.src = text(item.imageUrl);
  image.alt = "";
  image.loading = "eager";
  media.append(image);
  const play = child(media, "button", "hub-video-radar__play", "▶");
  play.type = "button";
  play.setAttribute("aria-label", `Play ${text(item.title)}`);
  if (text(item.duration)) child(media, "span", "hub-video-radar__duration", item.duration);
}

function playInline(card, item) {
  const media = card.querySelector(".hub-video-radar__media");
  if (!media || media.querySelector("video") || !text(item.videoUrl)) return;
  media.replaceChildren();
  const video = document.createElement("video");
  video.className = "hub-video-radar__video";
  video.controls = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.poster = text(item.imageUrl);
  video.src = text(item.videoUrl);
  video.setAttribute("aria-label", `Play ${text(item.title)}`);
  const close = document.createElement("button");
  close.className = "hub-video-radar__close";
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", "Close inline video");
  close.addEventListener("click", (event) => { event.stopPropagation(); video.pause(); poster(media, item); });
  media.append(video, close);
  video.play().catch(() => {});
}

function card(item, featured, showDescription, onPlay) {
  const article = document.createElement("article");
  article.className = `hub-video-radar__card${featured ? " is-featured" : ""}`;
  const media = document.createElement("div");
  media.className = "hub-video-radar__media";
  article.append(media);
  poster(media, item);
  media.querySelector(".hub-video-radar__play")?.addEventListener("click", () => onPlay?.(item, article));
  const body = child(article, "div", "hub-video-radar__body");
  child(body, "span", "hub-video-radar__label", text(item.category) || "Video");
  child(body, featured ? "h3" : "h4", "hub-video-radar__title", text(item.title));
  if (showDescription && text(item.description)) child(body, "p", "hub-video-radar__description", text(item.description));
  return article;
}

function populate(section, items, values) {
  const count = Number(values.itemCount) || 4;
  const videos = list(items).slice(0, count);
  const old = section.querySelector(".hub-video-radar__content");
  const content = document.createElement("div");
  content.className = "hub-video-radar__content";
  if (!videos.length) {
    child(content, "p", "hub-video-radar__empty", "No videos available right now.");
  } else {
    let lead = card(videos[0], true, Boolean(values.showDescriptions), (item, element) => playInline(element, item));
    const chooseLead = (item, autoplay) => {
      const next = card(item, true, Boolean(values.showDescriptions), (nextItem, element) => playInline(element, nextItem));
      lead.replaceWith(next);
      lead = next;
      if (autoplay) playInline(lead, item);
    };
    content.append(lead);
    if (videos.length > 1) {
      const rail = child(content, "div", "hub-video-radar__rail");
      rail.setAttribute("aria-label", "More latest videos");
      videos.slice(1).forEach((item) => rail.append(card(item, false, false, (nextItem) => chooseLead(nextItem, true))));
    }
  }
  old ? old.replaceWith(content) : section.append(content);
}

export function renderVideoRadar(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-video-radar";
  section.dataset.component = "video-radar";
  section.style.setProperty("--hub-video-radar-bg", theme?.color?.background || "#fff");
  section.style.setProperty("--hub-video-radar-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-video-radar-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-video-radar-accent", theme?.color?.accent || "#ff6600");
  section.style.setProperty("--hub-video-radar-font", theme?.font?.display || "Figtree, sans-serif");

  const header = child(section, "header", "hub-video-radar__header");
  child(header, "p", "hub-video-radar__kicker", "Live video desk");
  child(header, "h2", "hub-video-radar__heading", text(values.heading));
  const source = document.createElement("a");
  source.className = "hub-video-radar__source";
  source.href = text(values.sourceUrl) || "#";
  source.target = "_blank";
  source.rel = "noreferrer";
  source.textContent = "Live feed ↗";
  header.append(source);

  populate(section, list(values.fallbackItems), values);
  const controller = new AbortController();
  const endpoint = text(values.feedEndpoint);
  if (endpoint) {
    fetch(endpoint, { signal: controller.signal })
      .then((response) => response.ok ? response.text() : Promise.reject(new Error("Feed unavailable")))
      .then(parseFeed)
      .then((items) => { if (items.length) populate(section, items, values); })
      .catch((error) => { if (error.name !== "AbortError") section.dataset.feedState = "fallback"; });
  }
  section.cleanup = () => controller.abort();
  return section;
}
