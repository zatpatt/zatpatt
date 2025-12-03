// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext"; // ✅ add this import
import { DarkModeProvider } from "./context/DarkModeContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext";

import AutoTranslateProvider from "./context/AutoTranslateProvider"; 
import { LanguageProvider } from "./context/LanguageContext";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AutoTranslateProvider>
        <LanguageProvider>
          <CartProvider>
           <DarkModeProvider>
            <FavoritesProvider>
            <App />
            </FavoritesProvider>
            </DarkModeProvider>
          </CartProvider>
        </LanguageProvider>
      </AutoTranslateProvider>
    </BrowserRouter>
  </React.StrictMode>
);
