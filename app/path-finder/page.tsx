import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import PathFinder from "@/components/PathFinder";
import { pageBanners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cloud Career Path Finder",
  description:
    "A three-minute, temperament-aware assessment that turns where you are into an ordered route: the cloud or cybersecurity role that fits you, what it pays, the roadmap, and what to read first.",
};

export default function PathFinderPage() {
  return (
    <>
      <PageBanner
        image={pageBanners.learn}
        kicker="Path Finder"
        title="Find the cloud career that fits how you think."
        intro={
          <p>
            Eight quick questions, including a short temperament read based on
            the sixteen human temperaments, in about three minutes. You'll
            leave with a role, a salary
            reference, an ordered roadmap, and the exact resources on this
            site to start with. No email wall.
          </p>
        }
      />

      <section className="container-content py-16 sm:py-24">
        <Reveal>
          <PathFinder />
        </Reveal>
      </section>
    </>
  );
}
