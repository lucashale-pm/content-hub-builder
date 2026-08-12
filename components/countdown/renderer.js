const text = (value) => typeof value === "string" ? value.trim() : "";
const pad = (value) => String(value).padStart(2, "0");

export function renderCountdown(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-countdown";
  section.dataset.component = "countdown";
  section.style.setProperty("--hub-countdown-background", theme?.color?.background || "#ffffff");
  section.style.setProperty("--hub-countdown-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-countdown-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-countdown-accent", theme?.color?.accent || "#ff6600");
  section.style.setProperty("--hub-countdown-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-countdown-body-font", theme?.font?.body || "Figtree, sans-serif");

  const heading = text(values.heading);
  if (heading) {
    const element = document.createElement("h2");
    element.className = "hub-countdown__heading";
    element.textContent = heading;
    section.append(element);
  }
  const targetValue = text(values.targetDateTime);
  const target = new Date(targetValue).getTime();
  if (!targetValue || Number.isNaN(target)) {
    section.hidden = !heading;
    return section;
  }
  const timer = document.createElement("p");
  timer.className = "hub-countdown__timer";
  timer.setAttribute("aria-live", "polite");
  [["Days", "days"], ["Hours", "hours"], ["Mins", "mins"]].forEach(([label, className]) => {
    const unit = document.createElement("span");
    unit.className = "hub-countdown__unit";
    const value = document.createElement("strong");
    value.className = `hub-countdown__value hub-countdown__value--${className}`;
    const name = document.createElement("span");
    name.className = "hub-countdown__label";
    name.textContent = label;
    unit.append(value, name);
    timer.append(unit);
  });
  section.append(timer);
  const update = () => {
    const remaining = Math.max(0, target - Date.now());
    const totalMinutes = Math.floor(remaining / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    timer.querySelector(".hub-countdown__value--days").textContent = String(days);
    timer.querySelector(".hub-countdown__value--hours").textContent = pad(hours);
    timer.querySelector(".hub-countdown__value--mins").textContent = pad(minutes);
    if (remaining === 0) section.dataset.finished = "true";
  };
  update();
  const interval = window.setInterval(update, 1000);
  section.cleanup = () => window.clearInterval(interval);
  return section;
}
