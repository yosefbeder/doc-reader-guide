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
  const { settings, updateSetting } = useSettings();

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
          <div className="flex flex-col gap-4 p-2">
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
                updateSetting("mcqQuiz", "shuffle", !settings.mcqQuiz.shuffle)
              }
            />
            <Toggle
              checked={settings.mcqQuiz.autoMove}
              label="Auto move"
              onClick={() =>
                updateSetting("mcqQuiz", "autoMove", !settings.mcqQuiz.autoMove)
              }
            />
            <Toggle
              checked={settings.mcqQuiz.sounds}
              label="Sounds"
              onClick={() =>
                updateSetting("mcqQuiz", "sounds", !settings.mcqQuiz.sounds)
              }
            />
            <Toggle
              checked={settings.mcqQuiz.instantFeedback}
              label="Instant feedback"
              onClick={() =>
                updateSetting(
                  "mcqQuiz",
                  "instantFeedback",
                  !settings.mcqQuiz.instantFeedback
                )
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
                updateSetting(
                  "writtenQuiz",
                  "shuffle",
                  !settings.writtenQuiz.shuffle
                )
              }
            />
            <Toggle
              checked={settings.writtenQuiz.sounds}
              label="Sounds"
              onClick={() =>
                updateSetting(
                  "writtenQuiz",
                  "sounds",
                  !settings.writtenQuiz.sounds
                )
              }
            />
          </ul>
        </SummaryDetail.Detail>
      </SummaryDetail>
    </>
  );
}
