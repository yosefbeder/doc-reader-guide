"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/public/logo.png";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Suspense } from "react";
import GoogleButton from "./GoogleButton";

export default function LoginContent() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
      onScriptLoadSuccess={() => setScriptLoaded(true)}
      onScriptLoadError={() => setScriptError(true)}
    >
      <Suspense>
        <main className="my-8 mx-auto max-w-xl col items-center">
          <Image src={Logo} width={128} alt="Logo" />
          <span className="text-4xl font-extrabold text-cyan-700 dark:text-cyan-500">
            DocReader Guide
          </span>

          <GoogleButton scriptLoaded={scriptLoaded} scriptError={scriptError} />
          <Link href="/" className="link">
            ← Back to Home
          </Link>
        </main>
      </Suspense>
    </GoogleOAuthProvider>
  );
}
