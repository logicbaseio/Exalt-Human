import Link from "next/link";
import { TOPICS } from "@/lib/topics";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-[2] border-t border-line bg-ink-2">
      <div className="mx-auto max-w-[1400px] border-x border-line">
        {/* giant wordmark */}
        <div className="overflow-hidden border-b border-line px-5 pb-6 pt-12 sm:px-10">
          <p className="display text-[19vw] leading-[0.8] text-fg sm:text-[12rem]">
            Exalt<span className="text-volt">.</span>
          </p>
        </div>

        <div className="grid gap-px bg-line md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="bg-ink-2 px-5 py-10 sm:px-10">
            <p className="max-w-xs text-sm leading-relaxed text-fg-dim">
              A field guide to the human system. Learn every aspect of the body
              and mind — and everything that damages or improves it.
            </p>
          </div>

          <div className="bg-ink-2 px-5 py-10 sm:px-8">
            <h3 className="eyebrow text-fg-faint">Domains</h3>
            <ul className="mt-5 space-y-3">
              {TOPICS.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/topics/${t.slug}`}
                    className="group inline-flex items-center gap-2.5 text-sm font-medium uppercase tracking-wide text-fg-dim transition-colors hover:text-fg"
                  >
                    <span
                      className="h-2 w-2"
                      style={{ background: t.color }}
                    />
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-ink-2 px-5 py-10 sm:px-8">
            <h3 className="eyebrow text-fg-faint">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm uppercase tracking-wide">
              <li>
                <Link href="/articles" className="text-fg-dim hover:text-fg">
                  All articles
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-fg-dim hover:text-fg">
                  About
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-fg-dim hover:text-fg">
                  Contributor login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-line px-5 py-6 sm:flex-row sm:items-center sm:px-10">
          <p className="eyebrow text-fg-faint">
            © {year} Exalt Human — not medical advice
          </p>
          <p className="eyebrow text-fg-faint">Optimize the human</p>
        </div>
      </div>
    </footer>
  );
}
