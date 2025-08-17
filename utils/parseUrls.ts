export default function parseUrls(formData: FormData) {
  const urls = [];

  for (let i = 0; i < +process.env.NEXT_PUBLIC_OPTIONS_LIMIT!; i++) {
    const name = `url-${i}`;
    const url = formData.get(name);
    if (url) {
      urls.push(url);
      formData.delete(name);
    }
  }

  return urls;
}
