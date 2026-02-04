"use client";

import { useCallback, useState } from "react";
import Dialogue from "./Dialogue";
import { useOfflineMedia } from "@/lib/hooks/useOfflineMedia";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import ButtonIcon from "./ButtonIcon";
import Link from "next/link";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
  wasmUrl: "/wasm/",
};

const resizeObserverOptions = {};

export default function PdfViewerDialogue({
  url,
  title,
  linkId,
  onClose,
}: {
  url: string;
  title: string;
  linkId: number;
  onClose: () => void;
}) {
  const { resolvedUrl } = useOfflineMedia(url, linkId);
  const activeUrl = resolvedUrl || url;
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <Dialogue
      header={title}
      onClose={onClose}
      size="lg"
      className="rounded-xl col"
    >
      <Link href={activeUrl} target="_blank" download>
        <ButtonIcon icon="folder" />
      </Link>
      <div ref={setContainerRef}>
        <Document
          file={activeUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
        >
          {Array.from(new Array(numPages), (_el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={containerWidth}
            />
          ))}
        </Document>
      </div>
    </Dialogue>
  );
}
