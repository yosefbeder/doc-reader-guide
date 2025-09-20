import React from "react";
import ButtonIcon from "./ButtonIcon";

export default function Dialogue({
  header,
  className,
  onClose,
  children,
}: {
  header: string;
  className?: string;
  onClose: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className="fixed left-0 top-0 w-screen h-screen bg-slate-900/10 dark:bg-slate-900/50"
        onClick={onClose}
      />
      <div
        className={`fixed z-10 inset-0 my-8 mx-auto max-[512px]:m-0 p-2 max-[512px]:py-4 w-full max-w-xl h-max max-[512px]:h-screen shadow-md max-[512px]:overflow-y-scroll max-[512px]:rounded-none 
          bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
          ${className}`}
      >
        <div className="hidden max-[512px]:block relative">
          <h2 className="text-lg font-bold">{header}</h2>
          <ButtonIcon
            className="absolute top-0 right-0"
            icon="x-mark"
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </>
  );
}
