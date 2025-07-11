export default function parseUrls(formData: FormData) {
  const urls = [];

  for (let i = 0; i < +process.env.NEXT_PUBLIC_OPTIONS_LIMIT!; i++) {
    const url = formData.get(`url-${i}`);
    if (url) urls.push(url);
  }

  return urls;
}
