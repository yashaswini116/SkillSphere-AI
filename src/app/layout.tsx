import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "SkillSphere AI – Your Autonomous AI Career & Learning OS",
  description:
    "Production-ready AI Career & Learning Operating System. Featuring AI Skill-Gap Analysis, ATS Resume Optimizer, RAG Study Assistant, Interactive AI Roadmaps, Mock Interviews, and Coding Sandbox in a refined Green & Cream aesthetic.",
  keywords: [
    "SkillSphere AI",
    "AI Career OS",
    "Skill Gap Analyzer",
    "AI Resume ATS",
    "RAG Study Assistant",
    "Next.js AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-[#1B4332] selection:text-white min-h-screen flex flex-col bg-[#FBF9F4] dark:bg-[#091610] text-[#13291E] dark:text-[#EEF8F2] transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
