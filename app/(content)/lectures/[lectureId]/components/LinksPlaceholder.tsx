export function LinkPlaceholder() {
  return (
    <div className="flex gap-2 my-2 animate-pulse">
      <div className="size-7 rounded-full bg-slate-200"></div>
      <div className="h-7 w-32 rounded bg-slate-200"></div>
    </div>
  );
}

export default function LinksPlaceholder() {
  return (
    <>
      {[[], [], []].map((_, index) => (
        <details key={index} className="mb-4" open>
          <summary>
            <h2>{["مصادر خارجية", "الكلية", "الملخصات"][index]}</h2>
          </summary>
          <ul>
            <li>
              <LinkPlaceholder />
            </li>
            <li>
              <LinkPlaceholder />
            </li>
            <li>
              <LinkPlaceholder />
            </li>
          </ul>
        </details>
      ))}
    </>
  );
}
