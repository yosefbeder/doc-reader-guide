import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { PASTE_COMMAND, COMMAND_PRIORITY_EDITOR, $insertNodes } from "lexical";
import { $createImageNode } from "../ImageNode";

export default function PastePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const remove = editor.registerCommand(
      PASTE_COMMAND,
      (event: unknown) => {
        const clipboardEvent = event as ClipboardEvent | undefined | null;
        if (!clipboardEvent || !clipboardEvent.clipboardData) return false;

        const clipboardData = clipboardEvent.clipboardData;

        let handledImage = false;

        // Handle image files (common when pasting screenshots)
        if (clipboardData.files && clipboardData.files.length > 0) {
          for (let i = 0; i < clipboardData.files.length; i++) {
            const file = clipboardData.files[i];
            if (file.type && file.type.startsWith("image/")) {
              handledImage = true;
              const reader = new FileReader();
              reader.onload = () => {
                const src = reader.result as string;
                editor.update(() => {
                  const node = $createImageNode({ src, altText: file.name });
                  $insertNodes([node]);
                });
              };
              reader.readAsDataURL(file);
            }
          }
        }

        // Handle image items in clipboardData.items (some browsers provide images here)
        if (
          !handledImage &&
          clipboardData.items &&
          clipboardData.items.length > 0
        ) {
          for (let i = 0; i < clipboardData.items.length; i++) {
            const item = clipboardData.items[i];
            if (
              item.kind === "file" &&
              item.type &&
              item.type.startsWith("image/")
            ) {
              const file = item.getAsFile();
              if (file) {
                handledImage = true;
                const reader = new FileReader();
                reader.onload = () => {
                  const src = reader.result as string;
                  editor.update(() => {
                    const node = $createImageNode({ src, altText: file.name });
                    $insertNodes([node]);
                  });
                };
                reader.readAsDataURL(file);
              }
            }
          }
        }

        if (handledImage) {
          clipboardEvent.preventDefault();
          return true; // we handled the paste
        }

        return false; // let Lexical handle all other pastes
      },
      COMMAND_PRIORITY_EDITOR
    );

    return () => remove();
  }, [editor]);

  return null;
}
