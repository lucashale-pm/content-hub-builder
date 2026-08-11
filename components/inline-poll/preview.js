import { renderInlinePoll } from "./renderer.js";
const definition = await (await fetch("./definition.json")).json();
document.querySelector("#preview").append(renderInlinePoll(definition.defaults, { brand: "gamesradar", color: { accent: "#ff6600", surface: "#1f1f1f", background: "#fff", ink: "#1a1a1a", text: "#fff" }, font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" } }));
