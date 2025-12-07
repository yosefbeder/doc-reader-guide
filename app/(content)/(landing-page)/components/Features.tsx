"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Dialogue from "@/components/Dialogue";
import { icons } from "@/components/icons";
import VideoPlayer from "./VideoPlayer";

interface Feature {
  icon: keyof typeof icons;
  titleEn: string;
  descEn: string;
  titleAr: string;
  descAr: string;
}

const features: Feature[] = [
  {
    icon: "queue-list",
    titleEn: "Curriculum Hierarchy",
    descEn:
      "Links are organized strictly by Year → Module → Subject, exactly like your faculty timetables.",
    titleAr: "نظام وترتيب",
    descAr:
      "المحاضرات مترتبة بنظام (السنة ← الموديول ← المادة) بالظبط زي جدول كليتك.",
  },
  {
    icon: "magnifying-glass",
    titleEn: "Smart Search",
    descEn:
      "Find any lecture instantly by title or date. No more scrolling through endless Telegram chats.",
    titleAr: "بحث سريع",
    descAr:
      "دور على أي محاضرة بعنوانها أو تاريخها. مش محتاج تقلب في شات التليجرام تاني.",
  },
  {
    icon: "open-ai",
    titleEn: "Custom AI Tutor",
    descEn:
      "Ask Custom GPT models trained specifically on your faculty curriculum.",
    titleAr: "مساعد ذكي",
    descAr:
      "اسأل الـ AI أي سؤال في المنهج أو خليه يشرحلك نقطة صعبة. ال Custom GPT مدرب على داتا كليتك.",
  },
  {
    icon: "pencil-square",
    titleEn: "MCQs",
    descEn:
      "Solve department books and previous year exams with explanations and diagrams.",
    titleAr: "أسئلة اختيار من متعدد",
    descAr:
      "حل أسئلة كتب الأقسام والسنوات السابقة مع دعم إضافة دياجرام للسؤال وتوضيح للإجابة.",
  },
  {
    icon: "eye-slash",
    titleEn: "Image Occlusion",
    descEn: "Master practical exams by hiding labels to test your memory.",
    titleAr: "مذاكرة العملي",
    descAr: "اختبر ذاكرتك في العملي بخاصية إخفاء البيانات على الصور.",
  },
  {
    icon: "book-open",
    titleEn: "High-Yield Notes",
    descEn:
      "Access notes focused on exactly what doctors emphasized during the lectures.",
    titleAr: "ملاحظات المحاضرات",
    descAr: "بتركز على النقط اللي الدكاترة أكدوا عليها في الشرح.",
  },
];

export default function Features({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section
      className={`py-8 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 ${isAr ? "font-arabic" : ""
        }`}
    >
      <div className="main flex flex-col gap-8">
        <div className="text-center">
          <h2 className="mb-2">
            {isAr ? "لماذا DocReader Guide؟" : "Why DocReader Guide?"}
          </h2>
          <p>
            {isAr
              ? "أدوات صممت خصيصاً لتوفير وقتك ومجهودك"
              : "Everything you need to study smarter, not harder."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="card layer-1 clickable">
              <div className="bg-cyan-50 dark:bg-cyan-900 p-2 rounded-xl">
                <span className="[&>svg]:w-8 [&>svg]:h-8 text-cyan-600 dark:text-cyan-400">
                  {icons[feature.icon]}
                </span>
              </div>
              <h3>{isAr ? feature.titleAr : feature.titleEn}</h3>
              <p className="caption">
                {isAr ? feature.descAr : feature.descEn}
              </p>
            </div>
          ))}
        </div>

        <Button
          cta
          onClick={() => setIsVideoOpen(prev => !prev)}
          className="flex gap-2 items-center self-center"
        >
          <span>{isVideoOpen ? icons["x-mark"] : icons["play-circle"]}</span>
          {isVideoOpen ? (isAr ? "إخفاء الفيديو" : "Hide Video") : (isAr ? "شاهد الفيديو التوضيحي" : "Watch Demo Video")}
        </Button>


        {isVideoOpen && (
          <div dir="ltr">
            <VideoPlayer
              src="https://pub-d294382d28b74f91b351a88295dbb5f1.r2.dev/DocReader%20Guide%20-%20Users.mp4"
              chaptersSrc="/chapters.vtt"
            />
          </div>
        )}
      </div>
    </section >
  );
}
