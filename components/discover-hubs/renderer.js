const text = (value) => typeof value === "string" ? value.trim() : "";
const values = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
const platformIcons = { PlayStation: "https://cdn.simpleicons.org/playstation/1a1a1a", Xbox: "https://cdn-icons-png.flaticon.com/512/1/1321.png", "Nintendo Switch": "https://cdn-icons-png.flaticon.com/512/871/871377.png" };
const bundledAssets = { "./assets/maya-chen.png": new URL("../feed/assets/maya-chen.png", import.meta.url).href, "./assets/raj-patel.png": new URL("../feed/assets/raj-patel.png", import.meta.url).href, "./assets/jordan-lee.png": new URL("../feed/assets/jordan-lee.png", import.meta.url).href };
const assetUrl = (value) => bundledAssets[text(value)] || text(value);

export function renderDiscoverHubs(componentValues, theme) {
  const section = document.createElement("section");
  section.className = "hub-discover-hubs";
  section.dataset.component = "discover-hubs";
  section.style.setProperty("--hub-discover-background", theme?.color?.background || "#fff");
  section.style.setProperty("--hub-discover-surface", theme?.color?.surface || "#f4f4f5");
  section.style.setProperty("--hub-discover-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-discover-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-discover-border", theme?.color?.border || "#e4e4e7");
  section.style.setProperty("--hub-discover-accent", theme?.color?.accent || "#171717");
  section.style.setProperty("--hub-discover-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-discover-body-font", theme?.font?.body || "Figtree, sans-serif");

  const hubs = Array.isArray(componentValues.hubs) ? componentValues.hubs.map(values).filter((hub) => text(hub.name)) : [];
  if (!hubs.length) { section.hidden = true; return section; }
  let activeIndex = 0;
  const header = document.createElement("header");
  header.className = "hub-discover-hubs__header";
  const eyebrow = text(componentValues.eyebrow);
  const heading = text(componentValues.heading);
  if (eyebrow) { const element = document.createElement("p"); element.className = "hub-discover-hubs__eyebrow"; element.textContent = eyebrow; header.append(element); }
  if (heading) { const element = document.createElement("h2"); element.textContent = heading; header.append(element); }
  if (header.childElementCount) section.append(header);

  const picker = document.createElement("div");
  picker.className = "hub-discover-hubs__picker";
  picker.setAttribute("role", "tablist");
  const content = document.createElement("div");
  content.className = "hub-discover-hubs__content";
  const renderActiveHub = () => {
    const hub = hubs[activeIndex];
    content.replaceChildren();
    if (text(hub.featureImageUrl)) {
      const image = document.createElement("img");
      image.className = "hub-discover-hubs__feature-image";
      image.src = text(hub.featureImageUrl);
      image.alt = text(hub.featureImageAlt);
      content.append(image);
    }
    const summary = document.createElement("div"); summary.className = "hub-discover-hubs__summary";
    const info = document.createElement("div");
    const name = document.createElement("h3"); name.textContent = text(hub.name); info.append(name);
    if (text(hub.publisher)) { const element = document.createElement("p"); element.textContent = text(hub.publisher); info.append(element); }
    const platforms = Array.isArray(hub.platforms) ? hub.platforms.filter((platform) => text(platform)) : [];
    if (platforms.length) {
      const platformList = document.createElement("div"); platformList.className = "hub-discover-hubs__platforms";
      platforms.forEach((platform) => {
        if (platform === "PC") { const label = document.createElement("span"); label.className = "hub-discover-hubs__platform-pc"; label.textContent = "PC"; platformList.append(label); return; }
        const source = platformIcons[platform]; if (!source) return;
        const icon = document.createElement("img"); icon.src = source; icon.alt = platform; icon.title = platform; platformList.append(icon);
      });
      info.append(platformList);
    }
    summary.append(info);
    if (text(hub.score)) { const score = document.createElement("div"); score.className = "hub-discover-hubs__score"; const value = document.createElement("strong"); value.textContent = text(hub.score); score.append(value); if (text(hub.scoreLabel)) { const label = document.createElement("span"); label.textContent = text(hub.scoreLabel); score.append(label); } summary.append(score); }
    content.append(summary);
    if (text(hub.latestTitle)) { const latest = document.createElement("article"); latest.className = "hub-discover-hubs__latest"; if (text(hub.latestLabel)) { const label = document.createElement("p"); label.className = "hub-discover-hubs__latest-label"; label.textContent = text(hub.latestLabel); latest.append(label); } const title = document.createElement("h4"); title.textContent = text(hub.latestTitle); latest.append(title); const byline = [text(hub.latestAuthor), text(hub.latestPosted)].filter(Boolean).join(" · "); if (byline) { const row = document.createElement("div"); row.className = "hub-discover-hubs__byline"; if (text(hub.latestAuthorImageUrl)) { const image = document.createElement("img"); image.src = assetUrl(hub.latestAuthorImageUrl); image.alt = ""; row.append(image); } const element = document.createElement("p"); element.textContent = byline; row.append(element); latest.append(row); } content.append(latest); }
    const topics = Array.isArray(hub.topics) ? hub.topics.map(values).filter((topic) => text(topic.label)) : [];
    if (topics.length) { const list = document.createElement("div"); list.className = "hub-discover-hubs__topics"; topics.forEach((topic) => { const item = document.createElement("span"); item.textContent = `${text(topic.label)}${text(topic.count) ? ` ${text(topic.count)}` : ""}`; list.append(item); }); content.append(list); }
    if (text(hub.ctaText)) { const cta = document.createElement(text(hub.ctaUrl) ? "a" : "span"); cta.className = "hub-discover-hubs__cta"; cta.textContent = text(hub.ctaText); if (cta instanceof HTMLAnchorElement) cta.href = text(hub.ctaUrl); content.append(cta); }
    [...picker.children].forEach((item, index) => { const selected = index === activeIndex; item.classList.toggle("is-active", selected); item.setAttribute("aria-selected", String(selected)); });
  };
  hubs.forEach((hub, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "hub-discover-hubs__hub"; button.setAttribute("role", "tab"); button.setAttribute("aria-selected", String(index === 0)); const roundel = document.createElement("span"); roundel.className = "hub-discover-hubs__roundel"; if (text(hub.imageUrl)) { const image = document.createElement("img"); image.src = text(hub.imageUrl); image.alt = text(hub.imageAlt); roundel.append(image); } if (hub.isNew) { const dot = document.createElement("i"); dot.className = "hub-discover-hubs__new-dot"; dot.setAttribute("aria-label", "New content"); roundel.append(dot); } const label = document.createElement("span"); label.textContent = text(hub.name); button.append(roundel, label); button.addEventListener("click", () => { activeIndex = index; renderActiveHub(); }); picker.append(button); });
  section.append(picker, content);
  renderActiveHub();
  return section;
}
