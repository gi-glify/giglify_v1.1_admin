import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AOS from "aos";
import { AppRouter } from "./app/router";
import "./styles.css";
import { ThemeProvider } from "./app/ThemeProvider";

AOS.init({ duration: 600, once: true, easing: "ease-out", offset: 40 });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider><AppRouter /></ThemeProvider>
  </StrictMode>,
);
