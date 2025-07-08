import { DatabaseTable } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function useQuestionsDashboard<T extends DatabaseTable>(
  questions: T[],
  localStorageItem: string,
  randomOrder: boolean
) {
  const [orderedQuestions, setOrderedQuestions] = useState([...questions]);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>();
  const currentIndex = orderedQuestions.findIndex(
    ({ id }) => id === currentQuestion
  );
  const backQuestion = useCallback(() => {
    if (currentIndex !== 0)
      setCurrentQuestion(() => orderedQuestions[currentIndex - 1].id);
  }, [currentIndex, orderedQuestions]);
  const nextQuestion = useCallback(() => {
    if (currentIndex !== orderedQuestions.length - 1)
      setCurrentQuestion(() => orderedQuestions[currentIndex + 1].id);
  }, [currentIndex, orderedQuestions]);
  useHotkeys("left", backQuestion, [backQuestion]);
  useHotkeys("right", nextQuestion, [nextQuestion]);

  useEffect(() => {
    const quizJSON = localStorage.getItem(localStorageItem);
    if (quizJSON) {
      const quiz = JSON.parse(quizJSON);
      if (quiz.currentQuestion) {
        setCurrentQuestion(quiz.currentQuestion);
      }
      if (randomOrder && quiz.questionsOrder) {
        setOrderedQuestions((prev) => {
          const temp = [];
          for (let i = 0; i < quiz.questionsOrder.length; i++) {
            const question = prev.find(
              ({ id }) => id === quiz.questionsOrder[i]
            );
            if (question) {
              temp.push(question);
            }
          }
          if (temp.length !== prev.length)
            for (let i = 0; i < prev.length; i++)
              if (!temp.find(({ id }) => id === prev[i].id)) temp.push(prev[i]);
          return temp;
        });
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
    orderedQuestions,
    questionsOpen,
    setQuestionsOpen,
    currentQuestion,
    setCurrentQuestion,
  };
}
