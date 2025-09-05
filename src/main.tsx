import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { ThemeProvider } from "./context/ThemeContext";
import { LangProvider } from "./context/LangContext";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <LangProvider>
        <App />
      </LangProvider>
    </ThemeProvider>
  </BrowserRouter>
);
