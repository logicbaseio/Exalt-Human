import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 glow-volt opacity-50" />
      <div className="relative">
        <p className="display text-8xl text-volt sm:text-9xl">404</p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-fg">
          This page left the body.
        </h1>
        <p className="mt-3 max-w-sm text-fg-dim">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-volt px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
        >
          Back to Exalt Human
        </Link>
      </div>
    </div>
  );
}
