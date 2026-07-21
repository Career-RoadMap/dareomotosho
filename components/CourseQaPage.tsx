import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type QaPair = { n: string; question: string; answer: string };

function parseQaPairs(body: string): QaPair[] {
  const segments = body.split(/(?=(?:^|\n)\s*Question\s+\d+\s*:)/);
  const pairs: QaPair[] = [];
  for (const seg of segments) {
    const m = seg.match(
      /^\s*Question\s+(\d+)\s*:\s*([\s\S]*?)\n*\s*High-Authority Answer\s*:?\s*\n*([\s\S]*)$/,
    );
    if (!m) continue;
    const question = m[2]
      .trim()
      .replace(/^[""']+/, "")
      .replace(/[""']+\s*$/, "")
      .replace(/[""']+\s*(\([^)]*\))\s*$/, " $1")
      .trim();
    const answer = m[3].trim();
    if (question && answer) pairs.push({ n: m[1], question, answer });
  }
  return pairs;
}

/**
 * Full-page renderer for Interview Prep (course_qa) entries. Questions are
 * shown in a visually distinct header band so they're immediately readable;
 * answers are displayed in full below, never collapsed.
 */
export default function CourseQaPage({ body }: { body: string }) {
  const pairs = parseQaPairs(body);

  if (pairs.length === 0) {
    return (
      <div className="prose-entry space-y-5 text-body text-ink">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {pairs.map((qa) => (
        <div key={qa.n} className="overflow-hidden rounded-2xl border border-ink/10 shadow-sm">
          {/* Question — dark highlighted header */}
          <div className="flex items-start gap-5 bg-signature px-7 py-6">
            <span className="kicker mt-1 shrink-0 text-amber">Q{qa.n}</span>
            <p className="font-serif text-xl font-medium leading-snug text-paper">
              {qa.question}
            </p>
          </div>

          {/* Answer — plain prose */}
          <div className="bg-paper px-7 py-7">
            <div className="prose-entry space-y-4 text-body text-ink">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{qa.answer}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
