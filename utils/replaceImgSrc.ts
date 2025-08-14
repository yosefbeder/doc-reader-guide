export default function replaceImgSrc(html: string) {
  return html.replace(
    /<img\s+([^>]*?)src=(["'])(?!https?:|data:)([^"']+)\2/gi,
    `<img $1src=$2${process.env.NEXT_PUBLIC_STATIC_URL}$3$2`
  );
}
