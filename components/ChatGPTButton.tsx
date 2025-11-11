"use client";

import Link from "next/link";
import buildChatGPTLink from "@/utils/buildChatGPTLink";
import { icons } from "./icons";
import Button from "./Button";

interface ChatGPTButtonProps {
  customGPT: string | null;
}

export default function ChatGPTButton({ customGPT }: ChatGPTButtonProps) {
  if (!customGPT) return null;

  return (
    <Link
      href={buildChatGPTLink("", customGPT)}
      target="_blank"
      className="fixed bottom-4 right-4 z-10"
      aria-label="Ask ChatGPT"
    >
      <Button className="flex gap-2 items-center">
        {icons["open-ai"]} Ask ChatGPT
      </Button>
    </Link>
  );
}
