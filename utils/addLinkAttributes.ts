export default function addLinkAttributes(html: string): string {
  // This regex finds <a ...> tags
  return html.replace(
    /<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi,
    (match, attrs) => {
      // If target already exists, don't add it twice
      let newAttrs = attrs;
      if (!/\btarget\s*=/.test(newAttrs)) {
        newAttrs += ' target="_blank"';
      }
      if (!/\brel\s*=/.test(newAttrs)) {
        newAttrs += ' rel="noopener noreferrer"';
      }
      return `<a ${newAttrs}>`;
    }
  );
}
