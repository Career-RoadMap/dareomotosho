import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import PathFinderResult from "@/components/PathFinderResult";
import { tracks, trackById } from "@/lib/pathfinder";
import { pageBanners } from "@/lib/site";

type Params = { track: string };

export function generateStaticParams() {
  return tracks.map((t) => ({ track: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { track: id } = await params;
  const track = trackById(id);
  if (!track) return { title: "Path Finder result" };
  const title = `My cloud career path: ${track.title}`;
  const description = `${track.tagline} Take the 3-minute Cloud Career Path Finder and find yours.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PathResultPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { track: id } = await params;
  const track = trackById(id);
  if (!track) notFound();

  return (
    <>
      <PageBanner
        image={pageBanners.learn}
        kicker="Path Finder result"
        title="Someone mapped their cloud career. Here's what they got."
        intro={
          <p>
            This is a result from the Cloud Career Path Finder, a three-minute
            assessment that turns where you are into an ordered route. Read it,
            then take it yourself, your path may be different.
          </p>
        }
      >
        <Button href="/path-finder" variant="accent">
          Take the 3-minute test
        </Button>
      </PageBanner>

      <section className="container-content py-16 sm:py-24">
        <Reveal>
          <PathFinderResult track={track} shared />
        </Reveal>
      </section>
    </>
  );
}
