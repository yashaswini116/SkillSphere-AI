"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { ColorThemeSelector } from "@/components/common/ColorThemeSelector";
import {
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  Volume2,
  VolumeX,
  LayoutDashboard,
  Flame,
  Zap,
  LogOut,
  LogIn,
  User,
  Compass,
} from "lucide-react";
import { playAudioFeedback } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const pathname = usePathname();

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem("skillsphere_sound_enabled", String(next));
    if (next) playAudioFeedback("click");
  };

  const handleLogout = async () => {
    playAudioFeedback("click");
    await logout();
    router.push("/auth/login");
  };

  const authenticatedNavLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Skill Gap", href: "/dashboard/skill-gap" },
    { label: "Roadmaps", href: "/dashboard/roadmaps" },
    { label: "Resume ATS", href: "/dashboard/resume-analyzer" },
    { label: "Tech Radar", href: "/dashboard/career-explorer" },
    { label: "Mock Interview", href: "/dashboard/mock-interview" },
    { label: "Coding Practice", href: "/dashboard/coding" },
  ];

  const publicNavLinks = [
    { label: "Platform Overview", href: "/overview" },
    { label: "Skill Gap Engine", href: "/auth/login" },
    { label: "ATS Scanner", href: "/auth/login" },
    { label: "AI Roadmaps", href: "/auth/login" },
  ];

  const currentNavLinks = user ? authenticatedNavLinks : publicNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0E2018]/90 backdrop-blur-xl border-b border-[#E7E1D3] dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href={user ? "/dashboard" : "/overview"}
          onClick={() => playAudioFeedback("click")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1B4332] via-[#2D6A4F] to-[#52B788] flex items-center justify-center shadow-md shadow-[#1B4332]/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-[#13291E] dark:text-white">
                SkillSphere
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-[#D8F3DC] text-[#1B4332] border border-[#74C69D]/40">
                AI
              </span>
            </div>
            <p className="text-[10px] text-[#526E60] dark:text-[#94A3B8] -mt-1 font-medium hidden sm:block">
              AI Career &amp; Learning Operating System
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {currentNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => playAudioFeedback("click")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                pathname === link.href
                  ? "bg-[#D8F3DC] dark:bg-[#1B4332]/60 text-[#1B4332] dark:text-[#74C69D] border border-[#74C69D]/30"
                  : "text-[#3D5A4C] dark:text-[#CBD5E1] hover:text-[#1B4332] dark:hover:text-white hover:bg-[#F5F1E6] dark:hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2">
          {/* Dynamic Color Theme Switcher */}
          <ColorThemeSelector />

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? "Mute interactive audio chimes" : "Enable interactive audio chimes"}
            className="p-2 rounded-xl text-[#526E60] dark:text-[#94A3B8] hover:bg-[#F5F1E6] dark:hover:bg-white/5 transition-colors"
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-[#2D6A4F] dark:text-[#52B788]" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-50" />
            )}
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => {
              playAudioFeedback("click");
              toggleTheme();
            }}
            title="Toggle Warm Cream / Forest Noir Mode"
            className="p-2 rounded-xl text-[#526E60] dark:text-[#94A3B8] hover:bg-[#F5F1E6] dark:hover:bg-white/5 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#1B4332]" />
            )}
          </button>

          {/* User authenticated actions */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Gamification stats pill */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F1E6] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-xs">
                <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  {user.streakDays}d
                </span>
                <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                <span className="flex items-center gap-1 font-bold text-[#1B4332] dark:text-[#52B788]">
                  <Zap className="w-3.5 h-3.5 text-[#52B788]" />
                  Lv.{user.level} ({user.xp} XP)
                </span>
              </div>

              {/* Dashboard quick button */}
              <Link
                href="/dashboard"
                onClick={() => playAudioFeedback("click")}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-sm transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              {/* Explicit Desktop Sign Out Button */}
              <button
                id="navbar-logout-btn"
                onClick={handleLogout}
                title="Log out of SkillSphere AI"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/40 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/overview"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#2D6A4F] hover:bg-[#F5F1E6] transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Overview</span>
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-md shadow-[#1B4332]/20 transition-all hover:scale-105"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#3D5A4C] dark:text-[#CBD5E1] hover:bg-[#F5F1E6] dark:hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 border-t border-[#E7E1D3] dark:border-white/10 bg-white/98 dark:bg-[#0E2018]/98 backdrop-blur-2xl shadow-xl">
          <div className="flex flex-col gap-1.5 mt-2">
            <div className="py-2 flex items-center justify-between border-b border-[#E7E1D3] dark:border-white/10 mb-2">
              <span className="text-xs font-bold text-[#526E60]">Color Palette:</span>
              <ColorThemeSelector showLabel={true} />
            </div>

            {currentNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  playAudioFeedback("click");
                }}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-[#13291E] dark:text-[#CBD5E1] hover:bg-[#D8F3DC]/40"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-[#E7E1D3] dark:border-white/10 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold shadow-md"
                  >
                    Open Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold shadow-md"
                >
                  Sign In / Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
