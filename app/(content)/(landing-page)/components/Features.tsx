"use client";

import { icons } from "@/components/icons";
import { ReactNode, useEffect, useState } from "react";
import useSettings from "@/lib/hooks/useSettings";

interface Feature {
  icon: keyof typeof icons;
  titleEn: string;
  descEn: (string | ReactNode)[];
  titleAr: string;
  descAr: (string | ReactNode)[];
  videoName: string;
}

const features: Feature[] = [
  {
    icon: "calendar-outline",
    titleEn: "Curriculum Hierarchy",
    descEn: [
      <>
        Identical to <b className="gradient-text">your faculty</b> timetable
      </>,
      "Semester > Module > Subject > Lecture",
    ],
    titleAr: "تنظيم المنهج",
    descAr: [
      <>
        مطابق تماماً لجدول <b className="gradient-text">كليتك</b>
      </>,
      "ترم > موديول > مادة > محاضرة",
    ],
    videoName: "curriculum-hierarchy",
  },
  {
    icon: "magnifying-glass",
    titleEn: "Search",
    descEn: [
      "Find any lecture in seconds by title",
      "Get lecture agenda for today, yesterday, and tomorrow",
    ],
    titleAr: "بحث",
    descAr: ["ابحث عن أي محاضرة في ثواني بالعنوان", "تقارير دراسية بالتاريخ"],
    videoName: "search",
  },
  {
    icon: "open-ai",
    titleEn: "Custom GPT models",
    descEn: [
      <>
        Trained specifically on <b className="gradient-text">your faculty</b>{" "}
        curriculum
      </>,
      "Give you the references by page numbers",
    ],
    titleAr: "مساعد ذكي",
    descAr: [
      <>
        مدربة خصيصاً على منهج <b className="gradient-text">كليتك</b>
      </>,
      "تعطيك المرجع على الإجابة برقم الصفحة",
    ],
    videoName: "ask-chatgpt",
  },
  {
    icon: "queue-list",
    titleEn: "MCQs",
    descEn: [
      <>
        Solve department books and previous year exams of{" "}
        <b className="gradient-text">your faculty</b>
      </>,
      "Detailed explanations and diagrams",
      "Discuss any question with custom GPT models",
      "Track your performance",
      "Share any question",
    ],
    titleAr: "أسئلة اختيار من متعدد",
    descAr: [
      <>
        حل أسئلة كتب الأقسام والسنوات السابقة{" "}
        <b className="gradient-text">لكليتك</b>
      </>,
      "توضيح للإجابة بالصور والشرح",
      "متابعة مستواك أول بأول",
      <>
        ناقش أي سؤال مع الـ GPT models المدربة على منهج{" "}
        <b className="gradient-text">كليتك</b>
      </>,
      "شارك أي سؤال مع أصدقائك",
    ],
    videoName: "mcq",
  },
  {
    icon: "eye-slash",
    titleEn: "Image Occlusion",
    descEn: [
      "Hide labels on images to test your memory",
      "Track your performance",
      "Share any question",
    ],
    titleAr: "مذاكرة العملي",
    descAr: [
      "اختبر ذاكرتك بإخفاء البيانات من على الصور",
      "متابعة مستواك أول بأول",
      "شارك أي سؤال مع أصدقائك",
    ],
    videoName: "image-occlusion",
  },
  {
    icon: "pencil",
    titleEn: "Written Questions",
    descEn: [
      "Structured answers with images and tables",
      "Track your performance",
      "Share any question",
    ],
    titleAr: "أسئلة مقالية",
    descAr: [
      "إجابات نموذجية مدعمة بالصور والجداول",
      "متابعة مستواك أول بأول",
      "شارك أي سؤال مع أصدقائك",
    ],
    videoName: "written",
  },
  {
    icon: "book-open",
    titleEn: "High-Yield Notes",
    descEn: [
      "Access high-yield notes",
      <>
        Focused on <b className="gradient-text">your faculty</b> doctor&apos;s
        emphasis
      </>,
    ],
    titleAr: "ملاحظات المحاضرات",
    descAr: [
      "ذاكر من ملخصات مركزة",
      <>
        شاملة زيادات دكاترة <b className="gradient-text">كليتك</b> المهمة
      </>,
    ],
    videoName: "notes",
  },
  {
    icon: "signal-slash",
    titleEn: "Offline Support",
    descEn: [
      "Download any module",
      "Download PDFs and audio records and open them in-app",
    ],
    titleAr: "بدون انترنت",
    descAr: [
      "قم بتحميل أي موديول",
      "قم بتحميل الملفات والريكوردات وفتحها من البرنامج",
    ],
    videoName: "offline",
  },
  {
    icon: "printer",
    titleEn: "Print",
    descEn: [
      "Print any type of quizzes for exam simulation",
      "Options: booklet with/without answers and study mode",
    ],
    titleAr: "طباعة",
    descAr: [
      "اطبع أي نوع من الكوزيات لمحاكاة الاختبار",
      "الخيارات: بوكليت مع (أو بدون الإجابات) أو وضع المذاكرة",
    ],
    videoName: "print",
  },
  {
    icon: "cog-6-tooth",
    titleEn: "Customization",
    descEn: ["Dark theme", "Notifications", "Shuffle", "Sounds", "And more..."],
    titleAr: "الإعدادات",
    descAr: [
      "الوضع الليلي",
      "الإشعارات",
      "تغيير ترتيب الأسئلة",
      "الصوت",
      "و المزيد...",
    ],
    videoName: "settings",
  },
  {
    icon: "squares-2x2",
    titleEn: "AI-powered Admin Dashboard",
    descEn: [
      "Convert 80 MCQs from PDF to digital in 5 minutes (literally)",
      "Add image occlusions with a simple drag and drop interface",
    ],
    titleAr: "لوحة التحكم بال AI",
    descAr: [
      "تحويل ٨٠ سؤال اختيار من متعدد من ملف ورقي إلى نسخة رقمية في خمس دقائق (حرفيًا)",
      "إضافة أسئلة عن طريق اخفاء أجزاء من الصورة بسهولة",
    ],
    videoName: "admins",
  },
];

