"use client";

import { Toaster } from "sonner";
import useSettings from "@/lib/hooks/useSettings";

export default function ThemeToaster() {
  const { currentTheme } = useSettings();

  return <Toaster theme={currentTheme} />;
}
