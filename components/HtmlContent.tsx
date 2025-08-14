import replaceImgSrc from "@/utils/replaceImgSrc";
import DOMPurify from "dompurify";

interface HtmlContentProps extends React.ComponentProps<"div"> {
  html: string;
}

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if ("target" in node) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer"); // prevents reverse tabnabbing
  }
});

export default function HtmlContent({
  html,
  className,
  ...rest
}: HtmlContentProps) {
  const cleanHtml = DOMPurify.sanitize(html);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: replaceImgSrc(cleanHtml) }}
      className={`prose prose-slate ${className}`}
      {...rest}
    />
  );
}
