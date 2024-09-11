import Image from "next/image";

import AnonymousAvatar from "@/public/anonymous.jpg";
import AbdulrahmanAvatar from "@/public/abdulrahmansaber.jpeg";
import OmarAvatar from "@/public/omarabdelaleem.jpeg";
import MohammedAvatar from "@/public/mohammedalzayat.jpeg";
import Tooltip from "./Tooltip";

const links = [
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
    link: "https://www.amazon.com/dp/B0DD8TJJ95/ref=apps_sf_sta",
    color: "hover:text-[#ff9900]",
    icon: (
      <svg
        className="size-10"
        fill="currentColor"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Amazon</title>
        <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z" />
      </svg>
    ),
  },
  {
    link: "https://drive.google.com/file/d/1S00uQ0zyaRGQW76Du1tGMw8H_nxFvkLX/view?usp=share_link",
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
    avatar: AnonymousAvatar,
    name: "مجهول",
    contribution: "مطور الواجهة الأمامية (الموقع)",
  },
  {
    avatar: AbdulrahmanAvatar,
    name: "عبد الرحمن صابر",
    contribution: "مطور الواجهة الخلفية",
    profile: "https://www.facebook.com/asaber.25",
  },
  {
    avatar: OmarAvatar,
    name: "عمر عبد العليم",
    contribution: "مطور تطبيق الأندرويد",
    profile: "https://www.facebook.com/omar.abdelaleem.144",
  },
  {
    avatar: MohammedAvatar,
    name: "محمد الزيات",
    contribution: "مصمم اللوجو وتجربة المستخدم",
    profile: "https://www.facebook.com/mohamedelzayat321",
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t-2 border-slate-200">
      <div className="main">
        <div className="flex justify-center gap-4 mb-4">
          {links.map(({ link, color, icon }, index) => (
            <a
              key={index}
              href={link}
              className={`text-inherit ${color}`}
              target="_blank"
            >
              {icon}
            </a>
          ))}
        </div>
        <div className="flex -space-x-4 rtl:space-x-reverse justify-center">
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
                <Tooltip content={`${name} - ${contribution}`}>
                  {profile ? (
                    <a key={index} href={profile} target="_blank">
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
      </div>
    </footer>
  );
}
