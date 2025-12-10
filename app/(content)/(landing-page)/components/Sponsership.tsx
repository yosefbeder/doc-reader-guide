import React from "react";
import DonateButton from "@/components/DonateButton";

export default function Sponsorship({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";

  return (
    <section
      className={`py-8 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 ${
        isAr ? "font-arabic" : ""
      }`}
    >
      <div className="main flex flex-col gap-8 items-center">
        <h2 className="text-center">
          {isAr
            ? "مجاني ١٠٠٪. من الطلاب وللطلاب."
            : "100% Free. Community Driven."}
        </h2>
        <p className="max-w-2xl text-center">
          {isAr
            ? "تطبيق DocReader Guide قائم بجهود ذاتية. نعتمد على تبرعاتكم لاستمرار السيرفرات وتطوير المزايا. ساهم معنا في نشر العلم وتسهيله."
            : "DocReader Guide is built by students, for students. We rely on donations to keep servers running and features growing. Help us keep education accessible."}
        </p>
        <DonateButton lang={lang} className="self-center" />
      </div>
    </section>
  );
}
