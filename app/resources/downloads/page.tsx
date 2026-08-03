import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Downloads from "@/components/Downloads";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Textbooks, slide decks, and short video clips, free to download.",
};

export default function DownloadsPage() {
  return (
    <div className="container-content py-12 sm:py-16">
      <Reveal>
        <Link href="/resources" className="link-quiet text-small">
          ← Back to the library
        </Link>
      </Reveal>
      <div className="mt-8 sm:mt-10">
        <Downloads />
      </div>
    </div>
  );
}
