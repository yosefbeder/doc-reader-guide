"use client";

import { icons } from "@/components/icons";
import { useState } from "react";

const Vodafone = () => <svg fill="currentColor" className="size-6 inline-block" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Vodafone</title><path d="M12 0A12 12 0 0 0 0 12A12 12 0 0 0 12 24A12 12 0 0 0 24 12A12 12 0 0 0 12 0M16.25 1.12C16.57 1.12 16.9 1.15 17.11 1.22C14.94 1.67 13.21 3.69 13.22 6C13.22 6.05 13.22 6.11 13.23 6.17C16.87 7.06 18.5 9.25 18.5 12.28C18.54 15.31 16.14 18.64 12.09 18.65C8.82 18.66 5.41 15.86 5.39 11.37C5.38 8.4 7 5.54 9.04 3.85C11.04 2.19 13.77 1.13 16.25 1.12Z" /></svg >

export default function Sponsorship({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";
  const [copied, setCopied] = useState(false);
  const phoneNumber = "01025652828";

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className={`py-8 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 ${isAr ? "font-arabic" : ""
        }`}
    >
      <div className="main flex flex-col gap-8 items-center text-center">
        <h2>
          {isAr
            ? "مجاني ١٠٠٪. من الطلاب وللطلاب."
            : "100% Free. Community Driven."}
        </h2>
        <p className="max-w-2xl">
          {isAr
            ? "تطبيق DocReader Guide قائم بجهود ذاتية. نعتمد على تبرعاتكم لاستمرار السيرفرات وتطوير المزايا. ساهم معنا في نشر العلم وتسهيله."
            : "DocReader Guide is built by students, for students. We rely on donations to keep servers running and features growing. Help us keep education accessible."}
        </p>
        <div>
          {isAr ? "قم بإرسال المال عبر " : "Send us via "}
          <span className="text-[#E60000] font-medium font-sans"><Vodafone /> Vodafone Cash</span> {isAr ? "على الرقم التالي:" : "on the following number:"}
        </div>
        <div className="flex items-center gap-4">
          <div className="font-mono">
            {phoneNumber}
          </div>
          <button
            onClick={handleCopy}
            aria-label={isAr ? "نسخ الرقم" : "Copy phone number"}
          >
            {copied ? icons["check"] : icons["clipboard-document-list"]}
          </button>
        </div>
      </div>
    </section>
  );
}
