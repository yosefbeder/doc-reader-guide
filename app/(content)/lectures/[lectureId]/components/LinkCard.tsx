"use client";

import { Action, Link, Resource } from "@/types";
import { typeIcons } from "./typeIcons";
import ButtonIcon from "@/components/ButtonIcon";
import dynamic from "next/dynamic";

import { logEvent } from "@/lib/event-logger";
import { useState, useRef, useEffect } from "react";
import { icons } from "@/components/icons";
import getPrefix from "@/utils/getPrefix";
import { useOfflineMedia } from "@/lib/hooks/useOfflineMedia";
import AudioPlayerDialogue from "@/components/AudioPlayerDialogue";
import DocReaderBadge from "@/components/DocReaderBadge";

const PdfViewerDialogue = dynamic(
  () => import("@/components/PdfViewerDialogue"),
  { ssr: false }
);

const R2_URL = process.env.NEXT_PUBLIC_R2_URL || "";

function SmartLinkAction({ url }: { url: string }) {
  const isR2 = R2_URL && url.includes(R2_URL);
  const { isDownloaded, isLoading, download, deleteFile } = useOfflineMedia(
    isR2 ? url : undefined
  );

  if (!isR2) return <span>{icons["arrow-top-right-on-square"]}</span>;

  if (isDownloaded) {
    return (
      <ButtonIcon
        icon="trash"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          deleteFile();
        }}
      />
    );
  }

  return (
    <ButtonIcon
      icon="arrow-down-tray"
      disabled={isLoading}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        download();
      }}
    />
  );
}

const getMediaType = (url: string) => {
  if (url.match(/\.(mp3|wav|ogg|m4a)$/i)) return "audio";
  if (url.match(/\.pdf$/i)) return "pdf";
  return null;
};

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

  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [part, setPart] = useState<number | null>(null);
  const [viewerType, setViewerType] = useState<"audio" | "pdf" | null>(null);

  const handleLinkClick = (url: string, part: number | null = null) => {
    const isR2 = R2_URL && url.includes(R2_URL);
    if (isR2) {
      const mType = getMediaType(url);
      if (mType) {
        logEvent(Resource.LINK, id, Action.NAVIGATE, { url });
        setViewerUrl(url);
        setViewerType(mType);
        setPart(part);
        return;
      }
    }
    window.open(url, "_blank", "noopener noreferrer");
    logEvent(Resource.LINK, id, Action.NAVIGATE, { url });
  };

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

  const singleUrl = urls.length === 1 ? urls[0] : null;
  const isSingleR2 = singleUrl && R2_URL && singleUrl.includes(R2_URL);

  return (
    <>
      <div ref={containerRef}>
        <div
          role="button"
          tabIndex={0}
          className="w-full flex items-center gap-2 p-2 rounded-xl layer-1 clickable cursor-pointer"
          onClick={() => {
            if (singleUrl) handleLinkClick(singleUrl);
            else setIsOpen(!isOpen);
          }}
        >
          <span>{typeIcons[type]}</span>
          <div className="text-left grow">
            {subTitle?.trim() ? (
              <>
                <div>{title}</div>
                <div className="caption">
                  {subTitle}
                  {isSingleR2 && " - "}
                  {isSingleR2 && <DocReaderBadge />}
                </div>
              </>
            ) : isSingleR2 ? (
              <>
                <div>{title}</div>
                <div className="caption">
                  <DocReaderBadge />
                </div>
              </>
            ) : (
              title
            )}
          </div>
          {singleUrl && <SmartLinkAction url={singleUrl} />}
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
        {isOpen && urls.length > 1 && (
          <div className="flex flex-col p-2 gap-2 rounded-xl layer-1 mt-2">
            {urls.map((url, index) => {
              const isR2 = R2_URL && url.includes(R2_URL);
              return (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    handleLinkClick(url, index + 1);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-start gap-1">
                    <div>
                      {index + 1}
                      <sup>{getPrefix(index + 1)}</sup> Part
                    </div>
                    {isR2 && (
                      <div className="caption">
                        <DocReaderBadge />
                      </div>
                    )}
                  </div>
                  <SmartLinkAction url={url} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {viewerUrl && viewerType === "audio" && (
        <AudioPlayerDialogue
          url={viewerUrl}
          title={
            <>
              {title}
              {part ? (
                <>
                  {" "}
                  {part}
                  <sup>{getPrefix(part)}</sup> Part
                </>
              ) : null}
            </>
          }
          id={id + "-" + viewerUrl}
          onClose={() => {
            setViewerUrl(null);
            setViewerType(null);
            setPart(null);
          }}
        />
      )}
      {viewerUrl && viewerType === "pdf" && (
        <PdfViewerDialogue
          url={viewerUrl}
          title={title}
          onClose={() => {
            setViewerUrl(null);
            setViewerType(null);
          }}
        />
      )}
    </>
  );
}
