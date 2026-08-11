import { renderImageGallery } from "./renderer.js";
const definition = await (await fetch("./definition.json")).json();
document.querySelector("#preview").append(renderImageGallery(definition.defaults, { color: { background: "#fff", ink: "#1a1a1a" }, font: { display: "Figtree, sans-serif" } }));
