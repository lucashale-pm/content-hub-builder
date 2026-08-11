import { renderRankingsTable } from "./renderer.js";
const definition = await (await fetch("./definition.json")).json();
document.querySelector("#preview").append(renderRankingsTable(definition.defaults, { brand: "gamesradar", color: { rankingAccent: "#6bdd73", surface: "#161616", background: "#fff", ink: "#1a1a1a", text: "#fff", muted: "#737373", border: "#e6e6e6" }, font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" } }));
