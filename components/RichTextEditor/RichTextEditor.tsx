import { Suspense } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  $getRoot,
  EditorState,
  LexicalEditor,
  ParagraphNode,
  TextNode,
} from "lexical";
import { ListNode, ListItemNode } from "@lexical/list";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ExampleTheme from "./ExampleTheme";
import "./styles.css";
import { LinkNode } from "@lexical/link";
import { ImageNode } from "./ImageNode";
import PastePlugin from "./plugins/PastePlugin";

interface RichTextEditorProps {
  id: string;
  placeholder: string;
  form?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  id,
  name,
  placeholder,
  form,
  value,
  onChange,
}: RichTextEditorProps) {
  const editorConfig = {
    namespace: "RichTextEditor",
    nodes: [
      ParagraphNode,
      TextNode,
      ListNode,
      ListItemNode,
      LinkNode,
      ImageNode,
    ],
    onError(error: Error) {
      throw error;
    },
    theme: ExampleTheme,
    editorState: (editor: LexicalEditor) => {
      if (typeof window === "undefined") return;
      const parser = new DOMParser();
      const dom = parser.parseFromString(value, "text/html");
      let nodes = $generateNodesFromDOM(editor, dom).map((node) => {
        if (node.getType && node.getType() === "text") {
          const p = new ParagraphNode();
          p.append(node);
          return p;
        }
        return node;
      });
      $getRoot().select();
      $getRoot().append(...nodes);
    },
  };

  const handleEditorChange = (
    editorState: EditorState,
    editor: LexicalEditor
  ) => {
    editor.update(() => {
      const content = $generateHtmlFromNodes(editor, null);

      const doc = new DOMParser().parseFromString(content, "text/html");

      doc.querySelectorAll("[style],[class],[dir]").forEach((el) => {
        el.removeAttribute("style");
        el.removeAttribute("class");
        if (el.getAttribute("dir") === "ltr") el.removeAttribute("dir");
      });

      onChange(doc.body.innerHTML);
    });
  };

  return (
    <Suspense>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input"
                  aria-placeholder={placeholder}
                  placeholder={
                    <div className="editor-placeholder">{placeholder}</div>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <PastePlugin />
            <OnChangePlugin onChange={handleEditorChange} />
            <input
              type="text"
              className="hidden"
              name={name}
              id={id}
              value={value}
              form={form}
              readOnly
            />
          </div>
        </div>
      </LexicalComposer>
    </Suspense>
  );
}
