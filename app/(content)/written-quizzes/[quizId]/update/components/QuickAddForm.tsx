"use client";

import QuickAddQuestionsForm from "@/components/QuickAddQuestionsForm";
import { quickAdd } from "@/lib/actions/writtenQuizzes";

export default function QuickAddForm({ quizId }: { quizId: number }) {
  return <QuickAddQuestionsForm quizId={quizId} kind="written" action={quickAdd} />;
}
