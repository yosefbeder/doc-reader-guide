import { DatabaseTable } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function useQuestionsDashboard(
  questions: DatabaseTable[],
  localStorageItem: string
) {
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>();
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
      const quizData = JSON.parse(quizJSON);
      if (quizData.currentQuestion) {
        setCurrentQuestion(quizData.currentQuestion);
      }
    }
  }, []);

  useEffect(() => {
    const questionElement = document.getElementById(
      `question-${currentQuestion}`
    );
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentQuestion]);

  return {
    questionsOpen,
    setQuestionsOpen,
    currentQuestion,
    setCurrentQuestion,
  };
}
