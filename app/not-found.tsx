import Button from "@/components/Button";

export default function NotFound() {
  return (
    <section className="container-content flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="kicker text-blue-lift">404</p>
      <h1 className="mt-6 font-serif text-h1 font-light text-signature">
        This page wandered off.
      </h1>
      <p className="mt-5 max-w-md text-body text-ink">
        The link may be old, or the page may have moved. Let's get you back to
        something useful.
      </p>
      <div className="mt-10">
        <Button href="/">Back home</Button>
      </div>
    </section>
  );
}
