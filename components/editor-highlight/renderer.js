const text = (value) => typeof value === "string" ? value.trim() : "";
const assets = { "./assets/maya-chen.png": new URL("../feed/assets/maya-chen.png", import.meta.url).href, "./assets/jordan-lee.png": new URL("../feed/assets/jordan-lee.png", import.meta.url).href, "./assets/raj-patel.png": new URL("../feed/assets/raj-patel.png", import.meta.url).href };
const assetUrl = (value) => assets[text(value)] || text(value);

export function renderEditorHighlight(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-editor-highlight";
  section.dataset.component = "editor-highlight";
  section.style.setProperty("--hub-editor-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-editor-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-editor-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-editor-accent", theme?.color?.accent || "#ff6600");
  section.style.setProperty("--hub-editor-border", theme?.color?.border || "#e6e6e6");
  section.style.setProperty("--hub-editor-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-editor-body-font", theme?.font?.body || "Figtree, sans-serif");
  const heading = text(values.heading); const subheading = text(values.subheading);
  if (heading || subheading) { const header = document.createElement("header"); header.className = "hub-editor-highlight__header"; if (heading) { const title = document.createElement("h2"); title.textContent = heading; header.append(title); } if (subheading) { const copy = document.createElement("p"); copy.textContent = subheading; header.append(copy); } section.append(header); }
  const editors = Array.isArray(values.editors) ? values.editors.filter((editor) => text(editor?.name) || text(editor?.imageUrl) || text(editor?.title)) : [];
  if (editors.length) { const list = document.createElement("div"); list.className = "hub-editor-highlight__list"; editors.forEach((editor) => { const card = document.createElement("article"); card.className = "hub-editor-highlight__card"; if (text(editor.imageUrl)) { const image = document.createElement("img"); image.className = "hub-editor-highlight__image"; image.src = assetUrl(editor.imageUrl); image.alt = text(editor.imageAlt); card.append(image); } const body = document.createElement("div"); body.className = "hub-editor-highlight__body"; if (text(editor.name)) { const name = document.createElement("h3"); name.textContent = text(editor.name); body.append(name); } if (text(editor.title)) { const title = document.createElement("p"); title.className = "hub-editor-highlight__title"; title.textContent = text(editor.title); body.append(title); } if (text(editor.favoriteGame) || text(editor.favoriteGameImageUrl)) { const favoriteWrap = document.createElement("div"); favoriteWrap.className = "hub-editor-highlight__favorite-wrap"; const favoriteLabel = document.createElement("p"); favoriteLabel.className = "hub-editor-highlight__favorite-label"; favoriteLabel.textContent = "Favourite Game"; const favorite = document.createElement("div"); favorite.className = "hub-editor-highlight__favorite"; if (text(editor.favoriteGameImageUrl)) { const gameImage = document.createElement("img"); gameImage.src = text(editor.favoriteGameImageUrl); gameImage.alt = text(editor.favoriteGameImageAlt); favorite.append(gameImage); } if (text(editor.favoriteGame)) { const game = document.createElement("span"); game.textContent = text(editor.favoriteGame); favorite.append(game); } favoriteWrap.append(favoriteLabel, favorite); body.append(favoriteWrap); } if (text(editor.followLabel) && text(editor.followUrl)) { const follow = document.createElement("a"); follow.className = "hub-editor-highlight__follow"; follow.href = text(editor.followUrl); follow.textContent = text(editor.followLabel); body.append(follow); } card.append(body); list.append(card); }); section.append(list); }
  section.hidden = !heading && !subheading && !editors.length;
  return section;
}
