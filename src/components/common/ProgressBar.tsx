import React from "react";

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: "indigo" | "emerald" | "amber" | "cyan" | "rose" | "forest";
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = true,
  color = "forest",
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorMap = {
    forest: "from-[#1B4332] via-[#2D6A4F] to-[#52B788]",
    indigo: "from-[#1B4332] via-[#2D6A4F] to-[#52B788]",
    emerald: "from-[#2D6A4F] to-[#52B788]",
    amber: "from-amber-600 to-amber-400",
    cyan: "from-[#52B788] to-[#95D5B2]",
    rose: "from-rose-600 to-rose-400",
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-bold text-[#13291E] dark:text-[#CBD5E1]">
          {label && <span>{label}</span>}
          {showPercent && (
            <span className="font-extrabold text-[#2D6A4F] dark:text-[#74C69D]">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="h-2.5 w-full bg-[#E7E1D3] dark:bg-black/40 rounded-full overflow-hidden p-0.5 border border-[#DFD3BA] dark:border-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
