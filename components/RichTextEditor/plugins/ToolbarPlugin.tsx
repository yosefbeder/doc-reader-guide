import { icons } from "@/components/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isRootNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalNode,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $isTextNode,
} from "lexical";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $isLinkNode } from "@lexical/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ImagePlugin from "./ImagePlugin";
import LinkPlugin from "./LinkPlugin";

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      const nodes = selection.getNodes();

      // Find a LinkNode among the selected nodes
      const isLinkSelected = nodes.some(
        (node) =>
          $isLinkNode(node) ||
          ($isTextNode(node) && $isLinkNode(node.getParent()))
      );

      setIsLink(isLinkSelected);

      let anchorNode: LexicalNode = selection.anchor.getNode();

      if ($isRootNode(anchorNode)) {
        const firstChild = anchorNode.getFirstChild();
        if (!firstChild) return;
        anchorNode = firstChild;
      }

      const topLevelElement = anchorNode.getTopLevelElementOrThrow();

      // Skip if we can't find the DOM element
      const elementDOM = editor.getElementByKey(topLevelElement.getKey());
      if (!elementDOM) return;

      if ($isListNode(topLevelElement)) {
        const listNode = $getNearestNodeOfType(anchorNode, ListNode);
        if (listNode) {
          setBlockType(listNode.getTag()); // 'ul' or 'ol'
        } else {
          setBlockType(topLevelElement.getTag());
        }
      } else {
        const type = topLevelElement.getType();
        setBlockType(type); // e.g., 'paragraph', 'heading', etc.
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        type="button"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        {icons["arrow-uturn-left"]}
      </button>
      <button
        type="button"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        {icons["arrow-uturn-right"]}
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={"toolbar-item spaced " + (isBold ? "active" : "")}
        aria-label="Format Bold"
      >
        {icons["bold"]}
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={"toolbar-item spaced " + (isItalic ? "active" : "")}
        aria-label="Format Italics"
      >
        {icons["italic"]}
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
        aria-label="Format Underline"
      >
        {icons["underline"]}
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
        aria-label="Format Strikethrough"
      >
        {icons["strikethrough"]}
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        {icons["bars-3-bottom-left"]}
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        {icons["bars-3"]}
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        {icons["bars-3-bottom-right"]}
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          if (blockType === "ul")
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          else editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
        className={
          "toolbar-item spaced " + (blockType === "ul" ? " active" : "")
        }
        aria-label="Insert Unordered List"
      >
        {icons["list-bullet"]}
      </button>
      <button
        type="button"
        onClick={() => {
          if (blockType === "ol")
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          else editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }}
        className={
          "toolbar-item spaced " + (blockType === "ol" ? " active" : "")
        }
        aria-label="Insert Ordered List"
      >
        {icons["numbered-list"]}
      </button>
      <Divider />
      <LinkPlugin isActive={isLink} />
      <ImagePlugin />
    </div>
  );
}
