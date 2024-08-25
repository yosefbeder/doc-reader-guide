export default function getNumber(formData: FormData, key: string): number {
  return +(formData.get(key) as string);
}
