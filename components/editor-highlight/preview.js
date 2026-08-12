import { renderEditorHighlight } from "./renderer.js";
const definition = await (await fetch("./definition.json")).json();
document.querySelector("#preview").append(renderEditorHighlight(definition.defaults, { color: { accent: "#ff6600", background: "#fff", ink: "#1a1a1a", muted: "#737373", border: "#e6e6e6" }, font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" } }));
