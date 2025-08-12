const X_MARGIN = 8;
const MAX_WIDTH = 576;

export default function calcFactor(width: number) {
  return (
    (innerWidth > MAX_WIDTH
      ? MAX_WIDTH - X_MARGIN * 2
      : innerWidth - X_MARGIN * 2) / width
  );
}
