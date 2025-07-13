import React, { CSSProperties } from "react";

export default function SelectAnswerDialogue({
  onTrue,
  onFalse,
  className,
  style,
}: {
  onTrue: () => void;
  onFalse: () => void;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`w-max flex items-center rounded-md overflow-hidden text-sm *:px-1 *:py-0.5 *:text-white *:transition-colors ${className}`}
    >
      <button className="bg-green-600 hover:bg-green-700" onClick={onTrue}>
        True
      </button>
      <button className="bg-red-600 hover:bg-red-700" onClick={onFalse}>
        False
      </button>
    </div>
  );
}
