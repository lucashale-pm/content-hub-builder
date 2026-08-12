const text = (value) => typeof value === "string" ? value.trim() : "";
const list = (value) => Array.isArray(value) ? value : [];

function renderChoice(choice, mode, selectedLabel, onSelect) {
  const button = document.createElement("button");
  button.className = `hub-stance__choice hub-stance__choice--${mode}`;
  button.type = "button";
  const selected = text(choice.label) === selectedLabel;
  button.classList.toggle("is-selected", selected);
  button.setAttribute("aria-pressed", String(selected));
  if (mode === "five" && text(choice.emoji)) { const emoji = document.createElement("span"); emoji.className = "hub-stance__emoji"; emoji.textContent = text(choice.emoji); button.append(emoji); }
  if (mode === "five" && text(choice.label)) { const label = document.createElement("span"); label.className = "hub-stance__choice-label"; label.textContent = text(choice.label); button.append(label); }
  if (mode === "two" && text(choice.label)) { const label = document.createElement("span"); label.textContent = text(choice.label); button.append(label); }
  if (text(choice.percent)) { const percent = document.createElement("span"); percent.className = "hub-stance__percent"; percent.textContent = text(choice.percent); button.append(percent); }
  button.addEventListener("click", onSelect);
  return button;
}

export function renderStance(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-stance";
  section.dataset.component = "stance";
  section.style.setProperty("--hub-stance-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-stance-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-stance-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-stance-border", theme?.color?.border || "#e6e6e6");
  section.style.setProperty("--hub-stance-accent", theme?.color?.accent || "#ff6600");
  section.style.setProperty("--hub-stance-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-stance-body-font", theme?.font?.body || "Figtree, sans-serif");
  const heading = text(values.heading); const subheading = text(values.subheading);
  if (heading || subheading) { const header = document.createElement("header"); header.className = "hub-stance__header"; if (heading) { const title = document.createElement("h2"); title.textContent = heading; header.append(title); } if (subheading) { const copy = document.createElement("p"); copy.textContent = subheading; header.append(copy); } section.append(header); }
  const mode = values.voteMode === "5 choices" ? "five" : "two";
  const responseChoices = list(mode === "five" ? values.spiceChoices : values.twoChoices).filter((choice) => text(choice?.label) || text(choice?.emoji));
  const stances = list(values.stances).filter((stance) => Object.values(stance || {}).some((value) => text(value) || (Array.isArray(value) && value.length)));
  stances.forEach((stance) => {
    const card = document.createElement("article"); card.className = "hub-stance__card";
    if (text(stance.avatarUrl) || text(stance.author) || text(stance.role)) { const profile = document.createElement("div"); profile.className = "hub-stance__profile"; if (text(stance.avatarUrl)) { const avatar = document.createElement("img"); avatar.src = text(stance.avatarUrl); avatar.alt = ""; profile.append(avatar); } const person = document.createElement("div"); if (text(stance.author)) { const name = document.createElement("strong"); name.textContent = text(stance.author); person.append(name); } if (text(stance.role)) { const role = document.createElement("span"); role.textContent = text(stance.role); person.append(role); } profile.append(person); card.append(profile); }
    if (text(stance.statement)) { const title = document.createElement("h3"); title.textContent = text(stance.statement); card.append(title); }
    if (text(stance.body)) { const copy = document.createElement("p"); copy.className = "hub-stance__body"; copy.textContent = text(stance.body); card.append(copy); }
    if (text(stance.sourceText) && text(stance.sourceUrl)) { const source = document.createElement("a"); source.className = "hub-stance__source"; source.href = text(stance.sourceUrl); source.textContent = text(stance.sourceText); card.append(source); }
    const choices = responseChoices;
    if (choices.length) { const votes = document.createElement("div"); votes.className = `hub-stance__choices hub-stance__choices--${mode}`; let selected = text(stance.selectedChoice); const redraw = () => { votes.replaceChildren(...choices.map((choice) => renderChoice(choice, mode, selected, () => { selected = text(choice.label); redraw(); }))); }; redraw(); card.append(votes); }
    const comments = list(stance.comments).filter((comment) => text(comment?.username) || text(comment?.text) || text(comment?.upvotes));
    if (comments.length) { const commentBox = document.createElement("div"); commentBox.className = "hub-stance__comments"; const inputRow = document.createElement("form"); inputRow.className = "hub-stance__comment-form"; const input = document.createElement("input"); input.placeholder = "Share your take..."; input.setAttribute("aria-label", "Share your take"); const post = document.createElement("button"); post.type = "submit"; post.textContent = "Post"; inputRow.append(input, post); const commentList = document.createElement("div"); commentList.className = "hub-stance__comment-list"; const addComment = (comment) => { const item = document.createElement("div"); item.className = "hub-stance__comment"; if (text(comment.username)) { const username = document.createElement("strong"); username.textContent = text(comment.username); item.append(username); } if (text(comment.text)) { const copy = document.createElement("p"); copy.textContent = text(comment.text); item.append(copy); } if (text(comment.upvotes)) { const votes = document.createElement("span"); votes.textContent = `▲ ${text(comment.upvotes)}`; item.append(votes); } commentList.append(item); }; comments.forEach(addComment); inputRow.addEventListener("submit", (event) => { event.preventDefault(); if (!text(input.value)) return; addComment({ username: "@you", text: input.value, upvotes: "0 upvotes" }); input.value = ""; }); commentBox.append(inputRow, commentList); card.append(commentBox); }
    section.append(card);
  });
  section.hidden = !heading && !subheading && !stances.length;
  return section;
}
