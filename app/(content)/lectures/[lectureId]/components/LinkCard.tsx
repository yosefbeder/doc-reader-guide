"use client";

import { Action, Link, Resource } from "@/types";
import { typeIcons } from "./typeIcons";
import ButtonIcon from "@/components/ButtonIcon";
import getPrefix from "@/utils/getPrefix";
import { logEvent } from "@/lib/event-logger";

export default function LinkCard({
  link: { id, title, subTitle, type, urls },
  updateable = false,
  onUpdate,
}: {
  link: Link;
  updateable?: boolean;
  onUpdate?: () => void;
}) {
  return (
    <div
      className={`flex flex-col rounded-xl layer-1 ${
        urls.length === 1 ? "clickable" : ""
      }`}
    >
      <div
        onClick={() => {
          if (urls.length === 1) {
            window.open(urls[0], "_blank");
            logEvent(Resource.LINK, id, Action.NAVIGATE, { url: urls[0] });
          }
        }}
        className={`w-full flex items-center gap-2 p-2 ${
          urls.length === 1 ? "cursor-pointer" : ""
        }`}
      >
        <div className="w-max">{typeIcons[type]}</div>
        <div className="grow">
          {subTitle?.trim() ? (
            <>
              <div>{title}</div>
              <div className="text-sm text-slate-500 dark:text-slate-300">
                {subTitle}
              </div>
            </>
          ) : (
            title
          )}
        </div>
        {updateable && (
          <ButtonIcon
            icon="pencil-square"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onUpdate && onUpdate();
            }}
          />
        )}
      </div>
      {urls.length > 1 && (
        <ul className="w-full rounded-b-xl flex items-center gap-4 px-4 py-1 bg-cyan-600 text-white underline">
          {urls.map((url, index) => (
            <li key={index}>
              <a
                href={url}
                target="_blank"
                onClick={() =>
                  logEvent(Resource.LINK, id, Action.NAVIGATE, { url })
                }
              >
                {index + 1}
                <sup>{getPrefix(index + 1)}</sup>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
