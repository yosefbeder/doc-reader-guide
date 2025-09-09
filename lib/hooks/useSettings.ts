import { useEffect, useState, useCallback } from "react";
import { logEvent } from "../event-logger";
import { Action, Resource } from "@/types";

export interface Settings {
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

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

  return { settings, updateSetting };
}
