"use client";

type DateFilter = "yesterday" | "today" | "tomorrow" | "custom";

function DateRadio({
  value,
  dateFilter,
  setDateFilter,
}: {
  value: DateFilter;
  dateFilter?: DateFilter;
  setDateFilter: (v: any) => void;
}) {
  const iconMap = {
    yesterday: icons["arrow-uturn-left"],
    today: icons["calendar-micro"],
    tomorrow: icons["arrow-uturn-right"],
    custom: icons["calendar-date-range"],
  };
  const labelMap = {
    yesterday: "Yesterday",
    today: "Today",
    tomorrow: "Tomorrow",
    custom: "Custom",
  };
  return (
    <button
      type="button"
      className={`radio p-1 flex items-center gap-1 text-sm ${
        dateFilter === value ? "selected" : "normal"
      }`}
      onClick={() => {
        const nextDateFilter = dateFilter === value ? undefined : value;
        setDateFilter(nextDateFilter);
        if (nextDateFilter && nextDateFilter !== "custom") {
          logEvent(Resource.LECTURE, null, Action.APPLY_FILTER, {
            filterType: nextDateFilter,
          });
        }
      }}
    >
      {iconMap[value]}
      {labelMap[value]}
    </button>
  );
}

import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

import { Action, Lecture, Resource } from "@/types";
import SearchNavButton from "./SearchNavButton";
import SearchDialogue from "./SearchDialogue";
import Searchbar from "./Searchbar";
import LecturesList from "./LecturesList";
import { icons } from "./icons";
import { logEvent } from "@/lib/event-logger";

function getDate(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export default function Search({ yearId }: { yearId: number }) {
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>();
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const fetcher = useCallback(
    async function ([
      search,
      dateFilter,
      customStart,
      customEnd,
    ]: string[]): Promise<Lecture[] | undefined> {
      let startDate = "";
      let endDate = "";
      if (dateFilter === "yesterday") {
        startDate = endDate = getDate(-1);
      } else if (dateFilter === "today") {
        startDate = endDate = getDate(0);
      } else if (dateFilter === "tomorrow") {
        startDate = endDate = getDate(1);
      } else if (dateFilter === "custom") {
        startDate = customStart;
        endDate = customEnd;
      }
      if (!dateFilter && search.length < 3) return;
      if (dateFilter === "custom" && (!startDate || !endDate)) return [];
      let url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/years/${yearId}/lectures?search=${
        search ? encodeURIComponent(search) : ""
      }`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      const res = await fetch(url, { credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      const lectures = json.data.lectures;

      await logEvent(Resource.LECTURE, null, Action.SEARCH, {
        query: search || null,
        filters: {
          type: dateFilter || null,
          startDate: startDate || null,
          endDate: endDate || null,
        },
        resultsCount: lectures?.length ?? 0,
      });

      return lectures;
    },
    [yearId]
  );

  const {
    data: lectures,
    isLoading,
    error,
  } = useSWR([search, dateFilter, customStart, customEnd], fetcher);

  useEffect(() => {
    setSearch("");
  }, [isSearching]);

  useEffect(() => {
    if (dateFilter === "custom" && customStart && customEnd) {
      logEvent(Resource.LECTURE, null, Action.APPLY_FILTER, {
        filterType: "custom",
        start: customStart,
        end: customEnd,
      });
    }
    if (dateFilter !== "custom") {
      setCustomStart("");
      setCustomEnd("");
    }
  }, [dateFilter]);

  let content;
  if (yearId === -1) content = "Select class first";
  else if (error) content = "Error";
  else if (!isLoading && !lectures && !dateFilter)
    content = "Type at least 3 characters";
  else if (isLoading || lectures)
    content = (
      <LecturesList
        lectures={lectures}
        search={search}
        onClose={() => setIsSearching(false)}
      />
    );

  return (
    <>
      <SearchNavButton onClick={() => setIsSearching(true)} />
      {isSearching && (
        <SearchDialogue onClose={() => setIsSearching(false)}>
          <div className="flex flex-col gap-2">
            <Searchbar
              placeholder="Lecture name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2 flex-wrap items-center">
              <DateRadio
                value="yesterday"
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
              />
              <DateRadio
                value="today"
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
              />
              <DateRadio
                value="tomorrow"
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
              />
              <DateRadio
                value="custom"
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
              />
            </div>
            {dateFilter === "custom" && (
              <div className="flex gap-2 text-sm">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  disabled={dateFilter !== "custom"}
                />
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  disabled={dateFilter !== "custom"}
                />
              </div>
            )}
            <p>{content}</p>
          </div>
        </SearchDialogue>
      )}
    </>
  );
}
