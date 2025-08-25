"use client";

import useSWR from "swr";
import { useCallback, useEffect, useState } from "react";

import Button from "@/components/Button";
import User from "./components/User";
import { User as UserType } from "@/types";
import Searchbar from "@/components/Searchbar";
import { useHotkeys } from "react-hotkeys-hook";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

const pageSize = 10;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(-1);
  const { data, error, mutate, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/users?page=${page}&search=${search}&size=${pageSize}`,
    fetcher
  );
  const [pagesNumber, setPagesNumber] = useState(0);
  const backPage = useCallback(() => {
    if (page > 1) setPage((p) => p - 1);
  }, [page]);
  const nextPage = useCallback(() => {
    if (page < pagesNumber) setPage((p) => p + 1);
  }, [page]);
  useHotkeys("left", backPage, [backPage]);
  useHotkeys("right", nextPage, [nextPage]);

  useEffect(() => {
    if (data) setPagesNumber(Math.ceil(data.totalCount / pageSize));
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (error)
    return (
      <main className="main">
        <p className="text-red-500">Failed to load users</p>
      </main>
    );

  return (
    <main className="main">
      <Searchbar
        placeholder="Email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-4">
          {data?.data?.users.map((user: UserType, index: number) => (
            <li key={user.id}>
              <User
                search={search}
                users={data?.data.users}
                index={index}
                mutate={mutate}
                onUpdate={() =>
                  setCurrent((prev) => (prev === user.id ? -1 : user.id))
                }
                isUpdating={user.id === current}
              />
            </li>
          ))}
        </ul>
      )}

      {data && (
        <div className="flex justify-between items-center mt-4">
          <Button onClick={backPage} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-base text-slate-500">
            <select
              onChange={(e) => {
                setPage(+e.target.value);
              }}
              value={page}
            >
              {Array.from({ length: pagesNumber }).map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>{" "}
            / {pagesNumber}
          </span>
          <Button onClick={nextPage} disabled={page === pagesNumber}>
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
