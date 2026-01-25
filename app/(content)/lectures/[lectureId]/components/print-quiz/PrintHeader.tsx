"use client";

import React from "react";
import Logo from "@/components/Logo";
import { QuizType } from "@/types";

export default function PrintHeader({
  title,
  printMode,
  quizId,
  type,
}: {
  title: string;
  printMode: "booklet-with-answers" | "booklet-without-answers" | "study";
  quizId: number;
  type: QuizType;
}) {
  return (
    <>
      <Logo />
      <h1 className="h1 my-4">{title}</h1>
      {printMode === "study" && (
        <p className="caption my-4">
          Disclaimer: This quiz was printed on {new Date().toLocaleString()}.
          Answers may have changed since then.
        </p>
      )}
      <p>
        Solve it online at:{" "}
        <a
          className="link"
          href={`${window.location.origin}/${type}-quizzes/${quizId}`}
          target="_blank"
        >
          {window.location.origin}/{type}-quizzes/{quizId}
        </a>
      </p>
    </>
  );
}
