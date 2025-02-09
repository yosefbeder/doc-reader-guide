export default function isValidURL(str: string) {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
}
