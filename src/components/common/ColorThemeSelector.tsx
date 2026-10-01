"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, COLOR_THEMES, ColorTheme } from "@/context/ThemeContext";
import { playAudioFeedback } from "@/lib/utils";
import { Palette, Check } from "lucide-react";

export const ColorThemeSelector: React.FC<{ showLabel?: boolean }> = ({ showLabel = false }) => {
  const { colorTheme, setColorTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (c: ColorTheme) => {
    setColorTheme(c);
    playAudioFeedback("click");
    setIsOpen(false);
  };

  const activeOption = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Interface Color Scheme"
        className="flex items-center gap-1.5 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
      >
        <div
          className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
          style={{ backgroundColor: activeOption.previewColor }}
        />
        {showLabel && (
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {activeOption.name}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-panel border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Select Color Scheme
          </p>
          <div className="space-y-1 mt-1">
            {COLOR_THEMES.map((theme) => {
              const isSelected = colorTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelect(theme.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-slate-100 dark:bg-white/10 font-bold"
                      : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-sm flex-shrink-0"
                      style={{ backgroundColor: theme.previewColor }}
                    />
                    <span>{theme.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
