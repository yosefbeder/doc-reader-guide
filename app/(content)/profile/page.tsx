"use client";

import useSWR from "swr";

import LogoutButton from "./components/LogoutButton";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import getUser from "@/utils/getUserClient";
import getFaculties from "@/utils/getFaculties";
import ToggleNotifications from "./components/ToggleNotifications";
import Layout from "@/components/Layout";
import { SummaryDetail } from "@/components/SummaryDetail";
import Settings from "./components/Settings";

export default function ProfilePage() {
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
    <Layout title="Profile" border>
      <main className="main">
        <div className="max-w-md flex flex-col gap-4 items-start">
          <h2>Settings</h2>
          <Settings />
          <h2>Account</h2>
          {isUserLoading || areFacultiesLoading ? (
            <p>Loading...</p>
          ) : userError || facultiesError ? (
            <p>Error</p>
          ) : null}
          {user && faculties ? (
            <PersonalInfoForm
              user={user}
              faculties={faculties}
              buttonLabel="Update"
            />
          ) : null}
          <LogoutButton />
        </div>
      </main>
    </Layout>
  );
}
