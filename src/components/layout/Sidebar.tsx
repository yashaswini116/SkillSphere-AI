"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Target,
  Compass,
  MapPin,
  FileText,
  BookOpen,
  Award,
  Code2,
  Mic,
  FolderGit2,
  Trophy,
  Bot,
  Shield,
  Settings,
  Flame,
  Zap,
  Sparkles,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { playAudioFeedback } from "@/lib/utils";

interface SidebarProps {
  onOpenMentor?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenMentor }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, activeRole, setActiveRole } = useAuth();

  const handleLogout = async () => {
    playAudioFeedback("click");
    await logout();
    router.push("/auth/login");
  };

  const primaryNav = [
    { label: "Command Center", href: "/dashboard", icon: LayoutDashboard },
    { label: "Skill-Gap Analyzer", href: "/dashboard/skill-gap", icon: Target, badge: "AI" },
    { label: "Career Explorer", href: "/dashboard/career-explorer", icon: Compass },
    { label: "AI Roadmaps", href: "/dashboard/roadmaps", icon: MapPin },
    { label: "Resume ATS Scanner", href: "/dashboard/resume-analyzer", icon: FileText, badge: "ATS 90+" },
    { label: "RAG Study Assistant", href: "/dashboard/study-assistant", icon: BookOpen, badge: "PDF" },
    { label: "AI Quiz & MCQs", href: "/dashboard/quiz", icon: Award },
    { label: "Coding Sandbox", href: "/dashboard/coding", icon: Code2 },
    { label: "AI Mock Interview", href: "/dashboard/mock-interview", icon: Mic, badge: "STAR" },
    { label: "Project & Portfolio", href: "/dashboard/portfolio", icon: FolderGit2 },
    { label: "XP & Leaderboard", href: "/dashboard/gamification", icon: Trophy },
    { label: "AI Mentor Lounge", href: "/dashboard/mentor", icon: Bot, badge: "24/7" },
  ];

  const adminNav = [
    { label: "Admin Oversight", href: "/dashboard/admin", icon: Shield, badge: "Admin" },
  ];

  const bottomNav = [
    { label: "Settings & AI Keys", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 border-r border-[#E7E1D3] dark:border-white/10 bg-[#FBF9F4]/90 dark:bg-[#0E2018]/90 backdrop-blur-xl overflow-y-auto">
      {/* User Progress Header Card */}
      <div className="p-4 border-b border-[#E7E1D3] dark:border-white/10 bg-white/40 dark:bg-black/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1B4332] via-[#2D6A4F] to-[#52B788] p-0.5 flex-shrink-0 shadow-sm">
            <div className="w-full h-full bg-[#1B4332] rounded-[14px] flex items-center justify-center text-white font-extrabold text-xs">
              {user?.name?.slice(0, 2).toUpperCase() || "SS"}
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-[#13291E] dark:text-white truncate">
              {user?.name || "Learner"}
            </p>
            <p className="text-[11px] text-[#526E60] dark:text-[#94A3B8] truncate">
              {user?.targetRole || "AI Engineer"}
            </p>
          </div>
        </div>

        {/* Level & Streak Stats Row in Green & Cream */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="px-2.5 py-1.5 rounded-xl bg-[#D8F3DC]/70 dark:bg-white/5 border border-[#B7E4C7] dark:border-white/10">
            <div className="flex items-center gap-1 text-[10px] text-[#245842] dark:text-[#95D5B2] font-semibold">
              <Zap className="w-3 h-3 text-[#2D6A4F] dark:text-[#52B788]" />
              <span>Level {user?.level || 1}</span>
            </div>
            <p className="text-xs font-extrabold text-[#1B4332] dark:text-[#52B788] mt-0.5">
              {user?.xp || 0} XP
            </p>
          </div>

          <div className="px-2.5 py-1.5 rounded-xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10">
            <div className="flex items-center gap-1 text-[10px] text-[#526E60] dark:text-[#94A3B8] font-semibold">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Streak</span>
            </div>
            <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
              {user?.streakDays || 1} Days 🔥
            </p>
          </div>
        </div>

        {/* Quick Floating Mentor Trigger Button */}
        {onOpenMentor && (
          <button
            onClick={() => {
              playAudioFeedback("click");
              onOpenMentor();
            }}
            className="w-full mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#143326] hover:to-[#1B4332] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#74C69D]" />
              <span>Ask AI Mentor</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-3 space-y-0.5">
        <p className="px-3 text-[10px] font-bold text-[#6C8677] dark:text-[#94A3B8] uppercase tracking-wider mb-1.5">
          Career OS Suite
        </p>
        {primaryNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => playAudioFeedback("click")}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? "bg-[#1B4332] text-white shadow-md shadow-[#1B4332]/25 font-bold"
                  : "text-[#3D5A4C] dark:text-[#CBD5E1] hover:bg-[#F5F1E6] dark:hover:bg-white/5 hover:text-[#13291E] dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-[#6C8677] group-hover:text-[#1B4332] dark:text-slate-400 dark:group-hover:text-[#52B788]"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#D8F3DC] text-[#1B4332] dark:bg-white/10 dark:text-[#74C69D]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Admin Navigation */}
        <div className="pt-3 mt-3 border-t border-[#E7E1D3] dark:border-white/10">
          <div className="flex items-center justify-between px-3 mb-1.5">
            <span className="text-[10px] font-bold text-[#6C8677] dark:text-[#94A3B8] uppercase tracking-wider">
              Administration
            </span>
            <button
              onClick={() => {
                const next = activeRole === "student" ? "admin" : "student";
                setActiveRole(next);
                playAudioFeedback("click");
              }}
              className="text-[10px] text-[#2D6A4F] dark:text-[#52B788] hover:underline font-bold"
            >
              Role: {activeRole.toUpperCase()}
            </button>
          </div>
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => playAudioFeedback("click")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#2D6A4F] text-white font-bold shadow-md shadow-[#2D6A4F]/25"
                    : "text-[#3D5A4C] dark:text-[#CBD5E1] hover:bg-[#F5F1E6] dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#52B788]" />
                  <span>{item.label}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D8F3DC] text-[#1B4332]">
                  {item.badge}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Settings & Sign Out */}
      <div className="p-3 border-t border-[#E7E1D3] dark:border-white/10 space-y-1">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => playAudioFeedback("click")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#1B4332] text-white font-bold"
                  : "text-[#3D5A4C] dark:text-[#CBD5E1] hover:bg-[#F5F1E6] dark:hover:bg-white/5 hover:text-[#13291E] dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 text-[#52B788]" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Exit</span>
        </button>
      </div>
    </aside>
  );
};
