import Image from "next/image";
import LogoImage from "@/public/logo.png";

export default function DocReaderBadge({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span className={className}>
      Presented by{" "}
      <Image src={LogoImage} className="inline-block w-3 h-auto" alt="Logo" />{" "}
      <span className="text-cyan-700 dark:text-cyan-500 font-extrabold">
        DocReader Guide
      </span>
    </span>
  );
}
