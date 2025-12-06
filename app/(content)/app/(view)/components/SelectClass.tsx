"use client";

import React from "react";
import useSWR from "swr";

import PersonalInfoForm from "@/components/PersonalInfoForm";
import getFaculties from "@/utils/getFaculties";
import getUser from "@/utils/getUserClient";

export default function SelectClass() {
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useSWR("user", getUser);
  const {
    data: faculties,
    isLoading: areFacultiesLoading,
    error: facultiesError,
  } = useSWR("faculties", getFaculties);
  return (
    <main className="main">
      {isUserLoading || areFacultiesLoading ? (
        <p>Loading...</p>
      ) : userError || facultiesError ? (
        <p>Error</p>
      ) : null}
      {user && faculties && (
        <PersonalInfoForm
          user={user}
          faculties={faculties}
          buttonLabel="Select"
        />
      )}
    </main>
  );
}
