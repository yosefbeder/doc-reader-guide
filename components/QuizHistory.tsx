import React, { useMemo, useState } from "react";
import { Attempt } from "@/lib/hooks/useQuizHistory";

interface QuizHistoryProps {
  attempts: Attempt[];
  selectedAttemptIndex: number;
  onSelectAttempt: (index: number) => void;
}

export default function QuizHistory({
  attempts,
  selectedAttemptIndex,
  onSelectAttempt,
}: QuizHistoryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = useMemo(() => {
    return attempts.map((attempt) => {
      const total = attempt.total || 1;
      const score = Math.round((attempt.correct / total) * 100);
      return { ...attempt, score };
    });
  }, [attempts]);

  if (attempts.length === 0) return null;

  // Chart dimensions
  const height = 150;
  const paddingX = 30;
  const paddingY = 20;
  const widthPerPoint = 50;
  // Ensure we have at least enough width for a few points, or stretch if few
  const minWidth = 300;
  const computedWidth = Math.max(
    minWidth,
    (attempts.length - 1) * widthPerPoint + paddingX * 2
  );

  // Coordinate calculations
  const getX = (index: number) => {
    if (attempts.length <= 1) return computedWidth / 2;
    const availableWidth = computedWidth - paddingX * 2;
    return paddingX + (index / (attempts.length - 1)) * availableWidth;
  };

  const getY = (score: number) => {
    const availableHeight = height - paddingY * 2;
    return height - paddingY - (score / 100) * availableHeight;
  };

  const points = data.map((d, i) => `${getX(i)},${getY(d.score)}`).join(" ");

  return (
    <div className="my-4 space-y-4 rounded-xl p-4 layer-1 w-min">
      <h2>Quiz Attempts</h2>
      <div>
        <div style={{ width: computedWidth, height }}>
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${computedWidth} ${height}`}
            className="overflow-visible"
          >
            {/* Grid Lines (0%, 50%, 100%) */}
            {[0, 25, 50, 75, 100].map((tick) => (
              <g key={tick}>
                <line
                  x1={paddingX}
                  y1={getY(tick)}
                  x2={computedWidth - paddingY}
                  y2={getY(tick)}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  className="text-gray-500"
                />
                {/* Only show label on the left */}
                <text
                  x={0}
                  y={getY(tick) + 4}
                  className="text-[10px] fill-gray-400"
                  textAnchor="start"
                >
                  {tick}%
                </text>
              </g>
            ))}

            {/* Connecting Line */}
            {attempts.length > 1 && (
              <polyline
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-cyan-500 dark:text-cyan-400"
              />
            )}

            {/* Points */}
            {data.map((d, i) => {
              const x = getX(i);
              const y = getY(d.score);
              const isSelected = i === selectedAttemptIndex;
              const isHovered = i === hoveredIndex;

              return (
                <g
                  key={d.id}
                  onClick={() => onSelectAttempt(i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Invisible larger hit area */}
                  <circle cx={x} cy={y} r={15} fill="transparent" />

                  {/* Visible Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 6 : 4}
                    className={`${
                      isSelected
                        ? "fill-cyan-600 dark:fill-cyan-400 stroke-2 stroke-white dark:stroke-slate-900"
                        : "fill-cyan-400 dark:fill-cyan-600 opacity-70 hover:opacity-100"
                    } transition-all`}
                  />

                  {/* Tooltip / Label */}
                  {(isSelected || isHovered) && (
                    <g
                      transform={`translate(${x}, ${y - 15})`}
                      pointerEvents="none"
                    >
                      <rect
                        x="-35"
                        y="-36"
                        width="70"
                        height="30"
                        rx="4"
                        className="fill-slate-800 dark:fill-slate-100 opacity-90"
                      />
                      {/* Triangle */}
                      <path
                        d="M -5 -6 L 5 -6 L 0 0 Z"
                        className="fill-slate-800 dark:fill-slate-100 opacity-90"
                      />

                      <text
                        y="-22"
                        textAnchor="middle"
                        className="text-[10px] fill-white dark:fill-slate-900 font-bold"
                      >
                        {d.score}% ({d.correct}/{d.total})
                      </text>
                      {d.stopwatch && (
                        <text
                          y="-10"
                          textAnchor="middle"
                          className="text-[8px] fill-gray-300 dark:fill-slate-600"
                        >
                          Time: {Math.floor(d.stopwatch / 60)}:
                          {(d.stopwatch % 60).toString().padStart(2, "0")}
                        </text>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
