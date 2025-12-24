"use client";

import { Action, Link, Resource } from "@/types";
import { typeIcons } from "./typeIcons";
import ButtonIcon from "@/components/ButtonIcon";

import { logEvent } from "@/lib/event-logger";
import { useState, useRef, useEffect } from "react";
import { icons } from "@/components/icons";
import getPrefix from "@/utils/getPrefix";

export default function LinkCard({
  link: { id, title, subTitle, type, urls },
  updateable = false,
  onUpdate,
}: {
  link: Link;
  updateable?: boolean;
  onUpdate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <button
        className="w-full flex items-center gap-2 p-2 rounded-xl layer-1 clickable"
        onClick={() => {
          if (urls.length === 1) {
            window.open(urls[0], "_blank");
            logEvent(Resource.LINK, id, Action.NAVIGATE, { url: urls[0] });
          } else if (urls.length > 1) {
            setIsOpen(!isOpen);
          }
        }}
      >
        <span>{typeIcons[type]}</span>
        <div className="text-left grow">
          {subTitle?.trim() ? (
            <>
              <div>{title}</div>
              <div className="caption">{subTitle}</div>
            </>
          ) : (
            title
          )}
        </div>
        {urls.length === 1 && <span>{icons["arrow-top-right-on-square"]}</span>}
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
      </button>
      {isOpen && urls.length > 1 && (
        <div className="flex flex-col p-2 gap-2 rounded-xl layer-1 mt-2">
          {urls.map((url, index) => (
            <a
              key={index}
              href={url}
              target="_blank"
              onClick={(e) => {
                logEvent(Resource.LINK, id, Action.NAVIGATE, { url });
                setIsOpen(false);
              }}
              className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <span>
                {index + 1}
                <sup>{getPrefix(index + 1)}</sup> Part
              </span>
              {icons["arrow-top-right-on-square"]}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
