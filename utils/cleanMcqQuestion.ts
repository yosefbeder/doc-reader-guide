import { McqQuestion } from "@/types";

export default function cleanMcqQuestion({
  id,
  createdAt,
  updatedAt,
  creatorId,
  quizId,
  image,
  explanation,
  ...rest
}: McqQuestion) {
  return {
    image: image || undefined,
    explanation: explanation || undefined,
    ...rest,
  };
}
