import ReactDOM from "react-dom";
import "./App.css";
import { Suspense, lazy, useEffect, useState } from "react";
import { waitForApp } from "./comfyapp";
import { ThemeProvider } from "./components/theme-provider";
import { SWRConfig } from "swr";
import { swrLocalStorageProvider } from "./utils/swrFetcher";
const ModelManagerTopbar = lazy(
  () => import("./model-manager/ModelManagerTopbar")
);

let menuPush = document.getElementsByClassName("comfyui-menu-push").item(0);
if (!menuPush) {
  menuPush = document.createElement("div");
  menuPush.setAttribute(
    "style",
    "position: fixed; top: 0; left: 2; z-index: 1000;"
  );
  document.body.appendChild(menuPush);
}
const middleMenu = document.createElement("div");
menuPush?.append(middleMenu);

function App() {
  const [finishLoading, setFinishLoading] = useState(false);
  const myQueueButtonDiv = document.createElement("div");
  const queueButtonDiv = document
    .getElementsByClassName("comfyui-queue-button")
    .item(0);
  queueButtonDiv?.replaceWith(myQueueButtonDiv);

  useEffect(() => {
    if (import.meta.env.DEV) {
      setFinishLoading(true);
      return;
    }
    waitForApp().then(() => {
      setFinishLoading(true);
    });
  }, []);
  if (!finishLoading) {
    return null;
  }
  return (
    <SWRConfig value={{ provider: swrLocalStorageProvider }}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="tailwind dark">
          {middleMenu &&
            ReactDOM.createPortal(
              <div className="tailwind dark">
                <Suspense fallback={null}>
                  <ModelManagerTopbar className="tailwind dark" />
                </Suspense>
              </div>,
              middleMenu
            )}
        </div>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default App;
