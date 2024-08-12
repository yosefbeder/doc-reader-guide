import Image from "next/image";

import Logo from "@/public/logo.png";

interface AuthCardProps {
  hover: boolean;
  children: React.ReactNode;
}

export default function AuthCard({ hover, children }: AuthCardProps) {
  return (
    <main
      className={`card flex flex-col items-center gap-4 ${hover && "hover"}`}
    >
      <Image src={Logo} width={128} alt="Logo" />
      <h1>دوكريدر جايد</h1>
      {children}
    </main>
  );
}
