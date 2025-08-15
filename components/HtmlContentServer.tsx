import addLinkAttributes from "@/utils/addLinkAttributes";
import replaceImgSrc from "@/utils/replaceImgSrc";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

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
      className={`prose prose-slate prose-cyan ${className}`}
      {...rest}
    />
  );
}
