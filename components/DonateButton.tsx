"use client";

import React, { useState } from "react";
import Dialogue from "./Dialogue";
import { icons } from "./icons";
import Button from "./Button";

const Vodafone = () => (
  <svg
    fill="currentColor"
    className="size-6 inline-block"
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Vodafone</title>
    <path d="M12 0A12 12 0 0 0 0 12A12 12 0 0 0 12 24A12 12 0 0 0 24 12A12 12 0 0 0 12 0M16.25 1.12C16.57 1.12 16.9 1.15 17.11 1.22C14.94 1.67 13.21 3.69 13.22 6C13.22 6.05 13.22 6.11 13.23 6.17C16.87 7.06 18.5 9.25 18.5 12.28C18.54 15.31 16.14 18.64 12.09 18.65C8.82 18.66 5.41 15.86 5.39 11.37C5.38 8.4 7 5.54 9.04 3.85C11.04 2.19 13.77 1.13 16.25 1.12Z" />
  </svg>
);

export default function DonateButton({
  lang,
  className,
}: {
  lang: "en" | "ar";
  className?: string;
}) {
  const isAr = lang === "ar";
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const phoneNumber = "01025652828";

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        color="pink"
        className={`flex gap-2 items-center ${className}`}
        onClick={() => setDialogueOpen(true)}
      >
        <span>{icons["heart"]}</span>
        <span>{isAr ? "تبرع الآن" : "Donate now"}</span>
      </Button>
      {dialogueOpen && (
        <Dialogue
          header={isAr ? "تبرع الآن" : "Donate Now"}
          className="rounded-xl flex flex-col gap-2 max-[512px]:gap-4"
          onClose={() => setDialogueOpen(false)}
        >
          <h2 className="max-[512px]:hidden">
            {isAr ? "تبرع الآن" : "Donate Now"}
          </h2>
          <div>
            {isAr ? "قم بإرسال المال عبر " : "Send us via "}
            <span className="text-[#E60000] font-medium font-sans">
              <Vodafone /> Vodafone Cash
            </span>{" "}
            {isAr ? "على الرقم التالي:" : "on the following number:"}
          </div>
          <div className="flex items-center gap-4">
            <div className="font-mono">{phoneNumber}</div>
            <button
              onClick={handleCopy}
              aria-label={isAr ? "نسخ الرقم" : "Copy phone number"}
            >
              {copied ? icons["check"] : icons["clipboard-document-list"]}
            </button>
          </div>
        </Dialogue>
      )}
    </>
  );
}
