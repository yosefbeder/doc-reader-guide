export default function replaceImgSrc(
  html: string,
  mode: "add" | "remove" = "add"
) {
  const baseUrl = process.env.NEXT_PUBLIC_STATIC_URL ?? "";

  if (mode === "add") {
    // Add static URL to relative src
    return html.replace(
      /<img\s+([^>]*?)src=(["'])(?!https?:|data:)([^"']+)\2/gi,
      `<img $1src=$2${baseUrl}$3$2`
    );
  } else {
    // Remove static URL from src
    const escapedBase = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(
      `<img\\s+([^>]*?)src=(["'])${escapedBase}([^"']+)\\2`,
      "gi"
    );
    return html.replace(regex, `<img $1src=$2$3$2`);
  }
}
