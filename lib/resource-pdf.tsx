import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Resource } from "@/lib/resources";
import { domainLabel } from "@/lib/resources";
import { siteUrl } from "@/lib/site";

/**
 * A Field Kit sheet as a printable PDF.
 *
 * The kits are working documents — most carry a fill-in table meant to be
 * completed during a review — so the download has to reproduce the tables
 * with room to write, not flatten them into prose. This renders the subset
 * of markdown the contract's files actually use: `##`/`###` headings,
 * paragraphs, ordered and unordered lists, GFM tables, and inline bold and
 * italic. Anything unrecognised falls through as a plain paragraph, so an
 * unexpected construct degrades to readable text rather than vanishing.
 */

const ink = "#0f1b2d";
const signature = "#1e3a5f";
const amber = "#b8842e"; // darkened for print contrast
const muted = "#666666";
const faint = "#999999";
const rule = "#dddddd";

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 54,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: ink,
    lineHeight: 1.5,
  },
  kicker: {
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: amber,
    fontFamily: "Helvetica-Bold",
  },
  header: { borderBottomWidth: 2, borderBottomColor: amber, paddingBottom: 12, marginBottom: 14 },
  title: { fontSize: 21, fontFamily: "Times-Roman", marginTop: 6, marginBottom: 5, lineHeight: 1.15 },
  takeaway: { fontSize: 11, fontFamily: "Times-Italic", color: signature },
  episode: { marginTop: 6, fontSize: 8.5, color: muted },
  h2: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: signature,
    marginTop: 14,
    marginBottom: 5,
    borderBottomWidth: 0.75,
    borderBottomColor: amber,
    paddingBottom: 3,
  },
  h3: { fontSize: 10, fontFamily: "Helvetica-Bold", color: signature, marginTop: 10, marginBottom: 4 },
  para: { marginBottom: 6 },
  listRow: { flexDirection: "row", marginBottom: 4, paddingRight: 8 },
  listMark: { width: 16, color: amber, fontFamily: "Helvetica-Bold" },
  table: { marginTop: 6, marginBottom: 8, borderTopWidth: 0.75, borderLeftWidth: 0.75, borderColor: rule },
  tr: { flexDirection: "row" },
  cell: {
    borderRightWidth: 0.75,
    borderBottomWidth: 0.75,
    borderColor: rule,
    paddingVertical: 6,
    paddingHorizontal: 5,
    fontSize: 8.5,
  },
  headCell: { backgroundColor: "#f2f4f7", fontFamily: "Helvetica-Bold", color: signature },
  footer: {
    position: "absolute",
    bottom: 26,
    left: 48,
    right: 48,
    textAlign: "center",
    fontSize: 7.5,
    color: faint,
  },
});

/** Split inline **bold** / *italic* runs; everything else is plain. */
function inlineRuns(text: string, keyBase: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <Text key={`${keyBase}-b${i}`} style={{ fontFamily: "Helvetica-Bold" }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return (
        <Text key={`${keyBase}-i${i}`} style={{ fontFamily: "Helvetica-Oblique" }}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    return <Text key={`${keyBase}-t${i}`}>{part}</Text>;
  });
}

// One member per kind: a shared member with a union `kind` does not narrow
// cleanly across the render's successive checks.
type Block =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "para"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "table"; rows: string[][] };

/** Parse a table row, dropping the leading/trailing pipe. */
function splitRow(line: string): string[] {
  return line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
}

const isDivider = (line: string) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(line) && line.includes("-");

