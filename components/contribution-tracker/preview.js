import { renderContributionTracker } from "./renderer.js";
const definition = await (await fetch("./definition.json")).json();
document.querySelector("#preview").append(renderContributionTracker(definition.defaults, { color: { accent: "#009b8f", background: "#fff", ink: "#1a1a1a", muted: "#737373", border: "#e6e6e6" }, font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" } }));
