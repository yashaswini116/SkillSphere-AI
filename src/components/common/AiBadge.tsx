import React from "react";
import { Sparkles, Bot } from "lucide-react";

interface AiBadgeProps {
  isDemo?: boolean;
  modelName?: string;
  className?: string;
}

export const AiBadge: React.FC<AiBadgeProps> = ({
  isDemo = false,
  modelName,
  className = "",
}) => {
  if (isDemo) {
    return (
      <span
        title="Running on realistic simulated engine. Provide a Gemini API key in Settings for live inference."
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <Bot className="w-3.5 h-3.5" />
        <span>{modelName || "Demo Engine"}</span>
      </span>
    );
  }

  return (
    <span
      title="Powered by live Google Gemini AI with realtime context analysis."
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
      <span>{modelName || "Live Gemini 1.5 Flash"}</span>
    </span>
  );
};
