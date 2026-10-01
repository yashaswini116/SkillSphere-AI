"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { playAudioFeedback } from "@/lib/utils";
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Target,
  UserPlus,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, registerWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("Full Stack AI Developer");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, go directly to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === "admin" ? "/dashboard/admin" : "/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage("Please complete all fields to initialize your Career OS.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    setSubmitting(true);
    playAudioFeedback("click");

    const res = await registerWithEmail(email, password, name, targetRole);
    setSubmitting(false);

    if (res.success) {
      playAudioFeedback("success");
      router.push("/dashboard");
    } else {
      setErrorMessage(res.error || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FBF9F4] dark:bg-[#091610] text-[#13291E] dark:text-[#EEF8F2] relative">
      <div className="w-full max-w-md bg-white dark:bg-[#0E2018] p-6 sm:p-8 rounded-3xl border border-[#E7E1D3] dark:border-white/10 shadow-2xl relative overflow-hidden">
        {/* Accent Bar */}
        <div className="h-[4px] w-full bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#52B788] absolute top-0 left-0 right-0" />

        <div className="text-center space-y-2 mb-6 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1B4332] to-[#52B788] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#1B4332]/25">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#13291E] dark:text-white">
            Create Your Career OS
          </h1>
          <p className="text-xs text-[#526E60] dark:text-[#94A3B8]">
            Join engineers accelerating their tech trajectory with SkillSphere AI
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1B4332] dark:text-[#EEF8F2] mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Arya Patel"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white placeholder-[#809789]"
              />
              <User className="w-4 h-4 text-[#809789] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1B4332] dark:text-[#EEF8F2] mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arya@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white placeholder-[#809789]"
              />
              <Mail className="w-4 h-4 text-[#809789] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1B4332] dark:text-[#EEF8F2] mb-1">
              Target Career Trajectory
            </label>
            <div className="relative">
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white"
              >
                <option value="Full Stack AI Developer">Full Stack AI Developer</option>
                <option value="Cloud & DevOps SRE Engineer">Cloud & DevOps SRE Engineer</option>
                <option value="MLOps & Data Platform Engineer">MLOps & Data Platform Engineer</option>
                <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
                <option value="Data Scientist & AI Researcher">Data Scientist & AI Researcher</option>
              </select>
              <Target className="w-4 h-4 text-[#809789] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1B4332] dark:text-[#EEF8F2] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white placeholder-[#809789]"
              />
              <Lock className="w-4 h-4 text-[#809789] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-lg shadow-[#1B4332]/25 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Creating Account…</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Initialize Career OS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#526E60] dark:text-[#94A3B8]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#1B4332] dark:text-[#52B788] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
