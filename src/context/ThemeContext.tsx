import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface ThemeCtx {
  theme: "light" | "dark";
  toggle: () => void;
}
const C = createContext<ThemeCtx | null>(null);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as any) || "light"
  );
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <C.Provider
      value={{
        theme,
        toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")),
      }}
    >
      {children}
    </C.Provider>
  );
}
export function useTheme() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useTheme outside provider");
  return ctx;
}
