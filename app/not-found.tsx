import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="display text-[38vw] leading-[0.8] text-volt sm:text-[16rem]">
        404
      </p>
      <h1 className="display mt-2 text-3xl text-fg sm:text-4xl">
        This page left the body
      </h1>
      <p className="mt-4 max-w-sm text-fg-dim">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="trans mt-8 inline-flex bg-volt px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink hover:bg-fg"
      >
        Back to Exalt Human
      </Link>
    </div>
  );
}
