import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { FormState, Link, Quiz } from "@/types";
import disableNotifications from "@/utils/disableNotifications";
import allowNotifications from "@/utils/allowNotifications";
import { useSWRConfig } from "swr";

export function useAddForm(formState: FormState) {
  const [hideMessage, setHideMessage] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    setHideMessage(false);
    if (formState.type === "success") setFormKey(formState.resetKey!);
  }, [formState.resetKey]);

  return { hideMessage, setHideMessage, formKey };
}

export function useUpdateDeleteForms(
  updateFormState: FormState,
  deleteFormState: FormState
) {
  const [hideMessage, setHideMessage] = useState(false);

  useEffect(
    () => setHideMessage(false),
    [updateFormState.resetKey, deleteFormState.resetKey]
  );

  return { hideMessage, setHideMessage };
}

export function useNotifications() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const toggle = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAllowed) {
        await disableNotifications();
        setIsAllowed(false);
      } else {
        const permission =
          Notification.permission === "granted"
            ? Notification.permission
            : await Notification.requestPermission();
        if (permission !== "granted")
          throw new Error("Notifications permission denied");
        await allowNotifications();
        setIsAllowed(true);
      }
      setError("");
      location.reload();
    } catch (err) {
      setError((err as Error).message);
    }
    setIsLoading(false);
  }, [isAllowed]);

  useEffect(() => {
    setIsMounted(true);
    if (!("Notification" in window)) {
      setIsSupported(false);
      return;
    }
    if (localStorage.getItem("notifications-status") === "allowed")
      setIsAllowed(true);
  }, []);

  return { isMounted, isAllowed, isSupported, isLoading, error, toggle };
}

export function useLogout() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  return async () => {
    try {
      if (localStorage.getItem("notifications-status") === "allowed") {
        await disableNotifications();
      }
      Cookies.remove("jwt");
      localStorage.removeItem("notifications-toast-denied");
      await mutate(() => true, undefined, { revalidate: false });
      router.replace("/login");
    } catch (err) {
      console.error(err);
    }
  };
}

export function useCategories(links: Link[], quizzes: Quiz[]) {
  const categories = useMemo(() => {
    const temp = [];
    if (links.find((link) => link.category === "Data")) temp.push("Data");
    if (links.find((link) => link.category === "College")) temp.push("College");
    if (links.find((link) => link.category === "Summary")) temp.push("Summary");
    if (
      quizzes.length > 0 ||
      links.find((link) => link.category === "Questions")
    )
      temp.push("Questions");
    return temp;
  }, [links, quizzes]);
  const [currentCategory, setCurrentCategory] = useState<number>();

  return { categories, currentCategory, setCurrentCategory };
}
