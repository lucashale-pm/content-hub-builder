import { renderVerticalVideo } from "./renderer.js";
const definition = await (await fetch("./definition.json")).json();
document.querySelector("#preview").append(renderVerticalVideo(definition.defaults, { brand: "gamesradar", color: { background: "#fff", ink: "#1a1a1a" }, font: { display: "Figtree, sans-serif" } }));
