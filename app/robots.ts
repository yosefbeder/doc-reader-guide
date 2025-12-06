import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const host = process.env.NEXT_PUBLIC_FRONTEND_URL!;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/app",
          "/profile",
          "/users",
          "/*/update",
        ],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
