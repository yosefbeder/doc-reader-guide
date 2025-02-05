import getNumber from "./getNumber";

export default function parseOptions(formData: FormData): {
  options: string[];
  correctOptionIndex: number;
} {
  const correctOptionId = getNumber(formData, "correct-option-id");

  const options: string[] = [];
  let correctOptionIndex = 0;

  for (let i = 0; i < +process.env.NEXT_PUBLIC_OPTIONS_LIMIT!; i++) {
    const option = formData.get(`option-${i}-text`);
    if (option) {
      if (i === correctOptionId) correctOptionIndex = options.length;
      options.push(option as string);
    }
  }

  return { options, correctOptionIndex };
}
