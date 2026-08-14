import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /api/ endpoints are not pages — and crawling /api/contact?send=test
    // would fire a real email. /go/ is a set of redirects, not content: the
    // destinations are already indexed on their own URLs, and indexing the
    // short codes would split the ranking between two addresses.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/go/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
