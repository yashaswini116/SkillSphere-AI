"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AiMentorDrawer } from "@/components/mentor/AiMentorDrawer";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Bot } from "lucide-react";
import { playAudioFeedback } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mentorOpen, setMentorOpen] = useState(false);
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-[#FBF9F4] dark:bg-[#091610] text-[#13291E] dark:text-[#EEF8F2]">
        {/* Sidebar Navigation */}
        <Sidebar onOpenMentor={() => setMentorOpen(true)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FBF9F4]/60 dark:bg-[#091610]/80">
          <div className="max-w-7xl w-full mx-auto space-y-6">
            {children}
          </div>
        </div>

        {/* Floating AI Mentor Drawer Modal */}
        <AiMentorDrawer isOpen={mentorOpen} onClose={() => setMentorOpen(false)} />

        {/* Floating Trigger Button (Bottom Right in Green + Cream palette) */}
        {!mentorOpen && (
          <button
            onClick={() => {
              playAudioFeedback("click");
              setMentorOpen(true);
            }}
            title="Open SkillSphere AI Mentor (24/7)"
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#52B788] hover:from-[#143326] hover:to-[#1B4332] text-white font-bold text-xs shadow-xl shadow-[#1B4332]/30 hover:scale-105 transition-all border border-white/20"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#95D5B2] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Mentor</span>
          </button>
        )}
      </div>
    </ProtectedRoute>
  );
}
