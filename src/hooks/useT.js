import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../context/AutoTranslateProvider";

export function useT(sentence) {
  const { t } = useContext(LanguageContext);
  const [text, setText] = useState(sentence);

  useEffect(() => {
    t(sentence).then(setText);
  }, [sentence]);

  return text;
}
