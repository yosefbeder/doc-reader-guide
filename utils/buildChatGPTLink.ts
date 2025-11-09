export const customGPTs = new Map([
  [
    3,
    "https://chatgpt.com/g/g-6910e107c9d88191a2c9df32230e255f-shtr-kyn-renal-aud",
  ],
]);

export default function buildChatGPTLink(
  prompt: string,
  moduleId: number
): string {
  return customGPTs.has(moduleId)
    ? `${customGPTs.get(moduleId)!}?prompt=${encodeURIComponent(prompt)}`
    : `https://chat.openai.com/?model=auto&q=${encodeURIComponent(prompt)}`;
}
