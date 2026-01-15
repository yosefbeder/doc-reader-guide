import EmptyPath from "@/components/EmptyPath";
import { icons } from "@/components/icons";
import Layout from "@/components/Layout";

export default function LinksLoadingPage() {
  return (
    <Layout updateable>
      <EmptyPath />
      <main className="main col">
        {[[], [], [], []].map((_, index) => (
          <button
            key={index}
            className="w-full text-left flex items-center gap-2 p-2 
                       bg-slate-50 hover:bg-slate-100 
                       dark:bg-slate-900 dark:hover:bg-slate-800 
                       rounded-xl transition-colors"
          >
            {icons["chevron-right"]}
            <div
              className="w-28 h-7 rounded 
                            bg-slate-700 dark:bg-slate-600 
                            animate-pulse"
            />
          </button>
        ))}
      </main>
    </Layout>
  );
}
