import { QuestionState, WrittenQuestion } from "@/types";

export default function calcWrittenResult(answers: {
  tapes: Map<number, QuestionState>;
  subQuestions: Map<number, QuestionState>;
}) {
  let total = answers.tapes.size + answers.subQuestions.size;
  let correct = 0;
  answers.tapes.forEach((value) => value === QuestionState.TRUE && correct++);
  answers.subQuestions.forEach(
    (value) => value === QuestionState.TRUE && correct++
  );
  return { correct, total };
}
