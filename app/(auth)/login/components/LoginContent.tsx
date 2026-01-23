"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/public/logo.png";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Suspense } from "react";
import GoogleButton from "./GoogleButton";
import Message from "@/components/Message";

function isInAppBrowser() {
  const ua = navigator.userAgent || navigator.vendor;

  return (
    /Telegram/i.test(ua) ||
    /FBAN|FBAV/i.test(ua) ||
    /Instagram/i.test(ua) ||
    /Twitter/i.test(ua) ||
    /LinkedIn/i.test(ua) ||
    /Snapchat/i.test(ua) ||
    /TikTok/i.test(ua) ||
    /Line/i.test(ua) ||
    /WeChat/i.test(ua) ||
    /WhatsApp/i.test(ua) ||
    /GSA/i.test(ua) ||
    /\bwv\b/.test(ua)
  );
}

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
          {isInAppBrowser() && (
            <Message type="warning">
              Please tap the three dots (⋮) and select &quot;Open in
              Chrome/Safari&quot;. Some in-app browsers block Google.
            </Message>
          )}
          <GoogleButton scriptLoaded={scriptLoaded} scriptError={scriptError} />
          <Link href="/" className="link">
            ← Back to Home
          </Link>
        </main>
      </Suspense>
    </GoogleOAuthProvider>
  );
}
