const cardContent = {
  module: (
    <>
      <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-500" />
      <div className="w-1/3 h-8 rounded bg-slate-200 dark:bg-slate-500" />
    </>
  ),
  subject: (
    <>
      <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-500" />
      <div className="w-2/3 h-8 rounded bg-slate-200 dark:bg-slate-500" />
    </>
  ),
  lecture: (
    <>
      <div className="w-full flex flex-col items-center gap-2">
        <div className="w-4/5 h-8 rounded bg-slate-200 dark:bg-slate-500" />
        <div className="w-1/3 h-8 rounded bg-slate-200 dark:bg-slate-500" />
      </div>
      <div className="w-2/3 h-7 rounded bg-slate-200 dark:bg-slate-500" />
    </>
  ),
};

export default function CardPlaceholder({
  type,
}: {
  type: "module" | "subject" | "lecture";
}) {
  return (
    <div
      className={`card bg-white ${
        type === "module" ? "dark:bg-slate-700" : "dark:bg-slate-800"
      } animate-pulse`}
    >
      {cardContent[type]}
    </div>
  );
}
