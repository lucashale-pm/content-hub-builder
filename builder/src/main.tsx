import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "../../components/hero/styles.css";
import "../../components/feed/styles.css";
import "../../components/steam-data/styles.css";
import "../../components/vertical-video/styles.css";
import "../../components/page-content/styles.css";
import "../../components/image-gallery/styles.css";
import "../../components/timeline/styles.css";
import "../../components/game-review/styles.css";
import "../../components/key-info/styles.css";
import "../../components/inline-poll/styles.css";
import App from "./App";

createRoot(document.querySelector("#root")!).render(<StrictMode><App /></StrictMode>);
