export default function buildChatGPTLink(
  prompt: string,
  customGPT: string | null
): string {
  return customGPT
    ? `${customGPT}?prompt=${encodeURIComponent(prompt)}`
    : `https://chat.openai.com/?model=auto&q=${encodeURIComponent(prompt)}`;
}
