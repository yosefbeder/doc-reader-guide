"use client";

import Cookies from "js-cookie";
import useSWR from "swr";

import LogoutButton from "./components/LogoutButton";
import PersonalInfoForm from "./components/PersonalInfoForm";
import PasswordForm from "./components/PasswordForm";
import getUser from "@/utils/getUser";
import getFaculties from "@/utils/getFaculties";
import ToggleNotifications from "./components/ToggleNotifications";
import Layout from "@/components/Layout";

export default function ProfilePage() {
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useSWR("user", async () => getUser(Cookies.get("jwt")!));
  const {
    data: faculties,
    isLoading: areFacultiesLoading,
    error: facultiesError,
  } = useSWR("faculties", getFaculties);

  return (
    <Layout title="Profile" border>
      <main className="main">
        <div className="max-w-md">
          <h2 className="mb-4">Settings</h2>
          <h3 className="mb-4">Notifications</h3>
          <div className="flex flex-col items-start gap-4 mb-4">
            <ToggleNotifications />
          </div>
          <h2 className="mb-4">Account</h2>
          {isUserLoading || areFacultiesLoading ? (
            <p className="mb-4">Loading...</p>
          ) : userError || facultiesError ? (
            <p className="mb-4">Error</p>
          ) : (
            user &&
            faculties && <PersonalInfoForm faculties={faculties} user={user} />
          )}
          <PasswordForm />
          <LogoutButton className="mb-4" />
        </div>
      </main>
    </Layout>
  );
}
