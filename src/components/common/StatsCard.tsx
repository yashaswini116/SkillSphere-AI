import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  subtitle?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = "positive",
  icon,
  subtitle,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white dark:bg-[#0E2018] border border-[#E7E1D3] dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-[#52B788]/50 hover:shadow-md transition-all ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-[#526E60] dark:text-[#94A3B8] uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold mt-1 text-[#13291E] dark:text-white">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#6C8677] dark:text-[#94A3B8] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-[#D8F3DC] text-[#1B4332] dark:bg-[#1B4332]/60 dark:text-[#52B788] border border-[#74C69D]/30 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>

      {change && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={`font-bold ${
              changeType === "positive"
                ? "text-[#2D6A4F] dark:text-[#52B788]"
                : changeType === "negative"
                ? "text-rose-500"
                : "text-[#6C8677]"
            }`}
          >
            {change}
          </span>
          <span className="text-[#6C8677] dark:text-[#94A3B8]">vs last week</span>
        </div>
      )}

      {/* Subtle ambient accent glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#52B788]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
