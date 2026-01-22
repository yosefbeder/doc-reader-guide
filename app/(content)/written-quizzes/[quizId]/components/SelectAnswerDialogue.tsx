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
      className={`w-max flex items-center rounded-full text-lg overflow-hidden *:py-2 *:text-white *:transition-colors ${className}`}
    >
      <button
        className="bg-green-600 hover:bg-green-700 pl-4 pr-2"
        onClick={onTrue}
      >
        True
      </button>
      <button
        className="bg-red-600 hover:bg-red-700 pl-2 pr-4"
        onClick={onFalse}
      >
        False
      </button>
    </div>
  );
}
