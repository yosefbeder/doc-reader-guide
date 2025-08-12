"use client";

import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";

import { Lecture } from "@/types";
import SearchNavButton from "./SearchNavButton";
import SearchDialogue from "./SearchDialogue";
import Searchbar from "./Searchbar";
import LecturesList from "./LecturesList";

export default function Search({ yearId }: { yearId: number }) {
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const fetcher = useCallback(
    async function (search: string): Promise<Lecture[] | undefined> {
      if (search.length < 3) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/years/${yearId}/lectures?search=${search}&size=100`,
        {
          credentials: "include",
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json.data.lectures;
    },
    [yearId]
  );
  const { data: lectures, isLoading, error } = useSWR(search, fetcher);

  useEffect(() => {
    setSearch("");
  }, [isSearching]);

  let content;
  if (yearId === -1) content = "Select class first";
  else if (error) content = "Error";
  else if (!isLoading && !lectures) content = "Type at least 3 characters";
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
          <Searchbar
            placeholder="Lecture name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p>{content}</p>
        </SearchDialogue>
      )}
    </>
  );
}