function FeatureItem({
  feature,
  isAr,
  isEven,
  resolvedTheme,
  mounted,
}: {
  feature: Feature;
  isAr: boolean;
  isEven: boolean;
  resolvedTheme: string | undefined;
  mounted: boolean;
}) {
  const descriptions = isAr ? feature.descAr : feature.descEn;

  return (
    <div
      className={`flex flex-col items-center gap-8 ${
        !isEven ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="flex-1 max-w-screen-sm">
        {mounted ? (
          <video
            src={`${process.env.NEXT_PUBLIC_R2_URL}/landing-page-videos/${
              feature.videoName
            }-${resolvedTheme === "dark" ? "dark" : "light"}.mp4`}
            autoPlay
            loop
            muted
            className="w-full h-auto rounded-xl"
          />
        ) : (
          <div className="aspect-video bg-slate-50 dark:bg-slate-900 rounded-xl animate-pulse flex items-center justify-center text-slate-400">
            Video Loading...
          </div>
        )}
      </div>
      <div className="flex-1 space-y-6">
        <div className="size-12 rounded-xl bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
          <span className="[&>svg]:w-8 [&>svg]:h-8">{icons[feature.icon]}</span>
        </div>

        <h3
          className={`text-cyan-600 dark:text-cyan-400 ${isAr ? "font-bold" : "uppercase"}`}
        >
          {isAr ? feature.titleAr : feature.titleEn}
        </h3>

        <ul className="space-y-4">
          {descriptions.map((desc, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-1 min-w-[20px] text-cyan-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p>{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Features({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";
  const { currentTheme } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className={`py-16 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 ${
        isAr ? "font-arabic" : ""
      }`}
    >
      <div className="main space-y-8">
        <div className="flex flex-col gap-2 items-center text-center">
          <h2 className="text-2xl">
            {isAr ? "لماذا DocReader Guide؟" : "Why DocReader Guide?"}
          </h2>
          <p>
            {isAr
              ? "أدوات صممت خصيصاً لتوفير وقتك ومجهودك"
              : "Everything you need to study smarter, not harder."}
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              feature={feature}
              isAr={isAr}
              isEven={index % 2 === 0}
              resolvedTheme={currentTheme}
              mounted={mounted}
            />
          ))}
          <h3
            className={`text-cyan-600 dark:text-cyan-400 ${isAr ? "font-bold" : "uppercase"} text-center`}
          >
            {isAr ? "والمزيد..." : "And more..."}
          </h3>
        </div>
      </div>
    </section>
  );
}
