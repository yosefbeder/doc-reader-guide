import { Link as LinkType } from "@/types";
import { typeIcons } from "./typeIcons";
import ButtonIcon from "@/components/ButtonIcon";

export default function Link({
  link: { title, subTitle, type, url },
  updateable = false,
  onUpdate,
}: {
  link: LinkType;
  updateable?: boolean;
  onUpdate?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 floating">
      <a
        className="grow flex items-center gap-2 reset-link"
        target="_blank"
        href={url}
      >
        {typeIcons[type]}
        {subTitle && subTitle.trim() ? (
          <div>
            <div>{title}</div>
            <div className="text-sm text-slate-500">{subTitle}</div>
          </div>
        ) : (
          title
        )}
      </a>
      {updateable && (
        <ButtonIcon
          icon="pencil-square"
          onClick={() => onUpdate && onUpdate()}
        />
      )}
    </div>
  );
}
