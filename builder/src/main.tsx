import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "../../components/hero/styles.css";
import "../../components/feed/styles.css";
import "../../components/steam-data/styles.css";
import "../../components/vertical-video/styles.css";
import "../../components/page-content/styles.css";
import App from "./App";

createRoot(document.querySelector("#root")!).render(<StrictMode><App /></StrictMode>);
