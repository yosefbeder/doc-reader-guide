const X_MARGIN = 8;
const MAX_WIDTH = 1024;

export default function calcFactor(width: number) {
  return (
    (outerWidth > MAX_WIDTH
      ? MAX_WIDTH - X_MARGIN * 2
      : outerWidth - X_MARGIN * 2) / width
  );
}
