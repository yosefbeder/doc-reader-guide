"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function GoogleButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const onSuccess = (credentialResponse: any) => {
    console.log("Login Success:", credentialResponse);

    // Get the ID token from the response
    const id_token = credentialResponse.credential;

    // Send the ID token to your backend
    sendTokenToBackend(id_token);
  };

  const onError = () => {
    console.log("Login Failed");
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

      if (json.data.user.yearId === null)
        localStorage.setItem("select-class", "true");

      Cookies.remove("guest");
      router.replace(redirect ?? "/");

      // Handle the backend's response (e.g., store a session token, redirect the user)
      if (response.ok) {
        // Example: Redirect or update UI
        console.log("User authenticated successfully on the backend!");
      } else {
        console.error("Authentication failed on the backend:", json.error);
      }
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
  };

  return (
    <GoogleLogin
      text="continue_with"
      shape="circle"
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}
