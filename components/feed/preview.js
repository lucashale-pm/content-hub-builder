import { renderFeed } from "./renderer.js";
const definition = await (await fetch("./definition.json")).json();
const themes = {
  gamesradar: { brand: "gamesradar", color: { accent: "#ff6600", background: "#ffffff", ink: "#1a1a1a", muted: "#737373", border: "#e6e6e6", labelNews: "#008a80", labelAnalysis: "#7156c8", labelGuide: "#a85c00" }, font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" }, radius: { card: "16px" } },
  pcgamer: { brand: "pcgamer", color: { accent: "#e31b23", background: "#ffffff", ink: "#1a1a1a", muted: "#737373", border: "#e6e6e6", labelNews: "#b11f26", labelAnalysis: "#6b55ab", labelGuide: "#9c5900" }, font: { display: "Roboto Condensed, sans-serif", body: "Arial, sans-serif" }, radius: { card: "0px" } },
};
const preview = document.querySelector("#preview");
const themeSelect = document.querySelector("#theme");

function render() {
  preview.replaceChildren(renderFeed(definition.defaults, themes[themeSelect.value]));
}

themeSelect.addEventListener("change", render);
render();
