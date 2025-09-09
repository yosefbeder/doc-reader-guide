import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Action, DatabaseTable, Quiz, Resource } from "@/types";
import { logEvent } from "../event-logger";

export interface Options<T, U extends DatabaseTable> {
  type: "mcq" | "written";
  quiz: Quiz;
  questions: U[];
  localStorageItem: string;
  answers: T;
  serializeAnswers: (answers: T) => any;
  onLoad: (storedAnswers?: any) => void;
  randomOrder: boolean;
}

export default function useQuestions<T, U extends DatabaseTable>({
  options: {
    type,
    quiz,
    questions,
    localStorageItem,
    answers,
    serializeAnswers,
    onLoad,
    randomOrder,
  },
}: {
  options: Options<T, U>;
}) {
  const resource = type === "mcq" ? Resource.MCQ_QUIZ : Resource.WRITTEN_QUIZ;
  const [orderedQuestions, setOrderedQuestions] = useState([...questions]);
  const [currentQuestion, setCurrentQuestion] = useState(
    orderedQuestions[0].id
  );
  const [showingResults, setShowingResults] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentIndex = orderedQuestions.findIndex(
    ({ id }) => id === currentQuestion
  );
  const goToQuestion = (id: number) => {
    setCurrentQuestion(id);
    logEvent(resource, quiz.id, Action.GO_TO_QUESTION, { id });
  };
  const backQuestion = useCallback(() => {
    if (currentIndex !== 0) goToQuestion(orderedQuestions[currentIndex - 1].id);
  }, [currentIndex, orderedQuestions]);
  const nextQuestion = useCallback(() => {
    if (currentIndex !== orderedQuestions.length - 1)
      goToQuestion(orderedQuestions[currentIndex + 1].id);
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
  }, [randomOrder]);
  const endQuiz = useCallback(() => {
    logEvent(resource, quiz.id, Action.END_QUIZ);
    setShowingResults(true);
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
            // Check if temp order is the same as questions
            // This solves when user changes settings.shuffle from `false` to `true` for an already started quiz
            let sameOrder = true;
            for (let i = 0; i < temp.length; i++)
              if (temp[i].id !== questions[i].id) {
                sameOrder = false;
                break;
              }
            return sameOrder ? temp.toSorted(() => Math.random() - 0.5) : temp;
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
  }, [randomOrder]);

  useEffect(() => {
    if (isLoaded)
      localStorage.setItem(
        localStorageItem,
        JSON.stringify({
          quiz,
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
    goToQuestion,
    currentIndex,
    backQuestion,
    nextQuestion,
    showingResults,
    endQuiz,
    isLoaded,
    resetState,
  };
}
