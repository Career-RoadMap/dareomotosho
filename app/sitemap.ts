import type { MetadataRoute } from "next";
import { getEntries } from "@/lib/library";
import { tracks } from "@/lib/pathfinder";
import { getResources } from "@/lib/resources";
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
  "/path-finder",
  "/ai-tutor",
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
  const [entries, resources] = await Promise.all([
    getEntries(),
    getResources(),
  ]);

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    // Episode resources (contents/resources/), so each tool ranks for its title.
    ...resources.map((r) => ({
      url: `${siteUrl}/resources/${r.slug}`,
      lastModified: Date.parse(r.date) ? new Date(r.date) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...tracks.map((t) => ({
      url: `${siteUrl}/path-finder/${t.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...entries.map((e) => ({
      url: `${siteUrl}/resources/${e.slug}`,
      lastModified: e.updated_at ? new Date(e.updated_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
