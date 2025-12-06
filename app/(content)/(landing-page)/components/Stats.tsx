import { icons } from "@/components/icons";

const stats = [
  {
    labelEn: "Active Students",
    labelAr: "طالب وطالبة",
    value: "5,000+",
    icon: "user-group",
  },
  {
    labelEn: "Practice Questions",
    labelAr: "سؤال تدريبي",
    value: "140,000+",
    icon: "pencil-square",
  },
  {
    labelEn: "Lectures & Resources",
    labelAr: "محاضرة وملف",
    value: "16,000+",
    icon: "building-library",
  },
];

export default function Stats({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";

  return (
    <section
      className={`py-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 ${
        isAr ? "font-arabic" : ""
      }`}
    >
      <div className="main">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="grow card layer-1 clickable">
              <div className="bg-cyan-50 dark:bg-cyan-900 p-2 rounded-xl">
                <span className="[&>svg]:w-8 [&>svg]:h-8 text-cyan-600 dark:text-cyan-400">
                  {icons[stat.icon as keyof typeof icons]}
                </span>
              </div>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p>{isAr ? stat.labelAr : stat.labelEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
