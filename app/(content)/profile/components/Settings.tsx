import React, { useState } from "react";
import ToggleNotifications from "./ToggleNotifications";
import { SummaryDetail } from "@/components/SummaryDetail";
import Toggle from "@/components/Toggle";
import useSettings, { Settings as SettingsType } from "@/lib/hooks/useSettings";

// const sections: (keyof SettingsType)[] = [
//   "notifications",
//   "mcqQuiz",
//   "writtenQuiz",
// ];

// const summary = ["Notifications", "MCQ Quiz", "Written Quiz"];

export default function Settings() {
  const [openSection, setOpenSection] = useState<string | undefined>();
  const [settings, setSettings] = useSettings();

  return (
    <>
      <SummaryDetail
        className="w-full"
        open={openSection === "notifications"}
        toggle={() =>
          setOpenSection((prev) =>
            prev === "notifications" ? undefined : "notifications"
          )
        }
      >
        <SummaryDetail.Summary>Notifications</SummaryDetail.Summary>
        <SummaryDetail.Detail>
          <div className="p-2">
            <ToggleNotifications />
          </div>
        </SummaryDetail.Detail>
      </SummaryDetail>

      <SummaryDetail
        className="w-full"
        open={openSection === "mcqQuiz"}
        toggle={() =>
          setOpenSection((prev) => (prev === "mcqQuiz" ? undefined : "mcqQuiz"))
        }
      >
        <SummaryDetail.Summary>MCQ Quiz</SummaryDetail.Summary>
        <SummaryDetail.Detail>
          <ul className="flex flex-col gap-4 p-2">
            <Toggle
              checked={settings.mcqQuiz.shuffle}
              label="Shuffle"
              onClick={() =>
                setSettings(({ mcqQuiz, ...rest }) => ({
                  ...rest,
                  mcqQuiz: { ...mcqQuiz, shuffle: !mcqQuiz.shuffle },
                }))
              }
            />
            <Toggle
              checked={settings.mcqQuiz.autoMove}
              label="Auto move"
              onClick={() =>
                setSettings(({ mcqQuiz, ...rest }) => ({
                  ...rest,
                  mcqQuiz: { ...mcqQuiz, autoMove: !mcqQuiz.autoMove },
                }))
              }
            />
            <Toggle
              checked={settings.mcqQuiz.sounds}
              label="Sounds"
              onClick={() =>
                setSettings(({ mcqQuiz, ...rest }) => ({
                  ...rest,
                  mcqQuiz: { ...mcqQuiz, sounds: !mcqQuiz.sounds },
                }))
              }
            />
            <Toggle
              checked={settings.mcqQuiz.instantFeedback}
              label="Instant feedback"
              onClick={() =>
                setSettings(({ mcqQuiz, ...rest }) => ({
                  ...rest,
                  mcqQuiz: {
                    ...mcqQuiz,
                    instantFeedback: !mcqQuiz.instantFeedback,
                  },
                }))
              }
            />
          </ul>
        </SummaryDetail.Detail>
      </SummaryDetail>

      <SummaryDetail
        className="w-full"
        open={openSection === "writtenQuiz"}
        toggle={() =>
          setOpenSection((prev) =>
            prev === "writtenQuiz" ? undefined : "writtenQuiz"
          )
        }
      >
        <SummaryDetail.Summary>Written Quiz</SummaryDetail.Summary>
        <SummaryDetail.Detail>
          <ul className="flex flex-col gap-4 p-2">
            <Toggle
              checked={settings.writtenQuiz.shuffle}
              label="Shuffle"
              onClick={() =>
                setSettings(({ writtenQuiz, ...rest }) => ({
                  ...rest,
                  writtenQuiz: {
                    ...writtenQuiz,
                    shuffle: !writtenQuiz.shuffle,
                  },
                }))
              }
            />
            <Toggle
              checked={settings.writtenQuiz.sounds}
              label="Sounds"
              onClick={() =>
                setSettings(({ writtenQuiz, ...rest }) => ({
                  ...rest,
                  writtenQuiz: {
                    ...writtenQuiz,
                    sounds: !writtenQuiz.sounds,
                  },
                }))
              }
            />
          </ul>
        </SummaryDetail.Detail>
      </SummaryDetail>
    </>
  );
}
