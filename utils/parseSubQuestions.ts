export default function parseSubQuestions(formData: FormData) {
  const subQuestions = [];

  for (let i = 0; i < +process.env.NEXT_PUBLIC_OPTIONS_LIMIT!; i++) {
    const idName = `sub-question-${i}-id`;
    const textName = `sub-question-${i}-text`;
    const answerName = `sub-question-${i}-answer`;
    const id = formData.get(idName);
    const text = formData.get(textName);
    const answer = formData.get(answerName);
    if (text && answer) {
      subQuestions.push({
        id: id === null ? undefined : +id,
        text,
        answer,
      });
      formData.delete(idName);
      formData.delete(textName);
      formData.delete(answerName);
    }
  }

  return subQuestions;
}
