const fireworkScripts = [
  { src: "https://asset.fwcdn3.com/js/module/fwn.js?business_id=ojeQZ5", type: "module" },
  { src: "https://asset.fwcdn3.com/js/fwn.js?business_id=ojeQZ5", noModule: true },
];

const feeds = {
  pcgamer: { channel: "pc_gamer", playlist: "oN1W89" },
  gamesradar: { channel: "gamesradar", playlist: "o0WjAj" },
  wireframe: { channel: "gamesradar", playlist: "o0WjAj" },
};

function ensureFireworkScripts() {
  fireworkScripts.forEach((definition) => {
    if (document.querySelector(`script[src="${definition.src}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = definition.src;
    if (definition.type) script.type = definition.type;
    if (definition.noModule) script.noModule = true;
    document.head.append(script);
  });
}

export function renderVerticalVideo(values, theme) {
  ensureFireworkScripts();
  const brand = ["pcgamer", "gamesradar", "wireframe"].includes(theme?.brand) ? theme.brand : "wireframe";
  const feed = feeds[brand];
  const section = document.createElement("section");
  section.className = "hub-vertical-video";
  section.dataset.component = "vertical-video";
  section.dataset.theme = brand;
  section.style.setProperty("--hub-video-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-video-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-video-display-font", theme?.font?.display || "Figtree, sans-serif");

  const heading = document.createElement("h2");
  heading.className = "hub-vertical-video__heading";
  heading.textContent = typeof values.heading === "string" ? values.heading : "";
  const embed = document.createElement("fw-embed-feed");
  embed.setAttribute("channel", feed.channel);
  embed.setAttribute("playlist", feed.playlist);
  embed.setAttribute("thumbnail_style", "dynamic");
  section.append(heading, embed);
  return section;
}
