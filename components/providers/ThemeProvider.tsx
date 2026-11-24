"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Theme = "fog" | "ink";

type ThemeContextValue = {
  theme: Theme;
  toggle: (origin?: { x: number; y: number }) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "fog",
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/**
 * Theme crossfade — the reference tweens its shader hold uniform over
 * 1s on power2.inOut. CSS mirrors that with the same 1s ease; the
 * WebGL fog crossfades on top of it.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("fog");
  const busy = useRef(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "ink" || current === "fog") setTheme(current);
  }, []);

  const toggle = useCallback(() => {
    if (busy.current) return;
    const next: Theme = theme === "ink" ? "fog" : "ink";
    busy.current = true;
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
    window.setTimeout(() => {
      busy.current = false;
    }, 1000);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
