export default function getPrefix(number: number): string {
  return ["st", "nd", "rd"][number - 1] || "th";
}
