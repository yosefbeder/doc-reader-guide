import { McqQuestion } from "@/types";

export default function calcMcqResult(
  questions: McqQuestion[],
  answers: Map<number, number>
) {
  const correct = Array.from(answers.entries()).reduce(
    (acc, [questionId, optionIndex]) =>
      optionIndex ===
      questions.find(({ id }) => id === questionId)?.correctOptionIndex
        ? acc + 1
        : acc,
    0
  );
  return { correct, total: questions.length };
}
