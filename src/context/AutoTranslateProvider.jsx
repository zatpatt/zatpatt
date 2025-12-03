import React, { createContext, useState, useEffect } from "react";
import translate from "libretranslate";

export const LanguageContext = createContext();

export default function AutoTranslateProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("language") || "en");

  useEffect(() => {
    localStorage.setItem("language", lang);
  }, [lang]);

  const t = async (text) => {
    if (lang === "en") return text;

    try {
      const translated = await translate(text, {
        from: "en",
        to: lang,
      });
      return translated;
    } catch (err) {
      console.log("Translation error:", err);
      return text;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
