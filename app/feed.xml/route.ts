import { getEntries } from "@/lib/library";
import { brand, siteUrl } from "@/lib/site";

// Cached and re-generated in the background at most every 10 minutes.
export const revalidate = 600;

/** Escape a string for safe inclusion in XML text/attribute content. */
function xml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const entries = await getEntries();
  const items = entries
    .slice(0, 50)
    .map((e) => {
      const url = `${siteUrl}/resources/${e.slug}`;
      const date = e.created_at ? new Date(e.created_at).toUTCString() : "";
      return [
        "    <item>",
        `      <title>${xml(e.title)}</title>`,
        `      <link>${xml(url)}</link>`,
        `      <guid isPermaLink="true">${xml(url)}</guid>`,
        date ? `      <pubDate>${date}</pubDate>` : "",
        `      <description>${xml(e.summary)}</description>`,
        `      <category>${xml(e.topic)}</category>`,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(brand.name)}</title>
    <link>${xml(siteUrl)}</link>
    <description>${xml(brand.oneLine)}</description>
    <language>en</language>
    <atom:link href="${xml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
