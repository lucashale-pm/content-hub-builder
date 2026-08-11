const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderSteamData(values) {
  const appId = text(values.appId);
  const section = document.createElement("section");
  section.className = "hub-steam-data";
  section.dataset.component = "steam-data";

  const frame = document.createElement("iframe");
  frame.className = "hub-steam-data__embed";
  frame.src = `https://steamdb.info/embed/?appid=${encodeURIComponent(appId)}`;
  frame.height = "389";
  frame.loading = "lazy";
  frame.title = appId ? `SteamDB data for app ${appId}` : "SteamDB data";
  frame.setAttribute("scrolling", "no");
  section.append(frame);
  return section;
}
