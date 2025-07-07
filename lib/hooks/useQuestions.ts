import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { DatabaseTable } from "@/types";

export default function useQuestions<T>(
  questions: DatabaseTable[],
  localStorageItem: string,
  answers: T,
  serializeAnswers: (answers: T) => string,
  onLoad: (storedAnswers?: any) => void
) {
  const [currentQuestion, setCurrentQuestion] = useState(questions[0].id);
  const [showingResults, setShowingResults] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentIndex = questions.findIndex(({ id }) => id === currentQuestion);
  const backQuestion = useCallback(() => {
    if (currentIndex !== 0)
      setCurrentQuestion(() => questions[currentIndex - 1].id);
  }, [currentIndex, questions]);
  const nextQuestion = useCallback(() => {
    if (currentIndex !== questions.length - 1)
      setCurrentQuestion(() => questions[currentIndex + 1].id);
  }, [currentIndex, questions]);
  useHotkeys("left", backQuestion, [currentIndex, questions]);
  useHotkeys("right", nextQuestion, [currentIndex, questions]);

  useEffect(() => {
    const quizJSON = localStorage.getItem(localStorageItem);
    if (quizJSON) {
      const quiz = JSON.parse(quizJSON);
      if (questions.find(({ id }) => id === quiz.currentQuestion))
        setCurrentQuestion(quiz.currentQuestion);
      else
        setCurrentQuestion(
          quiz.currentIndex < questions.length
            ? questions[quiz.currentIndex].id
            : questions[questions.length - 1].id
        );
      setShowingResults(quiz.showingResults);
      onLoad(quiz.answers);
    } else {
      onLoad();
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded)
      localStorage.setItem(
        localStorageItem,
        JSON.stringify({
          currentQuestion,
          currentIndex,
          answers: serializeAnswers(answers),
          showingResults,
        })
      );
  }, [currentQuestion, answers, showingResults]);

  return {
    currentQuestion,
    setCurrentQuestion,
    currentIndex,
    backQuestion,
    nextQuestion,
    showingResults,
    setShowingResults,
    isLoaded,
  };
}
