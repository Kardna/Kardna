import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";
import "./styles/animations.css";
import "./styles/kardna-refresh.css";
import { routerBasename } from "./utilities/paths";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={routerBasename()}>
    <App />
  </BrowserRouter>,
);
