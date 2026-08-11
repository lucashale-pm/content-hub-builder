const text = (value) => typeof value === "string" ? value.trim() : "";
const platformIcons = { PC: "https://cdn.simpleicons.org/windows/1a1a1a", PlayStation: "https://cdn.simpleicons.org/playstation/1a1a1a", Xbox: "https://cdn.simpleicons.org/xbox/1a1a1a", "Nintendo Switch": "https://cdn.simpleicons.org/nintendoswitch/1a1a1a" };
const infoFields = [["Release date", "releaseDate"], ["Platforms", "platforms"], ["Streaming services", "streamingServices"], ["Genres", "genres"], ["Franchise", "franchise"], ["Game publisher / developer", "publisherDeveloper"], ["Movie & TV studio / distributor", "movieTvStudioDistributor"], ["Time to beat", "timeToBeat"], ["Game Pass", "gamePass"]];

export function renderKeyInfo(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-key-info";
  section.dataset.component = "key-info";
  section.style.setProperty("--hub-key-info-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-key-info-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-key-info-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-key-info-accent", theme?.color?.accent || "#ff6600");
  section.style.setProperty("--hub-key-info-border", theme?.color?.border || "#e6e6e6");
  section.style.setProperty("--hub-key-info-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-key-info-body-font", theme?.font?.body || "Figtree, sans-serif");
  const heading = text(values.heading) || "Key info";
  const trigger = document.createElement("button");
  trigger.className = "hub-key-info__trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-expanded", "true");
  const title = document.createElement("h2");
  title.className = "hub-key-info__heading";
  title.textContent = heading;
  const chevron = document.createElement("span");
  chevron.className = "hub-key-info__chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.textContent = "⌃";
  trigger.append(title, chevron);
  const content = document.createElement("div");
  content.className = "hub-key-info__content";
  const list = document.createElement("dl");
  list.className = "hub-key-info__list";
  let detailCount = 0;
  infoFields.forEach(([label, key]) => {
    const value = values[key];
    if (!text(value) && !(Array.isArray(value) && value.length)) return;
    const item = document.createElement("div");
    item.className = "hub-key-info__item";
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    if (key === "platforms" && Array.isArray(value)) {
      description.className = "hub-key-info__platforms";
      value.forEach((platform) => {
        if (!platformIcons[platform]) return;
        const image = document.createElement("img");
        image.src = platformIcons[platform];
        image.alt = platform;
        image.title = platform;
        description.append(image);
      });
    } else description.textContent = text(value);
    item.append(term, description);
    list.append(item);
    detailCount += 1;
  });
  content.append(list);
  trigger.addEventListener("click", () => { const expanded = trigger.getAttribute("aria-expanded") === "true"; trigger.setAttribute("aria-expanded", String(!expanded)); section.classList.toggle("is-collapsed", expanded); });
  section.append(trigger, content);
  section.hidden = detailCount === 0;
  return section;
}
