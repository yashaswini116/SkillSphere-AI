"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ShieldCheck } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, only users with role === "admin" may access this route */
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in → redirect to login, preserving intended path
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (adminOnly && user.role !== "admin") {
      // Logged in as student but tried to access an admin route
      router.replace("/dashboard");
    }
  }, [user, loading, router, pathname, adminOnly]);

  // While checking auth state, show a branded Green + Cream screen
  if (loading || !user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-4 bg-[#FBF9F4] dark:bg-[#091610]">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1B4332] via-[#2D6A4F] to-[#52B788] flex items-center justify-center shadow-xl shadow-[#1B4332]/25">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#52B788] border-2 border-white dark:border-[#091610] animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-base font-bold text-[#13291E] dark:text-[#EEF8F2] tracking-tight">
            SkillSphere AI
          </h2>
          <p className="text-xs text-[#496355] dark:text-[#AAB6B0] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#52B788]" />
            Verifying secure session…
          </p>
        </div>
        <div className="w-6 h-6 rounded-full border-2 border-[#1B4332] border-t-transparent animate-spin dark:border-[#52B788] dark:border-t-transparent" />
      </div>
    );
  }

  // Admin check failed (redirect in progress)
  if (adminOnly && user.role !== "admin") return null;

  return <>{children}</>;
}
