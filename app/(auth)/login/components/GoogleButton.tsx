"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { logEvent } from "@/lib/event-logger";
import { Action, FormStateType, Resource } from "@/types";
import Message from "@/components/Message";
import { useState } from "react";
import useSettings from "@/lib/hooks/useSettings";

export default function GoogleButton() {
  const { currentTheme } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [messages, setMessages] = useState<
    {
      type: FormStateType;
      content: string;
    }[]
  >([]);

  const onSuccess = (credentialResponse: any) => {
    // Get the ID token from the response
    const id_token = credentialResponse.credential;

    // Send the ID token to your backend
    sendTokenToBackend(id_token);
  };

  const onError = () => {
    setMessages((prev) => [...prev, { type: "fail", content: "Login Failed" }]);
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

      if (response.ok) {
        const user = json.data.user;
        if (user.yearId === null) localStorage.setItem("select-class", "true");
        Cookies.remove("guest");
        localStorage.setItem("user-id", user.id);
        logEvent(Resource.USER, user.id, Action.LOGIN, {});
        setMessages((prev) => [
          ...prev,
          {
            type: "success",
            content: "Authentication succeeded!\nRedirecting...",
          },
        ]);
        router.replace(redirect ?? "/");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "fail",
            content:
              "Authentication failed on the backend:\n" +
              JSON.stringify(json, null, 2),
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "fail",
          content:
            "Error sending token to backend:\n" +
            JSON.stringify(error, null, 2),
        },
      ]);
    }
  };

  return (
    <>
      {messages.length > 0 && (
        <ul className="col w-full px-2 items-center">
          {messages.map((message) => (
            <li key={message.content}>
              <Message
                className="whitespace-pre overflow-scroll"
                type={message.type}
              >
                {message.content}
              </Message>
            </li>
          ))}
        </ul>
      )}
      <GoogleLogin
        text="continue_with"
        shape="circle"
        onSuccess={onSuccess}
        onError={onError}
        theme={currentTheme === "dark" ? "filled_black" : "outline"}
      />
    </>
  );
}
