"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { playAudioFeedback } from "@/lib/utils";
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  GraduationCap,
  LogIn,
  Eye,
  EyeOff,
  Zap,
  Brain,
  Trophy,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  User,
  Target,
  ExternalLink,
} from "lucide-react";

const FEATURES = [
  { icon: Brain, label: "AI Skill-Gap Telemetry" },
  { icon: Trophy, label: "Gamified Sprints" },
  { icon: Zap, label: "Adaptive Roadmaps" },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user,
    loading,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    resetPassword,
    loginAsDemoStudent,
    loginAsDemoAdmin,
    isFirebaseLive,
  } = useAuth();

  // Mode: "login" | "register" | "forgot"
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("Full Stack AI Developer");
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [demoRoleLoading, setDemoRoleLoading] = useState<"student" | "admin" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine redirect destination
  const getDestinationPath = (role?: string) => {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) return redirectParam;
    return role === "admin" ? "/dashboard/admin" : "/dashboard";
  };

  // If already authenticated, skip login and redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace(getDestinationPath(user.role));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading || user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#FBF9F4] dark:bg-[#091610]">
        <div className="w-10 h-10 rounded-full border-2 border-[#1B4332] border-t-transparent animate-spin dark:border-[#52B788] dark:border-t-transparent" />
      </div>
    );
  }

  // Handle Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setSubmitting(true);
    playAudioFeedback("click");

    const res = await loginWithEmail(email, password);
    setSubmitting(false);

    if (res.success) {
      playAudioFeedback("success");
      router.push(getDestinationPath());
    } else {
      setErrorMessage(res.error || "Failed to sign in. Please verify your credentials.");
      playAudioFeedback("click");
    }
  };

  // Handle Email/Password Register
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() || !password) {
      setErrorMessage("Please provide a valid email and password (minimum 6 characters).");
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
      router.push(getDestinationPath());
    } else {
      setErrorMessage(res.error || "Registration failed. Please try again.");
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setGoogleLoading(true);
    playAudioFeedback("click");

    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (res.success) {
      playAudioFeedback("success");
      router.push(getDestinationPath());
    } else {
      setErrorMessage(res.error || "Google authentication was cancelled or failed.");
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your email to receive a password reset link.");
      return;
    }

    setSubmitting(true);
    playAudioFeedback("click");

    const res = await resetPassword(email);
    setSubmitting(false);

    if (res.success) {
      setSuccessMessage(res.message || "Reset link dispatched. Please check your inbox.");
      playAudioFeedback("success");
    } else {
      setErrorMessage(res.error || "Failed to send reset link.");
    }
  };

  // Handle 1-Click Demo Login
  const handleDemoAccess = (role: "student" | "admin") => {
    setDemoRoleLoading(role);
    setErrorMessage(null);
    playAudioFeedback("click");
    setTimeout(() => {
      if (role === "student") {
        loginAsDemoStudent();
        router.push(getDestinationPath("student"));
      } else {
        loginAsDemoAdmin();
        router.push(getDestinationPath("admin"));
      }
    }, 600);
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] p-4 sm:p-6 relative overflow-hidden bg-[#FBF9F4] dark:bg-[#091610] text-[#13291E] dark:text-[#EEF8F2]">
      {/* Ambient Green & Cream Blobs */}
      {mounted && (
        <>
          <div
            className="absolute rounded-full bg-gradient-to-br from-[#1B4332]/15 via-[#2D6A4F]/10 to-[#52B788]/15 blur-3xl pointer-events-none"
            style={{
              width: 500,
              height: 500,
              left: "-10%",
              top: "-10%",
              animation: "float-orb-1 18s ease-in-out infinite alternate",
            }}
          />
          <div
            className="absolute rounded-full bg-gradient-to-br from-[#52B788]/20 via-[#D8F3DC]/30 to-[#1B4332]/10 blur-3xl pointer-events-none"
            style={{
              width: 420,
              height: 420,
              right: "-8%",
              bottom: "5%",
              animation: "float-orb-2 22s ease-in-out 4s infinite alternate",
            }}
          />
        </>
      )}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div
        className="w-full max-w-[460px] relative z-10 my-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Main Authentication Card */}
        <div className="bg-white dark:bg-[#0E2018] rounded-3xl border border-[#E7E1D3] dark:border-white/10 shadow-2xl shadow-[#1B4332]/10 overflow-hidden">
          {/* Top Forest Green Accent Bar */}
          <div className="h-[4px] w-full bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#52B788]" />

          <div className="p-6 sm:p-8 space-y-5">
            {/* Logo, Title & Tagline */}
            <div className="text-center space-y-2.5">
              <div className="relative inline-flex">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1B4332] via-[#2D6A4F] to-[#52B788] flex items-center justify-center shadow-lg shadow-[#1B4332]/25">
                  <Sparkles className="w-7 h-7 text-white animate-pulse" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#52B788] border-2 border-white dark:border-[#0E2018] animate-ping" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#52B788] border-2 border-white dark:border-[#0E2018]" />
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <h1 className="text-2xl font-extrabold text-[#13291E] dark:text-white tracking-tight">
                    SkillSphere
                  </h1>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#D8F3DC] text-[#1B4332] border border-[#74C69D]/40">
                    AI
                  </span>
                </div>
                <p className="text-xs text-[#526E60] dark:text-[#94A3B8] mt-1 font-medium">
                  Your Autonomous AI Career &amp; Learning Operating System
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                {FEATURES.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#F5F1E6] dark:bg-white/5 text-[#245842] dark:text-[#95D5B2] border border-[#E7E1D3] dark:border-white/10"
                  >
                    <Icon className="w-3 h-3 text-[#2D6A4F] dark:text-[#52B788]" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Mode Switcher Tabs (Sign In vs Create Account) */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F5F1E6] dark:bg-black/20 border border-[#E7E1D3] dark:border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  playAudioFeedback("click");
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === "login"
                    ? "bg-[#1B4332] text-white shadow-md shadow-[#1B4332]/20"
                    : "text-[#526E60] dark:text-[#94A3B8] hover:text-[#13291E] dark:hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  playAudioFeedback("click");
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === "register"
                    ? "bg-[#1B4332] text-white shadow-md shadow-[#1B4332]/20"
                    : "text-[#526E60] dark:text-[#94A3B8] hover:text-[#13291E] dark:hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error & Success Feedback Alerts */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{successMessage}</span>
              </div>
            )}

            {/* Google Authentication Button */}
            {mode !== "forgot" && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || submitting}
                  className="w-full py-3 px-4 rounded-2xl border border-[#E7E1D3] dark:border-white/15 bg-[#FFFDF9] dark:bg-white/5 hover:bg-[#F5F1E6] dark:hover:bg-white/10 text-xs font-bold text-[#13291E] dark:text-white transition-all flex items-center justify-center gap-3 shadow-sm hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-[#1B4332] border-t-transparent animate-spin dark:border-[#52B788]" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#E7E1D3] dark:bg-white/10" />
                  <span className="text-[10px] font-bold text-[#809789] dark:text-[#94A3B8] uppercase tracking-wider">
                    or with email
                  </span>
                  <div className="flex-1 h-px bg-[#E7E1D3] dark:bg-white/10" />
                </div>
              </>
            )}

            {/* Email / Password Form */}
            {mode === "login" && (
              <form onSubmit={handleEmailLogin} className="space-y-3.5">
                <div className="space-y-1">
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-bold text-[#1B4332] dark:text-[#EEF8F2]"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="engineer@skillsphere.ai"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white placeholder-[#809789] transition-all"
                    />
                    <Mail className="w-4 h-4 text-[#809789] group-focus-within:text-[#1B4332] dark:group-focus-within:text-[#52B788] absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-bold text-[#1B4332] dark:text-[#EEF8F2]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[11px] font-bold text-[#2D6A4F] dark:text-[#52B788] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white placeholder-[#809789] transition-all"
                    />
                    <Lock className="w-4 h-4 text-[#809789] group-focus-within:text-[#1B4332] dark:group-focus-within:text-[#52B788] absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#809789] hover:text-[#13291E] dark:hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-lg shadow-[#1B4332]/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Authenticating with Firebase…</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to SkillSphere OS</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Registration Form */}
            {mode === "register" && (
              <form onSubmit={handleEmailRegister} className="space-y-3.5">
                <div className="space-y-1">
                  <label
                    htmlFor="reg-name"
                    className="block text-xs font-bold text-[#1B4332] dark:text-[#EEF8F2]"
                  >
                    Full Name
                  </label>
                  <div className="relative group">
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Arya Patel"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white placeholder-[#809789] transition-all"
                    />
                    <User className="w-4 h-4 text-[#809789] group-focus-within:text-[#1B4332] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-bold text-[#1B4332] dark:text-[#EEF8F2]"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arya@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white placeholder-[#809789] transition-all"
                    />
                    <Mail className="w-4 h-4 text-[#809789] group-focus-within:text-[#1B4332] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="reg-target"
                    className="block text-xs font-bold text-[#1B4332] dark:text-[#EEF8F2]"
                  >
                    Target Career Path
                  </label>
                  <div className="relative group">
                    <select
                      id="reg-target"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white transition-all"
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

                <div className="space-y-1">
                  <label
                    htmlFor="reg-pass"
                    className="block text-xs font-bold text-[#1B4332] dark:text-[#EEF8F2]"
                  >
                    Create Password
                  </label>
                  <div className="relative group">
                    <input
                      id="reg-pass"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white placeholder-[#809789] transition-all"
                    />
                    <Lock className="w-4 h-4 text-[#809789] group-focus-within:text-[#1B4332] absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#809789] hover:text-[#13291E] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-lg shadow-[#1B4332]/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Creating Firebase Account…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Create Account &amp; Start</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Forgot Password Form */}
            {mode === "forgot" && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-1">
                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-bold text-[#1B4332] dark:text-[#EEF8F2]"
                  >
                    Registered Email Address
                  </label>
                  <div className="relative group">
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="engineer@skillsphere.ai"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white placeholder-[#809789] transition-all"
                    />
                    <Mail className="w-4 h-4 text-[#809789] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>Sending Reset Link…</span>
                  ) : (
                    <span>Send Password Reset Link</span>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-xs font-bold text-[#2D6A4F] dark:text-[#52B788] hover:underline"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Instant Access Demo Options */}
            <div className="pt-2">
              <div className="relative flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-[#E7E1D3] dark:bg-white/10" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#526E60] dark:text-[#94A3B8]">
                  ⚡ 1-Click Evaluation Access
                </span>
                <div className="flex-1 h-px bg-[#E7E1D3] dark:bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="quick-student-login"
                  onClick={() => handleDemoAccess("student")}
                  disabled={!!demoRoleLoading || submitting}
                  className="group relative flex flex-col items-center gap-2 p-3 rounded-2xl border border-[#E7E1D3] dark:border-white/10 bg-[#FFFDF9] dark:bg-white/5 hover:border-[#52B788] hover:bg-[#D8F3DC]/40 transition-all text-center disabled:opacity-60"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] dark:bg-[#1B4332]/60 flex items-center justify-center text-[#1B4332] dark:text-[#52B788] group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#13291E] dark:text-white">Student</p>
                    <p className="text-[10px] text-[#526E60] dark:text-[#94A3B8]">Full Learner Suite</p>
                  </div>
                  {demoRoleLoading === "student" ? (
                    <div className="w-3 h-3 rounded-full border-2 border-[#1B4332] border-t-transparent animate-spin dark:border-[#52B788]" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-[#52B788] opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>

                <button
                  type="button"
                  id="quick-admin-login"
                  onClick={() => handleDemoAccess("admin")}
                  disabled={!!demoRoleLoading || submitting}
                  className="group relative flex flex-col items-center gap-2 p-3 rounded-2xl border border-[#E7E1D3] dark:border-white/10 bg-[#FFFDF9] dark:bg-white/5 hover:border-[#52B788] hover:bg-[#D8F3DC]/40 transition-all text-center disabled:opacity-60"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] dark:bg-[#1B4332]/60 flex items-center justify-center text-[#1B4332] dark:text-[#52B788] group-hover:scale-110 transition-transform">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#13291E] dark:text-white">Admin</p>
                    <p className="text-[10px] text-[#526E60] dark:text-[#94A3B8]">Control Oversight</p>
                  </div>
                  {demoRoleLoading === "admin" ? (
                    <div className="w-3 h-3 rounded-full border-2 border-[#1B4332] border-t-transparent animate-spin dark:border-[#52B788]" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-[#52B788] opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              </div>
            </div>

            {/* Link to Platform Overview Tour */}
            <div className="pt-2 text-center border-t border-[#E7E1D3] dark:border-white/10">
              <Link
                href="/overview"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] dark:text-[#52B788] hover:underline"
              >
                <span>Take a Tour of All SkillSphere AI Features</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Security / Environment Notice */}
        <p className="text-center text-[11px] text-[#526E60] dark:text-[#94A3B8] mt-4 flex items-center justify-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
          <span>
            {isFirebaseLive
              ? "Connected to Live Firebase Authentication"
              : "Safe Localhost Mode Active • Firebase Auth Supported"}
          </span>
        </p>
      </div>

      <style jsx>{`
        @keyframes float-orb-1 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(25px, 20px) scale(1.06);
          }
        }
        @keyframes float-orb-2 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(-25px, -15px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
