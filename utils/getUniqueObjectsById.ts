export default function getUniqueObjectsById<T extends { id: number }>(
  array: T[]
): T[] {
  const uniqueMap = new Map();

  array.forEach((item) => {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  });

  return Array.from(uniqueMap.values());
}
