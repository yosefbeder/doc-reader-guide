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
    link: "/android-app",
    color: "hover:text-[#3DDC84]",
    icon: (
      <svg
        className="size-8"
        fill="currentColor"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Android</title>
        <path d="M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z" />
      </svg>
    ),
  },
  {
    link: "mailto:docreaderg@gmail.com",
    color: "hover:text-[#EA4335]",
    icon: (
      <svg
        className="size-8"
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
        className="size-8"
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
    link: "https://t.me/DOCREADER_Guide_0",
    color: "hover:text-[#0088cc]",
    icon: (
      <svg
        className="size-8"
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
  {
    link: "https://www.youtube.com/@docreaderguide",
    color: "hover:text-[#FF0000]",
    icon: (
      <svg
        className="size-8"
        fill="currentColor"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>YouTube</title>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    link: "https://www.tiktok.com/@docreaderguide",
    color: "hover:text-[#000000]",
    icon: (
      <svg
        className="size-8"
        fill="currentColor"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>TikTok</title>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    link: "https://www.instagram.com/docreaderguide",
    color: "hover:text-[#FF0069]",
    icon: (
      <svg
        className="size-8"
        fill="currentColor"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Instagram</title>
        <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
      </svg>
    ),
  },
  {
    link: "https://www.linkedin.com/company/doc-reader-guide",
    color: "hover:text-[#0077B7]",
    icon: (
      <svg
        version="1.1"
        id="Layer_1"
        className="size-8"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 382 382"
        xmlSpace="preserve"
      >
        <path
          d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889
	C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056
	H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806
	c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1
	s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73
	c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079
	c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426
	c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472
	L341.91,330.654L341.91,330.654z"
        />
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

export default function Footer({ lang = "en" }: { lang?: "en" | "ar" }) {
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
        <div className="flex justify-center items-center gap-4 mb-4 max-sm:flex-col">
          <div className="flex items-center gap-4">
            {links
              .filter((_, index) => index < 4)
              .map(({ link, color, icon }, index) =>
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
          <div className="flex items-center gap-4">
            {links
              .filter((_, index) => index > 3)
              .map(({ link, color, icon }, index) =>
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
        <p className="caption text-center">
          {isAr
            ? "جميع الحقوق محفوظة لـ DocReader Guide © 2026. يتم تحديث المصادر بانتظام."
            : "© 2026 DocReader Guide. Sources are updated regularly."}
        </p>
      </div>

      {selectedContributor && (
        <Dialogue
          size="sm"
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