function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ kind: "para", text: para.join(" ").trim() });
      para = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.trim()) {
      flushPara();
      continue;
    }

    const h = line.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      flushPara();
      blocks.push({ kind: h[1].length === 2 ? "h2" : "h3", text: h[2].trim() });
      continue;
    }

    // A table: consecutive pipe rows, with the divider row discarded.
    if (/^\s*\|/.test(line)) {
      flushPara();
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        if (!isDivider(lines[i])) rows.push(splitRow(lines[i]));
        i++;
      }
      i--;
      if (rows.length) blocks.push({ kind: "table", rows });
      continue;
    }

    const li = line.match(/^\s*(?:([-*])|(\d+)\.)\s+(.*)$/);
    if (li) {
      flushPara();
      const ordered = Boolean(li[2]);
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*(?:(?:[-*])|(?:\d+)\.)\s+(.*)$/);
        if (m) {
          items.push(m[1].trim());
          i++;
        } else if (/^\s{2,}\S/.test(lines[i]) && items.length) {
          // Continuation of the previous item (the kits wrap long list lines).
          items[items.length - 1] += ` ${lines[i].trim()}`;
          i++;
        } else break;
      }
      i--;
      blocks.push({ kind: "list", ordered, items });
      continue;
    }

    para.push(line.trim());
  }
  flushPara();
  return blocks;
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.kind === "h2" || b.kind === "h3") {
          return (
            <Text key={i} style={b.kind === "h2" ? styles.h2 : styles.h3}>
              {b.text}
            </Text>
          );
        }
        if (b.kind === "para") {
          return (
            <Text key={i} style={styles.para}>
              {inlineRuns(b.text, `p${i}`)}
            </Text>
          );
        }
        if (b.kind === "list") {
          return (
            <View key={i} style={{ marginBottom: 6 }}>
              {b.items.map((item, j) => (
                <View key={j} style={styles.listRow} wrap={false}>
                  <Text style={styles.listMark}>{b.ordered ? `${j + 1}.` : "•"}</Text>
                  <Text style={{ flex: 1 }}>{inlineRuns(item, `l${i}-${j}`)}</Text>
                </View>
              ))}
            </View>
          );
        }
        // Table. The first row is treated as the header when it has any text
        // in it; the kits' fill-in sheets leave the first cell blank, which
        // is still a header row.
        const cols = Math.max(...b.rows.map((r) => r.length));
        const width = `${100 / cols}%`;
        return (
          <View key={i} style={styles.table}>
            {b.rows.map((row, r) => (
              <View key={r} style={styles.tr} wrap={false}>
                {Array.from({ length: cols }).map((_, c) => (
                  <View
                    key={c}
                    style={[
                      styles.cell,
                      { width },
                      // Blank cells are meant to be written in, so give them
                      // height even though they carry no text.
                      (row[c] ?? "").trim() === "" ? { minHeight: 22 } : {},
                      r === 0 ? styles.headCell : {},
                    ]}
                  >
                    <Text>{inlineRuns(row[c] ?? "", `t${i}-${r}-${c}`)}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );
      })}
    </>
  );
}

function KitDocument({ resource }: { resource: Resource }) {
  // The files open with a "**From the episode:** …" line, which the header
  // above already states. The web preview drops it for the same reason; do
  // the same here so the sheet does not say it twice.
  const body = resource.body.replace(
    /^\s*\*\*From the episode:\*\*[^\n]*\n?/i,
    "",
  );
  const blocks = parseBlocks(body);
  return (
    <Document title={resource.title} author="dareomotosho.com" subject={resource.episode}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.kicker}>
            The Field Kit · {domainLabel(resource.domain)}
          </Text>
          <Text style={styles.title}>{resource.title}</Text>
          <Text style={styles.takeaway}>&ldquo;{resource.takeaway}&rdquo;</Text>
          <Text style={styles.episode}>From the episode: {resource.episode}</Text>
        </View>

        <Blocks blocks={blocks} />

        {/* A fixed <Text> with plain children. Two other shapes render
            nothing at all here: a fixed <View> wrapping <Text>, and a <Text>
            using the `render` callback. Both fail silently, so keep this
            simple and verify it in the extracted text if you change it. */}
        <Text style={styles.footer} fixed>
          {`${siteUrl}/resources/${resource.slug}`}
        </Text>
      </Page>
    </Document>
  );
}

/** Render one kit to a PDF buffer. */
export async function buildResourcePdf(resource: Resource): Promise<Buffer> {
  return renderToBuffer(<KitDocument resource={resource} />);
}
