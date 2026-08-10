const statusTitle = document.querySelector("#statusTitle");
const statusText = document.querySelector("#statusText");

try {
  const response = await fetch("./catalogue.json");
  if (!response.ok) throw new Error(`Catalogue request failed (${response.status})`);
  const catalogue = await response.json();
  const count = Array.isArray(catalogue.components) ? catalogue.components.length : 0;
  statusTitle.textContent = "Builder foundation ready";
  statusText.textContent = count
    ? `${count} component${count === 1 ? "" : "s"} registered.`
    : "No components registered yet. Add the first component definition when its folder is ready.";
} catch (error) {
  statusTitle.textContent = "Builder setup needs attention";
  statusText.textContent = error instanceof Error ? error.message : "Could not load catalogue.json";
}
