import { renderPageContent } from "./renderer.js";
const definition = await (await fetch("./definition.json")).json();
document.querySelector("#preview").append(renderPageContent(definition.defaults, { color: { background: "#fff", ink: "#1a1a1a", muted: "#737373" }, font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" } }));
