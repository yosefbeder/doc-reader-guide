"use client";

import React from "react";
import { useReactToPrint } from "react-to-print";
import ButtonIcon from "@/components/ButtonIcon";
import Logo from "@/components/Logo";
import FilterButton from "@/components/FilterButton";
import ResultPieChart from "@/components/ResultPieChart";
import QuizHistory from "@/components/QuizHistory";
import { logEvent } from "@/lib/event-logger";
import { Action, Resource } from "@/types";
import { Attempt } from "@/lib/hooks/useQuizHistory";

interface FilterOption<T> {
  label: string;
  value: T;
  color: "gray" | "green" | "red" | "yellow";
}

interface QuizSummaryLayoutProps<T> {
  quiz: { id: number; title: string };
  resource: Resource;
  resetState: () => void;
  history: {
    attempts: Attempt[];
    selectedAttemptIndex: number;
    onSelectAttempt: (index: number) => void;
  };
  stats: {
    correct: number;
    incorrect: number;
    skipped: number;
    total: number;
    stopwatch?: number;
  };
  filter: T;
  onFilterChange: (filter: T) => void;
  filterOptions: FilterOption<T>[];
  children: React.ReactNode;
}

export default function QuizSummaryLayout<T>({
  quiz,
  resource,
  resetState,
  history,
  stats,
  filter,
  onFilterChange,
  filterOptions,
  children,
}: QuizSummaryLayoutProps<T>) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: quiz.title,
    fonts: [
      {
        family: "Inter",
        source:
          "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
      },
    ],
    preserveAfterPrint: true,
  });

  return (
    <main className="quiz-main mx-auto">
      <div className="flex gap-2 mb-4">
        <ButtonIcon
          icon="printer"
          onClick={() => {
            logEvent(resource, quiz.id, Action.PRINT_SUMMARY, {});
            reactToPrintFn();
          }}
        />
        <ButtonIcon
          icon="arrow-path"
          onClick={() => {
            logEvent(resource, quiz.id, Action.RESTART_QUIZ, {});
            resetState();
          }}
        />
      </div>

      {/* Show graph ONLY if there is more than 1 attempt */}
      {history.attempts.length > 1 && (
        <QuizHistory
          attempts={history.attempts}
          selectedAttemptIndex={history.selectedAttemptIndex}
          onSelectAttempt={history.onSelectAttempt}
        />
      )}

      <div className="max-w-2xl print-section" ref={contentRef}>
        <div className="print-only">
          <Logo />
        </div>
        <h1 className="h1 my-4 print-only">{quiz.title}</h1>

        <div className="my-4">
          <ResultPieChart
            correct={stats.correct}
            skipped={stats.skipped}
            incorrect={stats.incorrect}
            total={stats.total}
          />
        </div>

        {stats.stopwatch !== undefined && (
          <div className="caption my-4">
            Time: {Math.floor(stats.stopwatch / 60)}:
            {(stats.stopwatch % 60).toString().padStart(2, "0")}
          </div>
        )}

        <div className="flex flex-wrap gap-2 my-4">
          {filterOptions.map((option, index) => (
            <FilterButton
              key={index}
              onClick={() => onFilterChange(option.value)}
              active={filter === option.value}
              color={option.color}
            >
              {option.label}
            </FilterButton>
          ))}
        </div>

        {children}
      </div>
    </main>
  );
}
