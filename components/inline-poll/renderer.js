const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderInlinePoll(values, theme) {
  const section = document.createElement("section");
  const brand = ["pcgamer", "gamesradar", "wireframe"].includes(theme?.brand) ? theme.brand : "wireframe";
  section.className = "hub-inline-poll";
  section.dataset.component = "inline-poll";
  section.dataset.theme = brand;
  section.style.setProperty("--hub-poll-surface", theme?.color?.surface || "#1f1f1f");
  section.style.setProperty("--hub-poll-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-poll-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-poll-text", theme?.color?.text || "#ffffff");
  section.style.setProperty("--hub-poll-accent", theme?.color?.accent || "#ff6600");
  section.style.setProperty("--hub-poll-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-poll-body-font", theme?.font?.body || "Figtree, sans-serif");
  const question = text(values.question);
  const answers = Array.isArray(values.answers) ? values.answers.map((answer) => text(answer?.text)).filter(Boolean).slice(0, 4) : [];
  if (question) {
    const heading = document.createElement("h2");
    heading.className = "hub-inline-poll__question";
    heading.textContent = brand === "pcgamer" ? `PC Gamer Poll: ${question}` : question;
    section.append(heading);
  }
  if (answers.length) {
    const choices = document.createElement("div");
    choices.className = "hub-inline-poll__choices";
    choices.setAttribute("role", "group");
    choices.setAttribute("aria-label", question || "Poll choices");
    answers.forEach((answer) => {
      const choice = document.createElement("button");
      choice.className = "hub-inline-poll__choice";
      choice.type = "button";
      choice.textContent = answer;
      choice.addEventListener("click", () => {
        choices.querySelectorAll(".hub-inline-poll__choice").forEach((item) => item.classList.remove("is-selected"));
        choice.classList.add("is-selected");
      });
      choices.append(choice);
    });
    section.append(choices);
  }
  section.hidden = !question && !answers.length;
  return section;
}
