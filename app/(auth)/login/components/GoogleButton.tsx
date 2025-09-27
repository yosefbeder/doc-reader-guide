"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { logEvent } from "@/lib/event-logger";
import { Action, Resource } from "@/types";
import Message from "@/components/Message";
import { useState } from "react";

export default function GoogleButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [errors, setErrors] = useState<string[]>([]);

  const onSuccess = (credentialResponse: any) => {
    console.log("Login Success:", credentialResponse);

    // Get the ID token from the response
    const id_token = credentialResponse.credential;

    // Send the ID token to your backend
    sendTokenToBackend(id_token);
  };

  const onError = () => {
    setErrors((prev) => [...prev, "Login Failed"]);
  };

  const sendTokenToBackend = async (id_token: string) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/continueWithGoogle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id_token }),
        }
      );

      const json = await response.json();
      console.log("Backend response:", json);

      const user = json.data.user;

      if (user.yearId === null) localStorage.setItem("select-class", "true");

      Cookies.remove("guest");
      localStorage.setItem("user-id", user.id);
      logEvent(Resource.USER, user.id, Action.LOGIN, {});
      router.replace(redirect ?? "/");

      // Handle the backend's response (e.g., store a session token, redirect the user)
      if (response.ok) {
        // Example: Redirect or update UI
        console.log("User authenticated successfully on the backend!");
      } else {
        setErrors((prev) => [
          ...prev,
          "Authentication failed on the backend: " + JSON.stringify(json),
        ]);
      }
    } catch (error) {
      setErrors((prev) => [
        ...prev,
        "Error sending token to backend: " + JSON.stringify(error),
      ]);
    }
  };

  return (
    <>
      {errors.length > 0 && (
        <ul className="col">
          {errors.map((error) => (
            <li key={error}>
              <Message type="fail">{error}</Message>
            </li>
          ))}
        </ul>
      )}
      <GoogleLogin
        text="continue_with"
        shape="circle"
        onSuccess={onSuccess}
        onError={onError}
      />
    </>
  );
}
