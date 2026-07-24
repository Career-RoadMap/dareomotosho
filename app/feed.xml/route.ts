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

/**
 * Minimal markdown → HTML for the feed's full-content field. Handles the
 * shapes our entries actually use (headings, paragraphs, bullet/numbered
 * lists, bold/italic); everything is HTML-escaped first, so the only tags
 * in the output are the ones added here.
 */
function mdToHtml(md: string): string {
  const esc = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const blocks = esc.split(/\n\s*\n/);
  const html = blocks
    .map((block) => {
      const b = block.trim();
      if (!b) return "";
      const h = b.match(/^(#{1,3})\s+([\s\S]*)$/);
      if (h) {
        const level = Math.min(h[1].length + 1, 4); // h1→h2 … h3→h4
        return `<h${level}>${inline(h[2].trim())}</h${level}>`;
      }
      const lines = b.split("\n").map((l) => l.trim());
      if (lines.every((l) => /^[-*]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      if (lines.every((l) => /^\d+\.\s+/.test(l))) {
        return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
      }
      return `<p>${inline(b.replace(/\n/g, " "))}</p>`;
    })
    .filter(Boolean)
    .join("\n");
  return html;
}

function inline(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|\s)\*([^*]+)\*(?=\s|$|[.,;:!?])/g, "$1<em>$2</em>");
}

export async function GET() {
  const entries = await getEntries();

  // Freshest first, by update time, so revised resources resurface for readers.
  const ordered = [...entries].sort((a, b) => {
    const ta = Date.parse(a.updated_at || a.created_at || "") || 0;
    const tb = Date.parse(b.updated_at || b.created_at || "") || 0;
    return tb - ta;
  });

  const items = ordered
    .slice(0, 50)
    .map((e) => {
      const url = `${siteUrl}/resources/${e.slug}`;
      const stamp = e.updated_at || e.created_at;
      const date = stamp ? new Date(stamp).toUTCString() : "";
      return [
        "    <item>",
        `      <title>${xml(e.title)}</title>`,
        `      <link>${xml(url)}</link>`,
        `      <guid isPermaLink="true">${xml(url)}</guid>`,
        date ? `      <pubDate>${date}</pubDate>` : "",
        `      <description>${xml(e.summary)}</description>`,
        `      <content:encoded>${xml(mdToHtml(e.body || e.summary))}</content:encoded>`,
        `      <category>${xml(e.topic)}</category>`,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${xml(brand.name)}</title>
    <link>${xml(siteUrl)}</link>
    <description>${xml(brand.oneLine)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${xml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml"/>
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub"/>
${items}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: {
      // Served as application/xml (not rss+xml) so browsers apply the XSL
      // stylesheet and render a readable page; feed readers accept either.
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
