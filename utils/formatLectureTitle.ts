export default function formatLectureTitle(title: string) {
  return title === "Final Revision Data"
    ? "Final Revision"
    : title === "Practical Data"
    ? "Practical"
    : title;
}
