import { Action, Resource, WrittenQuestion, WrittenQuiz } from "@/types";
import { logEvent } from "@/lib/event-logger";

export const shareQuestion = async (
  quiz: WrittenQuiz,
  question: WrittenQuestion,
  page: "question" | "summary"
) => {
  logEvent(Resource.WRITTEN_QUESTION, question.id, Action.SHARE_QUESTION, {
    page,
  });
  const url = new URL(`${window.location.origin}/written-quizzes/${quiz.id}`);
  url.searchParams.set("questionId", question.id.toString());

  const subQuestionsText = question.subQuestions
    .map(
      (sq, i) =>
        `${question.subQuestions.length > 1 ? `${i + 1}. ` : ""}${sq.text}`
    )
    .join("\n");

  const text = `${subQuestionsText}\nSolve at: ${url.toString()}`;

  const shareData: ShareData = {
    title: quiz.title,
    text,
  };

  if (question.image) {
    try {
      const response = await fetch(`/api/image-proxy?name=${question.image}`);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });
      if (
        navigator.canShare &&
        navigator.canShare({ ...shareData, files: [file] })
      ) {
        shareData.files = [file];
      }
    } catch (error) {
      console.error("Error fetching image for share:", error);
    }
  }

  if (navigator.share) {
    await navigator.share(shareData);
  }
};
