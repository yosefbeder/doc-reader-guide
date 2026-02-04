"use client";

import useSettings from "@/lib/hooks/useSettings";
import { useEffect, useState } from "react";

interface Testimonial {
  screenshotDark: string;
  screenshotLight: string;
  logo: string;
  batch: string;
  universityEn: string;
  universityAr: string;
}

const testimonials: Testimonial[] = [
  {
    screenshotDark: "/images/testimonials/dark/afmg-58-1.jpeg",
    screenshotLight: "/images/testimonials/light/afmg-58-1.jpeg",
    logo: "/logo-afmg.jpeg",
    batch: "58",
    universityEn: "AFMG",
    universityAr: "أزهر بنات القاهرة",
  },
  {
    screenshotDark: "/images/testimonials/dark/afmg-58-2.jpeg",
    screenshotLight: "/images/testimonials/light/afmg-58-2.jpeg",
    logo: "/logo-afmg.jpeg",
    batch: "58",
    universityEn: "AFMG",
    universityAr: "أزهر بنات القاهرة",
  },
  {
    screenshotDark: "/images/testimonials/dark/afmg-59-1.jpeg",
    screenshotLight: "/images/testimonials/light/afmg-59-1.jpeg",
    logo: "/logo-afmg.jpeg",
    batch: "59",
    universityEn: "AFMG",
    universityAr: "أزهر بنات القاهرة",
  },
  {
    screenshotDark: "/images/testimonials/dark/afmg-59-2.jpeg",
    screenshotLight: "/images/testimonials/light/afmg-59-2.jpeg",
    logo: "/logo-afmg.jpeg",
    batch: "59",
    universityEn: "AFMG",
    universityAr: "أزهر بنات القاهرة",
  },
  {
    screenshotDark: "/images/testimonials/dark/afmg-60.jpeg",
    screenshotLight: "/images/testimonials/light/afmg-60.jpeg",
    logo: "/logo-afmg.jpeg",
    batch: "60",
    universityEn: "AFMG",
    universityAr: "أزهر بنات القاهرة",
  },
  {
    screenshotDark: "/images/testimonials/dark/ain-shams-78.jpeg",
    screenshotLight: "/images/testimonials/light/ain-shams-78.jpeg",
    logo: "/logo-ain-shams.png",
    batch: "78",
    universityEn: "Ain Shams",
    universityAr: "عين شمس",
  },
  {
    screenshotDark: "/images/testimonials/dark/azhar-damietta-24-1.jpeg",
    screenshotLight: "/images/testimonials/light/azhar-damietta-24-1.jpeg",
    logo: "/logo-azhar-damietta.webp",
    batch: "24",
    universityEn: "Azhar Damietta",
    universityAr: "أزهر دمياط",
  },
  {
    screenshotDark: "/images/testimonials/dark/azhar-damietta-24-2.jpeg",
    screenshotLight: "/images/testimonials/light/azhar-damietta-24-2.jpeg",
    logo: "/logo-azhar-damietta.webp",
    batch: "24",
    universityEn: "Azhar Damietta",
    universityAr: "أزهر دمياط",
  },
  {
    screenshotDark: "/images/testimonials/dark/azhar-damietta-25-1.jpeg",
    screenshotLight: "/images/testimonials/light/azhar-damietta-25-1.jpeg",
    logo: "/logo-azhar-damietta.webp",
    batch: "25",
    universityEn: "Azhar Damietta",
    universityAr: "أزهر دمياط",
  },
  {
    screenshotDark: "/images/testimonials/dark/azhar-damietta-25-2.jpeg",
    screenshotLight: "/images/testimonials/light/azhar-damietta-25-2.jpeg",
    logo: "/logo-azhar-damietta.webp",
    batch: "25",
    universityEn: "Azhar Damietta",
    universityAr: "أزهر دمياط",
  },
];

export default function Testimonials({ lang }: { lang: "en" | "ar" }) {
  const isAr = lang === "ar";
  const { currentTheme } = useSettings();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  return (
    <section
      className={`py-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 ${
        isAr ? "font-arabic" : ""
      }`}
    >
      <div className="main col">
        <div className="text-center mb-8">
          <h2 className="text-2xl mb-2">
            {isAr ? "ماذا يقول زملاؤك؟" : "Loved by Students"}
          </h2>
          <p>
            {isAr
              ? "آراء من طلاب يعتمدون على التطبيق بشكل دوري"
              : "Feedback from medical students who rely on DocReader Guide"}
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map((item, index) => (
            <div key={`testimonial-${index}`} className="relative">
              <img
                src={
                  currentTheme === "dark"
                    ? item.screenshotDark
                    : item.screenshotLight
                }
                alt={`Testimonial from ${
                  isAr ? item.universityAr : item.universityEn
                } Batch ${item.batch}`}
                className="w-full h-auto pt-4 object-cover rounded-xl"
                loading="lazy"
              />

              <div className="absolute -top-0 -right-4">
                <img
                  src={item.logo}
                  alt={`${isAr ? item.universityAr : item.universityEn} Logo`}
                  className="size-16 rounded-full bg-white shadow-md p-0.5 object-contain"
                />
              </div>

              <div className="absolute bottom-0 left-0">
                <span className="bg-cyan-600 text-white text-base px-2 py-0.5 rounded-bl-xl rounded-tr-xl backdrop-blur-sm whitespace-nowrap">
                  {isAr ? "دفعة" : "Batch"} {item.batch}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
