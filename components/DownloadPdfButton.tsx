"use client";

/**
 * Download-as-PDF for an entry. Uses the browser's print-to-PDF via
 * window.print(); the print stylesheet (print:hidden on the chrome) leaves a
 * clean, title + body document. No dependency, works everywhere.
 */
export default function DownloadPdfButton({ label = "Download PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg border border-ink/15 px-5 py-2.5 text-small font-medium text-ink transition-colors duration-300 ease-calm hover:border-amber hover:text-amber print:hidden"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6" aria-hidden>
        <path d="M12 3v12m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}
