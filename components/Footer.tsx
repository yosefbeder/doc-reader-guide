import Image from "next/image";

import AnonymousSlateAvatar from "@/public/anonymous-slate.jpg";
import AnonymousCyanAvatar from "@/public/anonymous-cyan.jpg";
import AnonymousPinkAvatar from "@/public/anonymous-pink.jpg";
import AbdulrahmanAvatar from "@/public/abdulrahmansaber.jpeg";
import OmarAvatar from "@/public/omarabdelaleem.jpeg";
import MohammedAvatar from "@/public/mohammedalzayat.jpeg";
import OthersAvatar from "@/public/others.jpg";
import Tooltip from "./Tooltip";
import Link from "next/link";

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
  {
    link: "/android",
    color: "hover:text-[#34A853]",
    icon: (
      <svg
        className="size-10"
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
];

const contributers = [
  {
    avatar: AnonymousSlateAvatar,
    name: "مجهول",
    contribution: "مطور الموقع + أجزاء من السيرفر",
  },
  {
    avatar: AnonymousCyanAvatar,
    name: "مجهول تو",
    contribution: "مطور السيرفر الجديد (الحالي)",
  },
  {
    avatar: OmarAvatar,
    name: "عمر عبد العليم",
    contribution: "مطور تطبيق الأندرويد",
    profile: "https://www.facebook.com/omar.abdelaleem.144",
  },
  {
    avatar: AbdulrahmanAvatar,
    name: "عبد الرحمن صابر",
    contribution: "مطور السيرفر القديم",
    profile: "https://www.facebook.com/asaber.25",
  },
  {
    avatar: AnonymousPinkAvatar,
    name: "مجهولة",
    contribution: "مصممة تجربة المستخدم",
  },
  {
    avatar: MohammedAvatar,
    name: "محمد الزيات",
    contribution: "مصمم اللوجو",
    profile: "https://www.facebook.com/mohamedelzayat321",
  },
  {
    avatar: OthersAvatar,
    name: "الأدمينز",
    contribution: "إضافة المصادر والاختبارات",
  },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-slate-200">
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
        <div className="flex -space-x-4 rtl:space-x-reverse justify-center mb-4">
          {contributers.map(
            ({ avatar, name, contribution, profile }, index) => {
              const image = (
                <Image
                  src={avatar}
                  width={40}
                  height={40}
                  alt={name}
                  className="border-2 border-slate-50 rounded-full"
                />
              );
              return (
                <Tooltip key={index} content={`${name} - ${contribution}`}>
                  {profile ? (
                    <a href={profile} target="_blank">
                      {image}
                    </a>
                  ) : (
                    <>{image}</>
                  )}
                </Tooltip>
              );
            }
          )}
        </div>
        <div className="text-center">
          Sources are regularly updated ·{" "}
          <a
            className="link"
            href="https://t.me/DocReader_Guide_app/93"
            target="_blank"
          >
            Donate
          </a>
        </div>
      </div>
    </footer>
  );
}
