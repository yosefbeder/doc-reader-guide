"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Logo from "@/public/logo.png";

export default function LoginPage() {
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
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
    >
      <main className="max-w-lg max-[512px]:m-0 max-[512px]:rounded-none max-[512px]:border-none max-[512px]:min-h-screen mx-auto my-8 p-8 flex flex-col items-center gap-4">
        <Image src={Logo} width={128} alt="Logo" />
        <span className="text-4xl font-extrabold text-cyan-700 -mb-4">
          DocReader Guide
        </span>
        <h1 className="font-bold text-cyan-600">Login</h1>
        <GoogleLogin
          text="continue_with"
          shape="circle"
          onSuccess={onSuccess}
          onError={onError}
        />
      </main>
    </GoogleOAuthProvider>
  );
}
