import { renderHero } from "./renderer.js";

const themes = {
  gamesradar: { brand: "gamesradar", color: { accent: "#ff6600", surface: "#161616", text: "#ffffff" }, font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" }, typography: { h1: { fontFamily: "Figtree, sans-serif", fontSize: "clamp(40px, 13vw, 64px)", fontWeight: 400, lineHeight: ".9", letterSpacing: "-.04em" } }, radius: { card: "16px" } },
  pcgamer: { brand: "pcgamer", color: { accent: "#e31b23", surface: "#111111", text: "#ffffff" }, font: { display: "Roboto Condensed, sans-serif", body: "Arial, sans-serif" }, typography: { h1: { fontFamily: "Roboto Condensed, sans-serif", fontSize: "clamp(40px, 13vw, 62px)", fontWeight: 700, lineHeight: ".92", letterSpacing: "-.025em" } }, radius: { card: "0px" } },
};

const response = await fetch("./definition.json");
const definition = await response.json();
const preview = document.querySelector("#preview");
const themeSelect = document.querySelector("#theme");

function render() {
  preview.replaceChildren(renderHero(definition.defaults, themes[themeSelect.value]));
}

themeSelect.addEventListener("change", render);
render();
