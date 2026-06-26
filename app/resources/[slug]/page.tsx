import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import { resources } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = resources.find((r) => r.slug === slug);
  if (!resource) return { title: "Resource not found" };
  return { title: resource.title, description: resource.summary };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const resource = resources.find((r) => r.slug === slug);
  if (!resource) notFound();

  return (
    <article className="container-content py-20 sm:py-28">
      <Reveal>
        <Link href="/resources" className="link-quiet text-small">
          ← Back to the library
        </Link>
      </Reveal>

      <Reveal className="mt-10 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 text-small text-ink/55">
          <span className="kicker text-blue-lift">{resource.type}</span>
          <span aria-hidden>·</span>
          <span>{resource.level}</span>
          <span aria-hidden>·</span>
          <span>{resource.topic}</span>
        </div>
        <h1 className="mt-6 font-serif text-h1 font-light text-signature">
          {resource.title}
        </h1>
        <p className="mt-6 max-w-prose text-body text-ink/75">{resource.summary}</p>
      </Reveal>

      {/* ── Download — seam for an R2 (or other) signed URL. */}
      <Reveal className="mt-12 max-w-3xl">
        <div className="rounded-2xl border border-ink/10 bg-paper p-8 sm:p-10">
          <h2 className="font-serif text-h2 font-light text-ink">Download</h2>
          {resource.downloadUrl ? (
            <div className="mt-6">
              <Button href={resource.downloadUrl} variant="accent">
                Get the {resource.type.toLowerCase()}
              </Button>
            </div>
          ) : (
            <p className="mt-4 text-small text-ink/60">
              The download link mounts here once the file store (R2) is wired. The UI
              is ready; only the signed URL is pending.
            </p>
          )}
          <p className="mt-6 text-small text-ink/45">
            Last updated{" "}
            {new Date(resource.updated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </Reveal>
    </article>
  );
}
