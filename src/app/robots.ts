import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login", "/api/", "/posts"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
