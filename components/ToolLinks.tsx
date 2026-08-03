import Link from "next/link";

/**
 * The two standalone tools as compact pill buttons, sat directly under a page
 * banner so they are reachable immediately rather than waiting at the foot of
 * the collection grid. The Salary Explorer is a static page outside the app
 * router, so it needs a plain anchor and a new tab.
 */
const tools = [
  {
    href: "/path-finder",
    label: "Career Path Finder",
    note: "3 minutes",
    external: false,
    icon: (
      <>
        <path
          d="M5 20v-5a3 3 0 0 1 3-3h6a3 3 0 0 0 3-3V6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="5" cy="20" r="1.6" />
        <path
          d="M17 3.2c1.6 0 2.9 1.3 2.9 2.9 0 2-2.9 4.6-2.9 4.6s-2.9-2.6-2.9-4.6c0-1.6 1.3-2.9 2.9-2.9Z"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    href: "/tools/career-salary-explorer.html",
    label: "Salary Explorer",
    note: "30 roles",
    external: true,
    icon: (
      <>
        <path d="M4 20h16" strokeLinecap="round" />
        <rect x="6" y="11" width="3.4" height="6" rx="1" />
        <rect x="12" y="7" width="3.4" height="10" rx="1" />
        <rect x="18" y="13.5" width="2" height="3.5" rx="1" />
      </>
    ),
  },
];

const pill =
  "group inline-flex items-center gap-3 rounded-full border border-ink/[0.14] bg-paper px-4 py-2.5 text-small font-medium text-ink shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-md hover:shadow-ink/5";

export default function ToolLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="kicker text-blue-lift">Tools</span>
      {tools.map((t) => {
        const inner = (
          <>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-lift/10 text-blue-lift transition-colors duration-300 ease-calm group-hover:bg-amber/15 group-hover:text-amber">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-none stroke-current"
                strokeWidth="1.7"
                aria-hidden
              >
                {t.icon}
              </svg>
            </span>
            <span className="whitespace-nowrap">{t.label}</span>
            <span className="hidden text-ink/45 sm:inline">{t.note}</span>
            <span
              className="text-amber transition-transform duration-300 ease-calm group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </>
        );
        return t.external ? (
          <a key={t.href} href={t.href} target="_blank" rel="noreferrer" className={pill}>
            {inner}
          </a>
        ) : (
          <Link key={t.href} href={t.href} className={pill}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
