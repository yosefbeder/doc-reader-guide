// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const host = process.env.NEXT_PUBLIC_FRONTEND_URL!;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/", // home is private/personalized
          "/profile",
          "/users",
          "/*/update", // any update pages
        ],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
