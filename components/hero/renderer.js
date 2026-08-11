const fallbackTheme = {
  brand: "gamesradar",
  color: { accent: "#ff6600", surface: "#161616", text: "#ffffff" },
  font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" },
  typography: {
    h1: { fontFamily: "Figtree, sans-serif", fontSize: "clamp(40px, 13vw, 64px)", fontWeight: 400, lineHeight: ".9", letterSpacing: "-.04em" },
  },
  radius: { card: "16px" },
};

function text(value) {
  return typeof value === "string" ? value : "";
}

function themeVariables(theme) {
  const resolved = {
    ...fallbackTheme,
    ...theme,
    color: { ...fallbackTheme.color, ...theme?.color },
    font: { ...fallbackTheme.font, ...theme?.font },
    typography: { h1: { ...fallbackTheme.typography.h1, ...theme?.typography?.h1 } },
    radius: { ...fallbackTheme.radius, ...theme?.radius },
  };
  return {
    "--hub-accent": resolved.color.accent,
    "--hub-surface": resolved.color.surface,
    "--hub-text": resolved.color.text,
    "--hub-display-font": resolved.font.display,
    "--hub-body-font": resolved.font.body,
    "--hub-h1-font-family": resolved.typography.h1.fontFamily,
    "--hub-h1-font-size": resolved.typography.h1.fontSize,
    "--hub-h1-font-weight": resolved.typography.h1.fontWeight,
    "--hub-h1-line-height": resolved.typography.h1.lineHeight,
    "--hub-h1-letter-spacing": resolved.typography.h1.letterSpacing,
    "--hub-card-radius": resolved.radius.card,
  };
}

function addText(parent, tag, className, value) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text(value);
  parent.append(element);
  return element;
}

export function renderHero(values, theme = fallbackTheme) {
  const component = document.createElement("section");
  component.className = "hub-hero";
  component.dataset.component = "hero";
  component.dataset.theme = theme.brand || fallbackTheme.brand;
  Object.entries(themeVariables(theme)).forEach(([name, value]) => component.style.setProperty(name, value));

  const mediaType = values.mediaType === "video" ? "video" : "image";
  const mediaFrame = document.createElement("div");
  mediaFrame.className = "hub-hero__media-frame";
  const media = document.createElement(mediaType === "video" ? "video" : "img");
  media.className = "hub-hero__media";
  if (mediaType === "video") {
    media.src = text(values.mediaUrl);
    media.poster = text(values.mediaPoster);
    media.muted = true;
    media.playsInline = true;
    media.preload = "metadata";
    media.setAttribute("aria-label", text(values.mediaAlt));
  } else {
    media.src = text(values.mediaUrl);
    media.alt = text(values.mediaAlt);
  }
  mediaFrame.append(media);

  if (mediaType === "video") {
    const play = document.createElement("button");
    play.className = "hub-hero__play";
    play.type = "button";
    play.textContent = "Play video";
    play.addEventListener("click", () => media.play());
    mediaFrame.append(play);
  }
  component.append(mediaFrame);

  const content = document.createElement("div");
  content.className = "hub-hero__content";
  if (text(values.eyebrow)) addText(content, "p", "hub-hero__eyebrow", values.eyebrow);
  addText(content, "h1", "hub-hero__headline", values.headline);
  addText(content, "p", "hub-hero__subheadline", values.subheadline);

  const meta = document.createElement("p");
  meta.className = "hub-hero__meta";
  addText(meta, "span", "hub-hero__followers", values.followers);
  const separator = document.createElement("span");
  separator.className = "hub-hero__separator";
  separator.setAttribute("aria-hidden", "true");
  meta.append(separator);
  addText(meta, "time", "hub-hero__updated", values.updated);
  content.append(meta);
  component.append(content);

  return component;
}
