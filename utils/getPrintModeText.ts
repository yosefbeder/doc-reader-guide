export default function getPrintModeText(
  mode: "booklet-with-answers" | "booklet-without-answers" | "study"
): string {
  switch (mode) {
    case "booklet-with-answers":
      return "Booklet with answers";
    case "booklet-without-answers":
      return "Booklet without answers";
    case "study":
      return "Study mode";
    default:
      return "";
  }
}
