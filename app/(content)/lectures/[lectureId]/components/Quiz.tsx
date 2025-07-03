import NextLink from "next/link";
import Image from "next/image";

import { Quiz as QuizType } from "@/types";
import { typeIcons } from "./typeIcons";
import ButtonPrintQuiz from "./ButtonPrintQuiz";
import LogoImage from "@/public/logo.png";
import ButtonIcon from "@/components/ButtonIcon";

export default function Quiz({
  quiz: { id, title },
  printable = false,
  updateable = false,
  onUpdate,
}: {
  quiz: QuizType;
  printable?: boolean;
  updateable?: boolean;
  onUpdate?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 superficial p-2 rounded-xl bg-white">
      <NextLink
        href={`/quizzes/${id}`}
        className="grow flex items-center gap-2 reset-link"
      >
        <span>{typeIcons.Data}</span>
        <div>
          <div>{title}</div>
          <div className="flex items-center gap-1 text-sm">
            <div className="text-slate-700">Presented by</div>
            <Image src={LogoImage} className="w-3" alt="Logo" />
            <div className="text-cyan-700 font-extrabold">DocReader Guide</div>
          </div>
        </div>
      </NextLink>
      {printable && <ButtonPrintQuiz id={id} title={title} />}
      {updateable && (
        <ButtonIcon
          icon="pencil-square"
          onClick={() => onUpdate && onUpdate()}
        />
      )}
    </div>
  );
}
