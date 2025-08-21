export default function toIsoDuration(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `PT${h > 0 ? h + "H" : ""}${m > 0 ? m + "M" : ""}`;
}
