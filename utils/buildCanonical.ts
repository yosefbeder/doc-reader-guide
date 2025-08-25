export default function buildCanonical(path: string) {
  return {
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONTEND_URL}${path}`,
    },
  };
}
