"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
export type ColorTheme = "emerald" | "rose" | "sapphire" | "amber" | "violet";

export interface ColorThemeOption {
  id: ColorTheme;
  name: string;
  previewColor: string;
  gradientText: string;
}

export const COLOR_THEMES: ColorThemeOption[] = [
  {
    id: "emerald",
    name: "Forest & Cream",
    previewColor: "#1B4332",
    gradientText: "from-[#1B4332] via-[#2D6A4F] to-[#52B788]",
  },
  {
    id: "sapphire",
    name: "Deep Ocean",
    previewColor: "#1e3a8a",
    gradientText: "from-blue-700 to-teal-500",
  },
  {
    id: "amber",
    name: "Warm Earth",
    previewColor: "#78350f",
    gradientText: "from-amber-700 to-emerald-600",
  },
  {
    id: "rose",
    name: "Sage Rose",
    previewColor: "#9f1239",
    gradientText: "from-rose-700 to-teal-600",
  },
  {
    id: "violet",
    name: "Forest Violet",
    previewColor: "#4c1d95",
    gradientText: "from-violet-800 to-emerald-500",
  },
];

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setColorTheme: (color: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colorTheme: "emerald",
  toggleTheme: () => {},
  setTheme: () => {},
  setColorTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("emerald");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Dark / Light Mode (Defaults to clean warm cream Light mode)
    const storedTheme = localStorage.getItem("skillsphere_theme") as Theme | null;
    const initialTheme = storedTheme === "dark" ? "dark" : "light";
    setThemeState(initialTheme);
    applyMode(initialTheme);

    // Color Accent Theme (Defaults to signature Forest & Cream)
    const storedColor = localStorage.getItem("skillsphere_color_theme") as ColorTheme | null;
    const initialColor =
      storedColor && ["emerald", "rose", "sapphire", "amber", "violet"].includes(storedColor)
        ? storedColor
        : "emerald";
    setColorThemeState(initialColor);
    applyColorTheme(initialColor);
  }, []);

  const applyMode = (t: Theme) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (t === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const applyColorTheme = (c: ColorTheme) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove(
        "theme-emerald",
        "theme-rose",
        "theme-sapphire",
        "theme-amber",
        "theme-violet"
      );
      root.classList.add(`theme-${c}`);
    }
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("skillsphere_theme", t);
    applyMode(t);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const setColorTheme = (c: ColorTheme) => {
    setColorThemeState(c);
    localStorage.setItem("skillsphere_color_theme", c);
    applyColorTheme(c);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, toggleTheme, setTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
