import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { translations, type TKey } from "../i18n/translations";
type Lang = "th" | "en";
interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
  toggle: () => void;
}
const C = createContext<LangCtx | null>(null);
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("lang") as Lang) || "th"
  );
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const t = useCallback((k: TKey) => translations[k][lang] ?? k, [lang]);
  const toggle = useCallback(
    () => setLang((l) => (l === "th" ? "en" : "th")),
    []
  );
  return (
    <C.Provider value={{ lang, setLang, t, toggle }}>{children}</C.Provider>
  );
}
export function useLang() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useLang outside provider");
  return ctx;
}
