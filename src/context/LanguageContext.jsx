// src/context/LanguageContext.jsx
import React, { createContext, useEffect, useState } from "react";
import translations from "../translations";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("zatpatt_lang") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("zatpatt_lang", lang);
    } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => translations[lang]?.[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
