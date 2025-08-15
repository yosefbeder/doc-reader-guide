import addLinkAttributes from "@/utils/addLinkAttributes";
import replaceImgSrc from "@/utils/replaceImgSrc";
import DOMPurify from "dompurify";

interface HtmlContentProps extends React.ComponentProps<"div"> {
  html: string;
}

export default function HtmlContentClient({
  html,
  className,
  ...rest
}: HtmlContentProps) {
  const cleanHtml = DOMPurify.sanitize(html);
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: addLinkAttributes(replaceImgSrc(cleanHtml)),
      }}
      className={`prose prose-slate ${className}`}
      {...rest}
    />
  );
}
