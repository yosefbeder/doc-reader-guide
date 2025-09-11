import { WrittenQuestion } from "@/types";

export default function cleanWrittenQuestion(question: WrittenQuestion) {
  return {
    image: question.image,
    width: question.width,
    height: question.height,
    masks: question.masks.map(
      ({
        id,
        creatorId,
        createdAt,
        updatedAt,
        tapeQuestionId,
        maskQuestionId,
        ...rest
      }) => ({
        ...rest,
      })
    ),
    tapes: question.tapes.map(
      ({
        id,
        creatorId,
        createdAt,
        updatedAt,
        maskQuestionId,
        tapeQuestionId,
        ...rest
      }) => ({
        ...rest,
      })
    ),
    subQuestions: question.subQuestions.map(
      ({ id, creatorId, createdAt, updatedAt, questionId, ...rest }) => ({
        ...rest,
      })
    ),
  };
}
