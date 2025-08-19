import React from "react";

export default function Tooltip({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <div className="bottom-center hidden group-hover:block border-x-4 border-b-4 border-x-transparent border-b-slate-700" />
      <div className="bottom-center translate-y-1 hidden group-hover:block rounded w-max px-1 py-0.5 bg-slate-700 text-slate-50 text-sm text-center">
        {content}
      </div>
      {children}
    </div>
  );
}
