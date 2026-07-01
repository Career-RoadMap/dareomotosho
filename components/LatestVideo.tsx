import { social } from "@/lib/site";

/**
 * Latest video thumbnail. Reads the channel's public videos page server-side
 * and pulls the newest video id, then shows its YouTube thumbnail linking to
 * the video. Revalidates hourly. If the fetch fails or the network is blocked,
 * it falls back to a calm placeholder so the page never breaks.
 */
async function fetchLatestVideoId(): Promise<string | null> {
  try {
    const res = await fetch(`${social.youtube}/videos`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/"videoId":"([A-Za-z0-9_-]{11})"/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export default async function LatestVideo() {
  const id = await fetchLatestVideoId();

  if (!id) {
    return (
      <div className="aspect-video w-full rounded-lg border border-ink/10 bg-ink/[0.04]" />
    );
  }

  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const watch = `https://www.youtube.com/watch?v=${id}`;

  return (
    <a
      href={watch}
      target="_blank"
      rel="noreferrer"
      aria-label="Watch the latest video on YouTube"
      className="group relative block aspect-video w-full overflow-hidden rounded-lg border border-ink/10"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumb}
        alt="Latest video thumbnail"
        className="h-full w-full object-cover transition-transform duration-500 ease-calm group-hover:scale-105"
      />
      <span className="absolute inset-0 grid place-items-center bg-ink/20 transition-colors duration-300 ease-calm group-hover:bg-ink/30">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-paper/90 text-signature shadow-lg">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-current" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </a>
  );
}
