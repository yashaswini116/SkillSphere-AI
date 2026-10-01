"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Authenticated users go straight to their dashboard
        router.replace(user.role === "admin" ? "/dashboard/admin" : "/dashboard");
      } else {
        // First screen for unauthenticated users is Login / Sign Up
        router.replace("/auth/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-[#FBF9F4] dark:bg-[#091610]">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1B4332] via-[#2D6A4F] to-[#52B788] flex items-center justify-center shadow-xl shadow-[#1B4332]/25">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#52B788] border-2 border-white dark:border-[#091610] animate-pulse" />
      </div>

      <div className="mt-5 text-center space-y-1">
        <h1 className="text-xl font-extrabold text-[#13291E] dark:text-[#EEF8F2] tracking-tight">
          SkillSphere AI
        </h1>
        <p className="text-xs text-[#496355] dark:text-[#AAB6B0] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#52B788]" />
          <span>Initializing Career &amp; Learning OS…</span>
        </p>
      </div>

      <div className="mt-4 w-7 h-7 rounded-full border-2 border-[#1B4332] border-t-transparent animate-spin dark:border-[#52B788] dark:border-t-transparent" />
    </div>
  );
}
