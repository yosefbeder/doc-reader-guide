"use client";

import { SWRConfig } from "swr";

export default function SWRWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        onErrorRetry: (_error, _key, _config, revalidate, { retryCount }) => {
          if (retryCount >= 3) return;
          setTimeout(() => revalidate({ retryCount }), 2500);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
