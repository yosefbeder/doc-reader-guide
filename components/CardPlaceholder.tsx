const cardContent = {
  module: (
    <>
      <div className="size-12 rounded-full bg-slate-200" />
      <div className="w-1/3 h-8 rounded bg-slate-200" />
      <div className="w-2/3 h-7 rounded bg-slate-200" />
    </>
  ),
  subject: (
    <>
      <div className="size-12 rounded-full bg-slate-200" />
      <div className="w-2/3 h-8 rounded bg-slate-200" />
    </>
  ),
  lecture: (
    <>
      <div className="w-full flex flex-col items-center gap-2">
        <div className="w-4/5 h-8 rounded bg-slate-200" />
        <div className="w-1/3 h-8 rounded bg-slate-200" />
      </div>
      <div className="w-2/3 h-7 rounded bg-slate-200" />
    </>
  ),
};

export default function CardPlaceholder({
  type,
}: {
  type: "module" | "subject" | "lecture";
}) {
  return <div className="card animate-pulse">{cardContent[type]}</div>;
}
