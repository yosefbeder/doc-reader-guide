import getNumber from "./getNumber";

export default function parseWrittenQuestions(formData: FormData) {
  const writtenQuestions = [];

  for (let i = 0; i < +process.env.NEXT_PUBLIC_OPTIONS_LIMIT!; i++) {
    const id = formData.get(`written-question-${i}-id`);
    const text = formData.get(`written-question-${i}-text`);
    const answer = formData.get(`written-question-${i}-answer`);
    if (text && answer) {
      writtenQuestions.push({
        id: id === null ? undefined : +id,
        text,
        answer,
      });
    }
  }

  return writtenQuestions;
}
