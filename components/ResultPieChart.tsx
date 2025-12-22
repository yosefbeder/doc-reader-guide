"use client";

import React from "react";

interface ResultPieChartProps {
  correct: number;
  skipped: number;
  incorrect: number;
  total: number;
}

export default function ResultPieChart({
  correct,
  skipped,
  incorrect,
  total,
}: ResultPieChartProps) {
  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const correctPct = correct / total || 0;
  const skippedPct = skipped / total || 0;
  const incorrectPct = incorrect / total || 0;

  const correctDash = correctPct * circumference;
  const skippedDash = skippedPct * circumference;
  const incorrectDash = incorrectPct * circumference;

  return (
    <div className="flex flex-col">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800/50"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#84cc16"
            strokeWidth={strokeWidth}
            strokeDasharray={`${correctDash} ${circumference}`}
            className="transition-all duration-1000 ease-out"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#eab308"
            strokeWidth={strokeWidth}
            strokeDasharray={`${skippedDash} ${circumference}`}
            strokeDashoffset={-correctDash}
            className="transition-all duration-1000 ease-out"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            strokeDasharray={`${incorrectDash} ${circumference}`}
            strokeDashoffset={-(correctDash + skippedDash)}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">
            {Math.round((correct / total) * 1000) / 10}%
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            {correct} / {total}
          </span>
        </div>
      </div>
    </div>
  );
}
