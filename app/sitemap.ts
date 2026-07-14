import type { MetadataRoute } from "next";
import { getEntries } from "@/lib/library";
import { siteUrl } from "@/lib/site";

// Refresh hourly so newly published entries reach crawlers promptly.
export const revalidate = 3600;

const staticRoutes = [
  "",
  "/about",
  "/work",
  "/advisory",
  "/speaking",
  "/book",
  "/start-here",
  "/resources",
  "/resources/articles",
  "/resources/case-studies",
  "/resources/interview-prep",
  "/resources/downloads",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getEntries();

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...entries.map((e) => ({
      url: `${siteUrl}/resources/${e.slug}`,
      lastModified: e.updated_at ? new Date(e.updated_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
