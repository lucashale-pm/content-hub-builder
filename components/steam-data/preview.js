import { renderSteamData } from "./renderer.js";
const definition = await (await fetch("./definition.json")).json();
document.querySelector("#preview").append(renderSteamData(definition.defaults));
