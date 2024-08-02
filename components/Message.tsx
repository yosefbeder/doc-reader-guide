import React from "react";

import { FormStateType } from "@/types";

interface MessageProps extends React.ComponentProps<"p"> {
  type: FormStateType;
}

const styles = {
  fail: "bg-red-50 border-red-200 text-red-600",
  success: "bg-green-50 border-green-200 text-green-600",
};

export default function Message({ type, className, ...props }: MessageProps) {
  return (
    <p
      className={`p-2 rounded-md border-2 ${styles[type]} ${className}`}
      {...props}
    />
  );
}
