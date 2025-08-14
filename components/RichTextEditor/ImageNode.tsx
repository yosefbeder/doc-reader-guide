import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    height?: number;
    width?: number;
    maxWidth?: number;
  },
  SerializedLexicalNode
>;

export const $createImageNode = ({
  altText,
  height,
  maxWidth = 400,
  src,
  width,
}: {
  altText: string;
  height?: number;
  maxWidth?: number;
  src: string;
  width?: number;
}) => {
  return new ImageNode({ altText, height, maxWidth, src, width });
};

const convertImageElement = (domNode: Node): DOMConversionOutput | null => {
  if (domNode instanceof HTMLImageElement) {
    const { src, alt } = domNode;
    const node = $createImageNode({ src, altText: alt });
    return { node };
  }
  return null;
};

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __height: "inherit" | number;
  __width: "inherit" | number;
  __maxWidth: number;

  constructor({
    src,
    altText,
    maxWidth,
    width,
    height,
    key,
  }: {
    src: string;
    altText: string;
    maxWidth: number;
    width?: "inherit" | number;
    height?: "inherit" | number;
    key?: NodeKey;
  }) {
    super(key);
    this.__altText = altText;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
    this.__maxWidth = maxWidth;
    this.__src = src;
  }

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode({
      altText: node.__altText,
      src: node.__src,
      height: node.__height,
      width: node.__width,
      maxWidth: node.__maxWidth,
      key: node.__key,
    });
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        style={{
          width: this.__width,
          height: this.__height,
          maxWidth: this.__maxWidth,
        }}
      />
    );
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    return span;
  }

  exportDOM(): DOMExportOutput {
    const image = document.createElement("img");
    image.setAttribute("src", this.__src);
    image.setAttribute("alt", this.__altText);

    return { element: image };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => {
        return { conversion: convertImageElement, priority: 0 };
      },
    };
  }

  updateDOM(): boolean {
    return false;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode({
      src: serializedNode.src,
      altText: serializedNode.altText,
      height: serializedNode.height,
      width: serializedNode.width,
      maxWidth: serializedNode.maxWidth || 400,
    });
  }
}
