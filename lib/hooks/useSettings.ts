import { Dispatch, SetStateAction, useEffect, useState } from "react";

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

export default function useSettings(): [
  Settings,
  Dispatch<SetStateAction<Settings>>
] {
  const [settings, setSettings] = useState<Settings>(loadSettings());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!settings) return;
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return [settings, setSettings];
}
