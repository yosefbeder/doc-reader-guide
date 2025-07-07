import { useMemo, useState } from "react";

import { Link, PracticalQuiz, Quiz } from "@/types";

export default function useCategories(
  links: Link[],
  quizzes: Quiz[],
  practicalQuizzes: PracticalQuiz[]
) {
  const categories = useMemo(() => {
    const temp = [];
    if (links.find((link) => link.category === "Data")) temp.push("Data");
    if (links.find((link) => link.category === "College")) temp.push("College");
    if (links.find((link) => link.category === "Summary")) temp.push("Summary");
    if (
      quizzes.length + practicalQuizzes.length > 0 ||
      links.find((link) => link.category === "Questions")
    )
      temp.push("Questions");
    return temp;
  }, [links, quizzes, practicalQuizzes]);
  const [currentCategory, setCurrentCategory] = useState<number>();

  return { categories, currentCategory, setCurrentCategory };
}
