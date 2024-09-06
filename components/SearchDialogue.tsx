import React from "react";

import ButtonIcon from "./ButtonIcon";

export default function SearchDialogue({
  onClose,
  children,
}: {
  onClose: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className="fixed left-0 top-0 w-screen h-screen bg-slate-900/10"
        onClick={onClose}
      />
      <div className="fixed z-10 inset-0 my-8 mx-auto max-[512px]:m-0 p-2 max-[512px]:py-4 w-full max-w-lg h-max max-[512px]:h-screen max-[512px]:overflow-y-scroll rounded-3xl max-[512px]:rounded-none bg-white">
        <div className="hidden max-[512px]:flex justify-between items-center mb-4">
          <h2>ابحث عن محاضرة</h2>
          <ButtonIcon icon="x-mark" onClick={onClose} />
        </div>
        {children}
      </div>
    </>
  );
}
