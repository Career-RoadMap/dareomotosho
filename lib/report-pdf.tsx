import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import {
  resultDisclaimer,
  type Temperament,
  type Track,
} from "@/lib/pathfinder";
import { siteUrl } from "@/lib/site";

/**
 * Server-side PDF of the full Path Finder report, shared by the download
 * endpoint and the Resend email (as an attachment). A real PDF file rather
 * than a browser print dialog, so it behaves the same on every device.
 */

const ink = "#0f1b2d";
const signature = "#1e3a5f";
const amber = "#b8842e"; // darker amber for print legibility
const muted = "#666666";
const faint = "#999999";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: ink,
    lineHeight: 1.55,
  },
  kicker: {
    fontSize: 8,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: amber,
    fontFamily: "Helvetica-Bold",
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: amber,
    paddingBottom: 14,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontFamily: "Times-Roman",
    marginTop: 6,
    marginBottom: 4,
    lineHeight: 1.2,
  },
  tagline: { fontSize: 11, color: muted, fontFamily: "Times-Italic" },
  why: { marginTop: 8, color: "#444444" },
  section: { marginTop: 18 },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: signature,
    fontFamily: "Helvetica-Bold",
    borderBottomWidth: 0.75,
    borderBottomColor: amber,
    paddingBottom: 4,
    marginBottom: 10,
  },
  tempBox: {
    backgroundColor: "#f5f0e8",
    borderWidth: 0.75,
    borderColor: amber,
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
  },
  tempRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  tempCode: { fontSize: 14, fontFamily: "Helvetica-Bold", color: signature },
  tempFamily: { fontSize: 11, fontFamily: "Helvetica-Bold", color: signature },
  tempBlurb: { marginTop: 4, fontSize: 9.5, color: muted, fontFamily: "Times-Italic" },
  salaryRow: { flexDirection: "row", gap: 8 },
  salaryCard: {
    flex: 1,
    borderWidth: 0.75,
    borderColor: "#dddddd",
    borderRadius: 6,
    padding: 10,
  },
  salaryLevel: {
    fontSize: 7.5,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: signature,
    fontFamily: "Helvetica-Bold",
  },
  salaryAmount: { fontSize: 14, fontFamily: "Helvetica-Bold", marginTop: 4 },
  note: { marginTop: 8, fontSize: 8, color: faint },
  pacing: {
    backgroundColor: "#f8f8f8",
    borderLeftWidth: 2,
    borderLeftColor: amber,
    padding: 8,
    marginBottom: 10,
    fontSize: 9.5,
    color: muted,
    fontFamily: "Times-Italic",
  },
  roadmapItem: { flexDirection: "row", gap: 10, marginBottom: 10 },
  roadmapNum: {
    fontSize: 16,
    fontFamily: "Times-Bold",
    color: amber,
    width: 26,
  },
  roadmapStep: { fontFamily: "Helvetica-Bold", fontSize: 10.5 },
  roadmapBody: { marginTop: 2, fontSize: 9.5, color: muted },
  certsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 6 },
  cert: {
    backgroundColor: "#e8f0f8",
    borderWidth: 0.75,
    borderColor: signature,
    borderRadius: 9,
    paddingVertical: 3,
    paddingHorizontal: 9,
    fontSize: 8.5,
    color: signature,
    fontFamily: "Helvetica-Bold",
  },
  projectBox: {
    backgroundColor: "#fffbf0",
    borderWidth: 0.75,
    borderColor: amber,
    borderRadius: 6,
    padding: 12,
  },
  projectText: { marginTop: 6, fontSize: 10.5 },
  projectNote: { marginTop: 6, fontSize: 8.5, color: faint, fontFamily: "Times-Italic" },
  resourceItem: {
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eeeeee",
  },
  resourceUrl: { fontSize: 8, color: faint },
  disclaimer: {
    marginTop: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    padding: 10,
    fontSize: 7.5,
    color: faint,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 52,
    right: 52,
    textAlign: "center",
    fontSize: 7.5,
    color: "#bbbbbb",
  },
});

function ReportDocument({
  track,
  temperament,
  pacing,
}: {
  track: Track;
  temperament: Temperament | null;
  pacing: string | null;
}) {
  return (
    <Document
      title={`Cloud Career Path Report: ${track.title}`}
      author="dareomotosho.com"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.kicker}>
            Cloud Career Path Report · dareomotosho.com
          </Text>
          <Text style={styles.title}>{track.title}</Text>
          <Text style={styles.tagline}>{track.tagline}</Text>
          <Text style={styles.why}>{track.whyItFits}</Text>
        </View>

        {temperament ? (
          <View style={styles.tempBox}>
            <View style={styles.tempRow}>
              <Text style={styles.kicker}>Temperament</Text>
              <Text style={styles.tempCode}>{temperament.code}</Text>
              <Text style={{ color: faint }}>·</Text>
              <Text style={styles.tempFamily}>{temperament.family.name}</Text>
            </View>
            <Text style={styles.tempBlurb}>{temperament.family.blurb}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salary Reference (USD)</Text>
          <View style={styles.salaryRow}>
            {track.salary.map((s) => (
              <View key={s.level} style={styles.salaryCard}>
                <Text style={styles.salaryLevel}>{s.level}</Text>
                <Text style={styles.salaryAmount}>{s.usd}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.note}>
            Educational reference only. Not financial or career advice. Varies
            by company, location, and experience.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Roadmap, In Order</Text>
          {pacing ? <Text style={styles.pacing}>{pacing}</Text> : null}
          {track.roadmap.map((r, i) => (
            <View key={r.step} style={styles.roadmapItem} wrap={false}>
              <Text style={styles.roadmapNum}>
                {String(i + 1).padStart(2, "0")}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.roadmapStep}>{r.step}</Text>
                <Text style={styles.roadmapBody}>{r.body}</Text>
              </View>
            </View>
          ))}
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, color: signature }}>
            Certifications worth holding:
          </Text>
          <View style={styles.certsRow}>
            {track.certifications.map((c) => (
              <Text key={c} style={styles.cert}>
                {c}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Build This First</Text>
          <View style={styles.projectBox}>
            <Text style={styles.kicker}>Start here</Text>
            <Text style={styles.projectText}>{track.firstProject}</Text>
            <Text style={styles.projectNote}>
              Confidence comes from shipping, not from reading. Start it in
              week one, badly if necessary.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Read These, In This Order</Text>
          {track.resources.map((r, i) => {
            const url = `${siteUrl}${r.href.startsWith("/") ? r.href : `/${r.href}`}`;
            return (
              <View key={r.href} style={styles.resourceItem} wrap={false}>
                <Text>
                  {i + 1}. {r.label}
                </Text>
                <Text style={styles.resourceUrl}>{url}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section} wrap={false}>
          <Text>
            Your result page: {siteUrl}/path-finder/{track.id}
          </Text>
        </View>

        <Text style={styles.disclaimer}>{resultDisclaimer}</Text>

        <Text style={styles.footer} fixed>
          Generated from dareomotosho.com/path-finder · For education only
        </Text>
      </Page>
    </Document>
  );
}

/** Render the report to a PDF buffer. */
export async function buildReportPdf(
  track: Track,
  temperament: Temperament | null,
  pacing: string | null,
): Promise<Buffer> {
  return renderToBuffer(
    <ReportDocument track={track} temperament={temperament} pacing={pacing} />,
  );
}
