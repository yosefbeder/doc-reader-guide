import React, { useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createImageNode } from "../ImageNode";
import { $insertNodes } from "lexical";
import { icons } from "@/components/icons";

export default function ImagePlugin() {
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [editor] = useLexicalComposerContext();

  const onAddImage = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;

      editor.update(() => {
        const node = $createImageNode({
          src,
          altText: file.name,
        });
        $insertNodes([node]);
      });

      setFile(undefined);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (file) {
      onAddImage();
    }
  }, [file]);

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef?.current?.click()}
        className="toolbar-item spaced"
        aria-label="Insert Image"
      >
        {icons["photo"] /* Replace with your image icon */}
      </button>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFile(file);
          }
          e.target.files = null;
        }}
      />
    </div>
  );
}
