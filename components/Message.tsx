import React from "react";

import { FormStateType } from "@/types";

interface MessageProps extends React.ComponentProps<"p"> {
  type: FormStateType;
}

const styles = {
  fail: "bg-red-100 border-red-700 text-red-700 dark:bg-red-900 dark:border-red-200 dark:text-red-200",
  warning:
    "bg-yellow-100 text-yellow-700 border-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-200",
  success:
    "bg-green-100 border-green-700 text-green-700 dark:bg-green-900 dark:border-green-200 dark:text-green-200",
  information:
    "bg-blue-100 border-blue-700 text-blue-700 dark:bg-blue-900 dark:border-blue-200 dark:text-blue-200",
};

const icons = {
  fail: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  ),
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  ),
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  ),
  information: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
      />
    </svg>
  ),
};

export default function Message({
  type,
  className,
  children,
  ...props
}: MessageProps) {
  return (
    <div
      className={`p-2 rounded-md border flex gap-2 w-max max-w-full ${styles[type]} ${className}`}
      {...props}
    >
      <span>{icons[type]}</span>
      {children}
    </div>
  );
}
