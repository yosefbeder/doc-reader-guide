import Image from "next/image";

import Logo from "@/public/logo.png";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Suspense } from "react";
import GoogleButton from "./components/GoogleButton";

export default function LoginPage() {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
    >
      <Suspense>
        <main className="my-8 mx-auto max-w-xl col items-center">
          <Image src={Logo} width={128} alt="Logo" />
          <span className="text-4xl font-extrabold text-cyan-700">
            DocReader Guide
          </span>
          <GoogleButton />
        </main>
      </Suspense>
    </GoogleOAuthProvider>
  );
}
