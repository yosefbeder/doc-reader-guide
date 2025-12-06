import Button from "@/components/Button";

export default function UniversityRequest({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";

  return (
    <section
      className={`py-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 ${isAr ? "font-arabic" : ""
        }`}
    >
      <div className="main flex flex-col gap-8 items-center text-center">
        <h2>
          {isAr
            ? "كُن المبادر في كليتك"
            : "Lead the Change at Your Faculty"}
        </h2>
        <p className="max-w-2xl">
          {isAr
            ? "هل أنت من ممثلي الدفعة أو اتحاد الطلاب؟ تواصل معنا الآن لإنشاء مساحة مخصصة وتنظيم المحتوى العلمي لدفعتك بالكامل على التطبيق."
            : "Are you a student union member or batch leader? Partner with us to create a dedicated, organized space for your entire faculty on DocReader."}
        </p>
        <a href="https://t.me/DocReader_Guide_app" target="_blank">
          <Button cta>
            {isAr ? "تعاون معنا" : "Partner with Us"}
          </Button>
        </a>
      </div>
    </section>
  );
}