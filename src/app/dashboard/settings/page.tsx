"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme, COLOR_THEMES, ColorTheme } from "@/context/ThemeContext";
import { isLiveAIConfigured } from "@/lib/gemini";
import { playAudioFeedback } from "@/lib/utils";
import {
  Settings,
  Key,
  User,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Palette,
  Check,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const { user, updateProfile, activeRole, setActiveRole } = useAuth();
  const { theme, toggleTheme, colorTheme, setColorTheme } = useTheme();

  const [name, setName] = useState(user?.name || "Aarav Sharma");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Full Stack AI Developer");
  const [geminiKey, setGeminiKey] = useState("");
  const [isSavedKey, setIsSavedKey] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("skillsphere_gemini_key");
      if (stored) {
        setGeminiKey(stored);
        setIsSavedKey(true);
      }
      setSoundEnabled(localStorage.getItem("skillsphere_sound_enabled") !== "false");
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, targetRole });
    playAudioFeedback("success");
    alert("Profile preferences successfully updated!");
  };

  const handleSaveApiKey = () => {
    if (typeof window !== "undefined") {
      if (geminiKey.trim()) {
        localStorage.setItem("skillsphere_gemini_key", geminiKey.trim());
        setIsSavedKey(true);
        playAudioFeedback("success");
        alert("Gemini API Key saved! Live AI generation is now activated.");
      } else {
        localStorage.removeItem("skillsphere_gemini_key");
        setIsSavedKey(false);
        playAudioFeedback("click");
        alert("API Key removed. Platform will operate in Smart Simulated Demo Mode.");
      }
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("skillsphere_sound_enabled", String(next));
    if (next) playAudioFeedback("click");
  };

  const handlePickColor = (c: ColorTheme) => {
    setColorTheme(c);
    playAudioFeedback("click");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold badge-brand">
            System Preferences & AI Keys
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your interface color themes, personal learning trajectory, API tokens, and user experience options.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Active Role:</span>
          <button
            onClick={() => {
              setActiveRole(activeRole === "admin" ? "student" : "admin");
              playAudioFeedback("click");
            }}
            className="px-3 py-1.5 rounded-xl btn-brand text-xs font-semibold shadow-sm"
          >
            {activeRole.toUpperCase()} (Switch)
          </button>
        </div>
      </div>

      {/* 1. Interface Color Palette Selector Section */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-brand" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interface Color Palette
            </h3>
          </div>
          <span className="text-xs font-bold text-brand uppercase tracking-wider">
            Active: {COLOR_THEMES.find((t) => t.id === colorTheme)?.name}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Switch the primary visual theme across the entire operating system. All buttons, graphs, glows, and badges update seamlessly in real time.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {COLOR_THEMES.map((themeOption) => {
            const isSelected = colorTheme === themeOption.id;
            return (
              <button
                key={themeOption.id}
                onClick={() => handlePickColor(themeOption.id)}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2.5 relative group ${
                  isSelected
                    ? "border-brand bg-brand-soft ring-2 ring-brand shadow-lg scale-105"
                    : "border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 bg-white dark:bg-white/5"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-md flex items-center justify-center text-white"
                  style={{ backgroundColor: themeOption.previewColor }}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {themeOption.name}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">
                  {themeOption.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Gemini BYOK API Key Section */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-brand" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Google Gemini API Key (BYOK)
            </h3>
          </div>

          {isLiveAIConfigured() ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Gemini 1.5 Flash Active</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Smart Simulated Demo Mode</span>
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Provide your personal Google Gemini API key to run live real-time LLM inference across all modules (Skill Gap, Resume ATS, Roadmaps, Interviews, Quizzes). If left blank, SkillSphere AI seamlessly uses high-fidelity realistic simulated data with zero errors!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <div className="relative flex-1 w-full">
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-mono border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <button
            onClick={handleSaveApiKey}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-brand text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{geminiKey ? "Save & Activate Key" : "Clear Key (Use Demo Mode)"}</span>
          </button>
        </div>
      </div>

      {/* 3. Personal Profile Information */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-brand" />
          <span>Learner Identity & Target Trajectory</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Target Career Trajectory
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-800 dark:bg-white/10 hover:bg-slate-900 dark:hover:bg-white/20 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Update Profile Details
            </button>
          </div>
        </form>
      </div>

      {/* 4. UX & Appearance Preferences */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand" />
          <span>Interface Mode & Audio Preferences</span>
        </h3>

        <div className="divide-y divide-slate-200 dark:divide-white/10 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Dark / Light Mode
              </p>
              <p className="text-slate-500">
                Current mode is {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </p>
            </div>
            <button
              onClick={() => {
                toggleTheme();
                playAudioFeedback("click");
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 font-semibold flex items-center gap-1.5"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Switch to Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span>Switch to Dark</span>
                </>
              )}
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Gamified Audio Feedback
              </p>
              <p className="text-slate-500">
                Play subtle synthesised Web Audio chimes on XP gain and milestone completion
              </p>
            </div>
            <button
              onClick={toggleSound}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 font-semibold flex items-center gap-1.5"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-brand" />
                  <span>Audio Enabled</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 opacity-50" />
                  <span>Audio Muted</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
