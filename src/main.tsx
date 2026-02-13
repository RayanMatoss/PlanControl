import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { DevErrorOverlay } from "./components/DevErrorOverlay";
import { DevErrorBoundary } from "./components/DevErrorBoundary";
import "./styles/themes.css";
import "./styles/theme-packs.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <DevErrorBoundary>
    <DevErrorOverlay />
    <App />
  </DevErrorBoundary>
);
