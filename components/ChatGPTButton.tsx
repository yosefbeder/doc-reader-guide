"use client";

import Link from "next/link";
import buildChatGPTLink, { customGPTs } from "@/utils/buildChatGPTLink";
import { icons } from "./icons";
import Button from "./Button";

interface ChatGPTButtonProps {
  moduleId: number;
}

export default function ChatGPTButton({ moduleId }: ChatGPTButtonProps) {
  if (!customGPTs.has(moduleId)) {
    return null;
  }

  return (
    <Link
      href={buildChatGPTLink("", moduleId)}
      target="_blank"
      className="fixed bottom-4 right-4"
      aria-label="Ask ChatGPT"
    >
      <Button className="flex gap-2 items-center">
        {icons["open-ai"]} Ask ChatGPT
      </Button>
    </Link>
  );
}
