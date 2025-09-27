import { useEffect, useState, useCallback } from "react";
import { logEvent } from "../event-logger";
import { Action } from "@/types";

export interface Settings {
  appearance: {
    theme: "light" | "dark" | "system";
  };
  notifications: {
    allowed: boolean;
  };
  mcqQuiz: {
    shuffle: boolean;
    autoMove: boolean;
    sounds: boolean;
    instantFeedback: boolean;
  };
  writtenQuiz: {
    shuffle: boolean;
    sounds: boolean;
  };
}

export const DEFAULT_SETTINGS: Settings = {
  appearance: { theme: "system" },
  notifications: { allowed: false },
  mcqQuiz: {
    shuffle: false,
    autoMove: false,
    sounds: true,
    instantFeedback: true,
  },
  writtenQuiz: {
    shuffle: true,
    sounds: true,
  },
};

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem("settings");
    return stored
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings());
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyTheme = (theme: "light" | "dark" | "system") => {
      const html = document.documentElement;
      html.classList.remove("light", "dark");

      if (theme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const newTheme = prefersDark ? "dark" : "light";
        html.classList.add(newTheme);
        setCurrentTheme(newTheme);
      } else {
        html.classList.add(theme);
      }
    };

    applyTheme(settings.appearance.theme);

    if (settings.appearance.theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [settings.appearance.theme]);

  const updateSetting = useCallback(
    <T extends keyof Settings, K extends keyof Settings[T]>(
      section: T,
      key: K,
      newValue: Settings[T][K]
    ) => {
      const oldValue = settings[section][key];
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: newValue,
        },
      }));

      logEvent(null, null, Action.TOGGLE_SETTING, {
        section,
        settingName: key,
        oldValue,
        newValue,
      });
    },
    [settings]
  );

  return { settings, updateSetting, currentTheme };
}
