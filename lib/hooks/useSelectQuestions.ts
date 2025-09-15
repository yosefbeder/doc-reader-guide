import { useState } from "react";
import { useRouter } from "next/navigation";

import { McqQuestion, QuizType, WrittenQuestion } from "@/types";
import cleanMcqQuestion from "@/utils/cleanMcqQuestion";
import cleanWrittenQuestion from "@/utils/cleanWrittenQuestion";
import revalidate from "@/utils/revalidate";

type UseSelectQuestionsProps = {
  type: QuizType;
  quizId: number;
  questions: McqQuestion[] | WrittenQuestion[];
};

export function useSelectQuestions({
  type,
  quizId,
  questions,
}: UseSelectQuestionsProps) {
  const router = useRouter();
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCheckbox = (id: number, checked: boolean) => {
    setSelectedQuestions((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleCopy = async () => {
    try {
      const selectedQuestionsData =
        type === "mcq"
          ? (questions as McqQuestion[])
              .filter((q) => selectedQuestions.includes(q.id))
              .map((q) => cleanMcqQuestion(q))
          : (questions as WrittenQuestion[])
              .filter((q) => selectedQuestions.includes(q.id))
              .map((q) => cleanWrittenQuestion(q));
      await navigator.clipboard.writeText(
        JSON.stringify(selectedQuestionsData)
      );
      alert("Copied to clipboard!");
    } catch (error) {
      alert("Failed to copy to clipboard: " + error);
    } finally {
      setSelectedQuestions([]);
    }
  };

  const handleDelete = async () => {
    const confirmationText = `DELETE ${selectedQuestions.length} QUESTIONS`;
    const input = prompt(`Enter ${confirmationText} to confirm deletion`);
    if (input !== confirmationText) {
      alert("Deletion cancelled");
      return;
    }
    setIsDeleting(true);
    const results = await Promise.allSettled(
      selectedQuestions.map(async (questionId) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/${type}-questions/${questionId}`,
          {
            method: "DELETE",
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error(`Question ${questionId}`);
      })
    );
    await Promise.all([
      revalidate(`/${type}-quizzes/${quizId}`),
      revalidate(`/${type}-quizzes/${quizId}/update`),
    ]);
    setIsDeleting(false);
    setSelectedQuestions([]);
    let success = results.filter((r) => r.status === "fulfilled").length;
    let fail = results.length - success;
    let errors = results
      .filter((r) => r.status === "rejected")
      .map((r) => (r as PromiseRejectedResult).reason);
    let message = `Deleted: ${success}/${results.length}`;
    if (fail > 0) message += `\nFailed: ${fail}\nErrors:\n${errors.join("\n")}`;
    alert(message);
    router.refresh();
  };

  const allSelected = selectedQuestions.length === questions.length;
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(questions.map((q) => q.id));
    }
  };

  return {
    selectedQuestions,
    isDeleting,
    handleCheckbox,
    handleCopy,
    handleDelete,
    allSelected,
    handleSelectAll,
  };
}
