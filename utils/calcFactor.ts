const X_MARGIN = 8;

export default function calcFactor(width: number) {
  return (
    (outerWidth - X_MARGIN * 2 > 512 ? 512 : outerWidth - X_MARGIN * 2) / width
  );
}
