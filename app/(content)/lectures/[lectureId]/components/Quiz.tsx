import NextLink from "next/link";
import Image from "next/image";

import { WrittenQuiz, McqQuiz as QuizType } from "@/types";
import ButtonPrintQuiz from "./ButtonPrintQuiz";
import LogoImage from "@/public/logo.png";
import ButtonIcon from "@/components/ButtonIcon";
import { icons } from "@/components/icons";

export default function Quiz({
  quiz: { id, title },
  type,
  printable = false,
  updateable = false,
  onUpdate,
}: {
  quiz: QuizType | WrittenQuiz;
  type: "mcq" | "written";
  printable?: boolean;
  updateable?: boolean;
  onUpdate?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 floating">
      <NextLink
        href={`/${type === "mcq" ? "mcq-quizzes" : "written-quizzes"}/${id}`}
        className="grow flex items-center gap-2"
      >
        <span>{type === "mcq" ? icons["queue-list"] : icons["pencil"]}</span>
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
