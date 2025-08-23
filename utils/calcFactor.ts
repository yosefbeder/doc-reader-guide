const X_MARGIN = 8;
const MAX_WIDTH = 576;

export default function calcFactor(width: number, xMargin: number = X_MARGIN) {
  return (
    (innerWidth > MAX_WIDTH
      ? MAX_WIDTH - xMargin * 2
      : innerWidth - xMargin * 2) / width
  );
}
