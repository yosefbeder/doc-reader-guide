export default function Path({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cyan-600 text-slate-50 text-sm font-bold ">
      <div className="max-w-screen-lg px-2 py-1 mx-auto">{children}</div>
    </div>
  );
}
