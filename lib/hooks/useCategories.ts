import { useMemo, useState } from "react";

import { Link, WrittenQuiz, McqQuiz } from "@/types";

export default function useCategories(
  links: Link[],
  mcqQuizzes: McqQuiz[],
  writtenQuizzes: WrittenQuiz[]
) {
  const categories = useMemo(() => {
    const temp = [];
    if (links.find((link) => link.category === "Data")) temp.push("Data");
    if (links.find((link) => link.category === "College")) temp.push("College");
    if (links.find((link) => link.category === "Summary")) temp.push("Summary");
    if (
      mcqQuizzes.length + writtenQuizzes.length > 0 ||
      links.find((link) => link.category === "Questions")
    )
      temp.push("Questions");
    return temp;
  }, [links, mcqQuizzes, writtenQuizzes]);
  const [currentCategory, setCurrentCategory] = useState<number>();

  return { categories, currentCategory, setCurrentCategory };
}
