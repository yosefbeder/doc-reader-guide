import { useEffect, useState, useMemo } from "react";

interface HistoryItem {
  answers: any;
  stopwatch?: number;
  archivedAt: number | null;
  completedAt: number | null;
}

export interface Attempt {
  id: string;
  date: Date;
  stopwatch?: number;
  answers: any;
  correct: number;
  incorrect: number;
  skipped: number;
  total: number;
}

export function useQuizHistory<T>(
  quizId: number,
  type: "mcq" | "written",
  currentAnswers: T,
  currentStopwatch: number | undefined,
  calcResult: (answers: T) => {
    correct: number;
    incorrect: number;
    skipped: number;
    total: number;
  },
  deserializeAnswers: (data: any) => T
) {
  const localStorageItem = `${type}-quiz-${quizId}`;
  const historyKey = `${localStorageItem}-history`;
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    try {
      const rawHistory = localStorage.getItem(historyKey);
      if (rawHistory) {
        setHistoryData(JSON.parse(rawHistory));
      }
    } catch (e) {
      console.error("Failed to load quiz history", e);
    }
  }, [historyKey]);

  const attempts: Attempt[] = useMemo(() => {
    const historicalAttempts = historyData.map((item, index) => {
      const answers = deserializeAnswers(item.answers);
      const stats = calcResult(answers);

      return {
        id: `history-${index}`,
        date: new Date(item.archivedAt || item.completedAt || Date.now()),
        stopwatch: item.stopwatch,
        answers,
        ...stats,
      };
    });

    return historicalAttempts;
  }, [historyData, deserializeAnswers, calcResult]);

  const allAttempts = useMemo(() => {
    const currentStats = calcResult(currentAnswers);
    const currentAttempt: Attempt = {
      id: "current",
      date: new Date(),
      stopwatch: currentStopwatch,
      answers: currentAnswers,
      ...currentStats,
    };

    return [...attempts, currentAttempt];
  }, [attempts, currentAnswers, currentStopwatch, calcResult]);

  return {
    allAttempts,
    selectedAttemptIndex:
      selectedAttemptIndex === null
        ? allAttempts.length - 1
        : selectedAttemptIndex,
    setSelectedAttemptIndex,
    selectedAttempt:
      selectedAttemptIndex === null
        ? allAttempts[allAttempts.length - 1]
        : allAttempts[selectedAttemptIndex],
  };
}
