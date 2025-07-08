import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { DatabaseTable } from "@/types";

export default function useQuestions<T, U extends DatabaseTable>(
  questions: U[],
  localStorageItem: string,
  answers: T,
  serializeAnswers: (answers: T) => any,
  onLoad: (storedAnswers?: any) => void,
  randomOrder: boolean
) {
  const [orderedQuestions, setOrderedQuestions] = useState([...questions]);
  const [currentQuestion, setCurrentQuestion] = useState(
    orderedQuestions[0].id
  );
  const [showingResults, setShowingResults] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
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
  const resetState = useCallback(() => {
    setShowingResults(false);
    let newCurrentQuestion;
    if (randomOrder) {
      const newOrderedQuestions = orderedQuestions.toSorted(
        () => Math.random() - 0.5
      );
      newCurrentQuestion = newOrderedQuestions[0].id;
      setOrderedQuestions(newOrderedQuestions);
    } else {
      newCurrentQuestion = orderedQuestions[0].id;
    }
    setCurrentQuestion(newCurrentQuestion);
  }, []);
  useHotkeys("left", backQuestion, [backQuestion]);
  useHotkeys("right", nextQuestion, [nextQuestion]);

  useEffect(() => {
    const quizJSON = localStorage.getItem(localStorageItem);
    if (quizJSON) {
      const quiz = JSON.parse(quizJSON);
      if (orderedQuestions.find(({ id }) => id === quiz.currentQuestion))
        setCurrentQuestion(quiz.currentQuestion);
      else
        setCurrentQuestion(
          quiz.currentIndex < orderedQuestions.length
            ? orderedQuestions[quiz.currentIndex].id
            : orderedQuestions[orderedQuestions.length - 1].id
        );
      if (randomOrder) {
        setOrderedQuestions((prev) => {
          if (quiz.questionsOrder) {
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
                if (!temp.find(({ id }) => id === prev[i].id))
                  temp.push(prev[i]);
            return temp;
          } else {
            return prev.toSorted(() => Math.random() - 0.5);
          }
        });
      }
      setShowingResults(quiz.showingResults);
      onLoad(quiz.answers);
    } else {
      if (randomOrder) {
        let newOrderedQuestions = orderedQuestions.toSorted(
          () => Math.random() - 0.5
        );
        setOrderedQuestions(newOrderedQuestions);
        setCurrentQuestion(newOrderedQuestions[0].id);
      }
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
          questionsOrder: orderedQuestions.map(({ id }) => id),
        })
      );
  }, [currentQuestion, answers, showingResults, orderedQuestions]);

  return {
    orderedQuestions,
    currentQuestion,
    setCurrentQuestion,
    currentIndex,
    backQuestion,
    nextQuestion,
    showingResults,
    setShowingResults,
    isLoaded,
    resetState,
  };
}
