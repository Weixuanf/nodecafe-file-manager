import React from "react";
import ReactDOM from "react-dom/client";

const topbar = document.createElement("div");
document.body.append(topbar);
import App from "./App";
import { injectCSS } from "./injectCSS";

ReactDOM.createRoot(topbar).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const api_base =
  window.location?.pathname?.split("/")?.slice(0, -1)?.join("/") ?? "";
injectCSS(api_base + "/model_manager_dist/input.css");
