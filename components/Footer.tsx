"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Dialogue from "./Dialogue";
import Button from "./Button";

import YosefAvatar from "@/public/yosefbeder.jpg";
import AnonymousCyanAvatar from "@/public/anonymous-cyan.jpg";
import AnonymousPinkAvatar from "@/public/anonymous-pink.jpg";
import AbdulrahmanAvatar from "@/public/abdulrahmansaber.jpeg";
import OmarAvatar from "@/public/omarabdelaleem.jpeg";
import MohammedAvatar from "@/public/mohammedalzayat.jpeg";
import OthersAvatar from "@/public/others.jpg";

const links = [
  {
    link: "mailto:docreaderguide.feedback@gmail.com",
    color: "hover:text-[#EA4335]",
    icon: (
      <svg
        className="size-10"
        fill="currentColor"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Gmail</title>
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
      </svg>
    ),
  },
  {
    link: "https://www.facebook.com/profile.php?id=61564416632497&mibextid=ZbWKwL",
    color: "hover:text-[#1877f2]",
    icon: (
      <svg
        className="size-10"
        fill="currentColor"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Facebook</title>
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
      </svg>
    ),
  },
  {
    link: "https://t.me/DocReader_Guide_app",
    color: "hover:text-[#0088cc]",
    icon: (
      <svg
        className="size-10"
        fill="currentColor"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Telegram</title>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

const contributers = [
  {
    avatar: YosefAvatar,
    name: { en: "Yosef Beder", ar: "يوسف بدير" },
    contribution: {
      en: "Frontend Developer (Web Site)",
      ar: "مطور الواجهة الأمامية (الموقع)",
    },
    profile: "https://yosefbeder.com/",
  },
  {
    avatar: AnonymousCyanAvatar,
    name: { en: "Unknown", ar: "مجهول" },
    contribution: {
      en: "New Server Developer (Current)",
      ar: "مطور الخادم الجديد (الحالي)",
    },
  },
  {
    avatar: OmarAvatar,
    name: { en: "Omar Abdel Aleem", ar: "عمر عبد العليم" },
    contribution: { en: "Android App Developer", ar: "مطور تطبيق الأندرويد" },
    profile: "https://www.facebook.com/omar.abdelaleem.144",
  },
  {
    avatar: AbdulrahmanAvatar,
    name: { en: "Abdulrahman Saber", ar: "عبد الرحمن صابر" },
    contribution: { en: "Old Server Developer", ar: "مطور الخادم القديم" },
    profile: "https://asaber.vercel.app/",
  },
  {
    avatar: AnonymousPinkAvatar,
    name: { en: "Unknown", ar: "مجهولة" },
    contribution: {
      en: "App Publisher + Suggesting Features and Improvements",
      ar: "نشر التطبيق + اقتراح مميزات وتحسينات",
    },
  },
  {
    avatar: MohammedAvatar,
    name: { en: "Mohammed El Zayat", ar: "محمد الزيات" },
    contribution: { en: "Logo Designer", ar: "مصمم الشعار" },
    profile: "https://www.facebook.com/mohamedelzayat321",
  },
  {
    avatar: OthersAvatar,
    name: { en: "Admins", ar: "المشرفون" },
    contribution: {
      en: "Adding Sources and Quizzes",
      ar: "إضافة المصادر والاختبارات",
    },
  },
];

export default function Footer({
  lang = "en",
  isLandingPage = false,
}: {
  lang?: "en" | "ar";
  isLandingPage?: boolean;
}) {
  const [selectedContributor, setSelectedContributor] = useState<
    (typeof contributers)[0] | null
  >(null);
  const isAr = lang === "ar";

  const t = {
    sourcesUpdated: isAr
      ? "يتم تحديث المصادر بانتظام"
      : "Sources are regularly updated",
    donate: isAr ? "تبرع" : "Donate",
    contributorHeader: isAr ? "مساهم" : "Contributor",
    viewProfile: isAr ? "عرض الملف الشخصي" : "View Profile",
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-700">
      <div className="main">
        <div className="flex justify-center items-center gap-4 mb-4">
          {links.map(({ link, color, icon }, index) =>
            link.startsWith("/") ? (
              <Link key={index} href={link} className={color}>
                {icon}
              </Link>
            ) : (
              <a key={index} href={link} className={color} target="_blank">
                {icon}
              </a>
            )
          )}
        </div>
        <div className="flex -space-x-2 rtl:space-x-reverse justify-center mb-4">
          {contributers.map((contributor, index) => (
            <button
              key={index}
              onClick={() => setSelectedContributor(contributor)}
              className="relative transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-full"
              aria-label={`View details for ${contributor.name[lang]}`}
            >
              <Image
                src={contributor.avatar}
                width={40}
                height={40}
                alt={`${contributor.name[lang]} - ${contributor.contribution[lang]}`}
                title={`${contributor.name[lang]}'s avatar`}
                className="border-2 border-white dark:border-slate-900 rounded-full"
              />
            </button>
          ))}
        </div>
        {isLandingPage ? (
          <p className="caption text-center">
            {isAr
              ? "جميع الحقوق محفوظة لـ DocReader Guide © 2025."
              : "© 2025 DocReader Guide. All rights reserved."}{" "}
          </p>
        ) : (
          <div className="text-center">
            {t.sourcesUpdated} ·{" "}
            <a
              className="link"
              href="https://t.me/DocReader_Guide_app/110"
              target="_blank"
            >
              {t.donate}
            </a>
          </div>
        )}
      </div>

      {selectedContributor && (
        <Dialogue
          header={t.contributorHeader}
          onClose={() => setSelectedContributor(null)}
          className="flex flex-col items-center text-center p-4 gap-4 rounded-3xl"
        >
          <Image
            src={selectedContributor.avatar}
            alt={`${selectedContributor.name[lang]} - ${selectedContributor.contribution[lang]}`}
            title={`${selectedContributor.name[lang]}'s avatar`}
            width={160}
            height={160}
            className="rounded-full"
          />
          <h3>{selectedContributor.name[lang]}</h3>
          <p>{selectedContributor.contribution[lang]}</p>
          {selectedContributor.profile && (
            <a
              href={selectedContributor.profile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button color="cyan">{t.viewProfile}</Button>
            </a>
          )}
        </Dialogue>
      )}
    </footer>
  );
}
