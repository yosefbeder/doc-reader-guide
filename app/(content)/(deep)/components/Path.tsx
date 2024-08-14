import React from "react";

export default function Path({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-cyan-600 text-white text-sm font-bold "
      lang="en"
      dir="ltr"
    >
      <div className="max-w-screen-md px-2 py-1 mx-auto">{children}</div>
    </div>
  );
}
