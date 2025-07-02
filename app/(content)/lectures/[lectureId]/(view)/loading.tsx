import EmptyPath from "@/components/EmptyPath";
import { icons } from "@/components/icons";

export default function LinksLoadingPage() {
  return (
    <>
      <EmptyPath />
      <main className="main flex flex-col gap-4">
        {[[], [], [], []].map((_, index) => (
          <button
            key={index}
            className="w-full text-left flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl"
          >
            {icons["chevron-right"]}
            <div className="w-28 h-7 rounded bg-slate-700 animate-pulse" />
          </button>
        ))}
      </main>
    </>
  );
}
