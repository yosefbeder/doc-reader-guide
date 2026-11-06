"use client";

import QuickAddQuestionsForm from "@/components/QuickAddQuestionsForm";
import { quickAdd } from "@/lib/actions/mcqQuizzes";

export default function QuickAddForm({ quizId }: { quizId: number }) {
  return <QuickAddQuestionsForm quizId={quizId} kind="mcq" action={quickAdd} />;
}
