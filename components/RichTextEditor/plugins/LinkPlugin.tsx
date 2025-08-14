import { useEffect, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { icons } from "@/components/icons";

const LinkPlugin = ({ isActive }: { isActive: boolean }) => {
  const [editor] = useLexicalComposerContext();

  const openLinkEditor = useCallback(() => {
    // The entire logic must be wrapped in editor.update()
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }

      const nodes = selection.getNodes();
      let node = nodes.find(
        (node) =>
          $isLinkNode(node) ||
          ($isTextNode(node) && $isLinkNode(node.getParent()))
      );
      if (node) {
        if ($isTextNode(node)) {
          node = node.getParent()!;
        }
        const url = (node as LinkNode).getURL();
        // This is where you'd show a UI for editing the existing link.
        const newUrl = prompt("Editing link:", url);
        if (newUrl) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, newUrl);
        } else {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
      } else {
        // This is where you'd show a UI for creating a new link.
        const url = prompt("Enter the URL for the link:");
        if (url) {
          // dispatchCommand is a state-changing operation, so it's correctly placed here.
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
      }
    });
  }, [editor]);

  useEffect(() => {
    // Listen for the selection change command to show/hide the link UI
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        // You can add logic here to show a floating toolbar
        return false;
      },
      0
    );
  }, [editor]);

  return (
    <button
      type="button"
      onClick={openLinkEditor}
      className={`toolbar-item spaced ${isActive && "active"}`}
      aria-label="Insert Link"
    >
      {icons["paper-clip"]}
    </button>
  );
};

export default LinkPlugin;
