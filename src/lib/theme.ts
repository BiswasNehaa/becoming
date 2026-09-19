import { useEffect, useState } from "react";

const THEME_KEY = "becoming:theme";

// Defaults to light rather than following the OS/browser's dark-mode
// preference — the app is meant to read as bright and hopeful first,
// not dark. Once someone actually toggles it, that choice sticks.
function getInitialTheme(): "light" | "dark" {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
