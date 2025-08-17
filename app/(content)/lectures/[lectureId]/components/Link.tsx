import { Link as LinkType } from "@/types";
import { typeIcons } from "./typeIcons";
import ButtonIcon from "@/components/ButtonIcon";
import getPrefix from "@/utils/getPrefix";

export default function Link({
  link: { title, subTitle, type, urls },
  updateable = false,
  onUpdate,
}: {
  link: LinkType;
  updateable?: boolean;
  onUpdate?: () => void;
}) {
  return (
    <div className="flex items-center superficial gap-2 p-2 rounded-xl bg-white">
      {urls.length === 1 ? (
        <a
          className="grow flex items-center gap-2 reset-link"
          target="_blank"
          href={urls[0]}
        >
          {typeIcons[type]}
          {subTitle?.trim() ? (
            <div>
              <div>{title}</div>
              <div className="text-sm text-slate-500">{subTitle}</div>
            </div>
          ) : (
            title
          )}
        </a>
      ) : (
        <>
          <div className="grow flex items-center gap-2">
            {typeIcons[type]}
            {subTitle?.trim() ? (
              <div>
                <div>{title}</div>
                <div className="text-sm text-slate-500">{subTitle}</div>
              </div>
            ) : (
              title
            )}
          </div>
          <ul className="flex items-center gap-2">
            {urls.map((url, index) => (
              <li key={index}>
                <a className="link" href={url} target="_blank">
                  {index + 1}
                  <sup>{getPrefix(index + 1)}</sup>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {updateable && (
        <ButtonIcon
          icon="pencil-square"
          onClick={() => onUpdate && onUpdate()}
        />
      )}
    </div>
  );
}
