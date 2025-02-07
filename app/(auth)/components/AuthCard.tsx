import Image from "next/image";

import Logo from "@/public/logo.png";

interface AuthCardProps {
  hover: boolean;
  children: React.ReactNode;
  title: string;
}

export default function AuthCard({ hover, title, children }: AuthCardProps) {
  return (
    <main
      className={`max-w-lg max-[512px]:m-0 max-[512px]:rounded-none max-[512px]:border-none max-[512px]:min-h-screen mx-auto my-8 p-8 rounded-xl bg-[length:auto_200%] bg-gradient-to-t from-cyan-100 to-slate-50 to-15% border-2 border-slate-200 transition-[background-position] flex flex-col items-center gap-4 ${
        hover ? "bg-bottom" : "bg-top"
      }`}
    >
      <Image src={Logo} width={128} alt="Logo" />
      <span className="text-4xl font-black text-cyan-700 font-cairo">
        دوكريدر جايد
      </span>
      <h1 className="font-bold text-cyan-600">{title}</h1>
      {children}
    </main>
  );
}
