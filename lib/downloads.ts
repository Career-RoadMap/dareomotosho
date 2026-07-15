/**
 * Downloadable resources shown on /resources.
 *
 * Drop the actual files into /public/downloads (e.g. /public/downloads/
 * aws-well-architected.pdf) and add a matching entry below. `file` is the
 * public path (it starts with "/downloads/..."). Any file type works;
 * textbooks and slide decks are typically PDFs, clips are mp4.
 */

export type DownloadKind = "textbook" | "slides" | "clip";

export type Download = {
  title: string;
  description?: string;
  kind: DownloadKind;
  /** Public path, e.g. "/downloads/aws-well-architected.pdf". */
  file: string;
  /** Optional human-readable size, e.g. "2.4 MB". */
  size?: string;
};

export const downloadKindMeta: Record<
  DownloadKind,
  { label: string; blurb: string }
> = {
  textbook: {
    label: "Textbooks",
    blurb: "Full guides to read cover to cover, or keep as a reference.",
  },
  slides: {
    label: "Slide decks",
    blurb: "The decks behind the talks and sessions, yours to reuse.",
  },
  clip: {
    label: "Video clips",
    blurb: "Short, focused clips you can download and watch offline.",
  },
};

/** Order the sections appear in. */
export const downloadKinds: DownloadKind[] = ["textbook", "slides", "clip"];

/**
 * Add entries here as you upload files into /public/downloads. Example:
 *   { title: "AWS Well-Architected, in plain English", kind: "textbook",
 *     file: "/downloads/aws-well-architected.pdf", size: "2.4 MB" },
 */
export const downloads: Download[] = [
  {
    title: "Breaking Into Cloud and Cybersecurity While AI Writes the Code",
    description:
      "What employers still hire humans to do: the durable work of specifying, verifying, and being accountable for what gets built, once AI has commoditized producing it.",
    kind: "textbook",
    file: "/downloads/breaking-into-cloud-and-cybersecurity-while-ai-writes-the-code.pdf",
    size: "281 KB",
  },
  {
    title: "Well-Architected Framework for Cloud Computing",
    description:
      "The first principles, trade-offs, and governance behind sound cloud architecture, structured as a guide for the decisions every strategy and engineering call comes back to.",
    kind: "textbook",
    file: "/downloads/well-architected-framework-cloud-computing.pdf",
    size: "613 KB",
  },
  {
    title: "Request Right-Sizing: Reclaiming Kubernetes Runway",
    description:
      "Cut compute waste and buy back months of runway: how to right-size Kubernetes resource requests without cutting the safety margin that keeps critical services alive.",
    kind: "textbook",
    file: "/downloads/request-right-sizing-reclaiming-kubernetes-runway.pdf",
    size: "351 KB",
  },
];
