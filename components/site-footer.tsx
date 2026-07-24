import Link from "next/link";
import { TOPICS } from "@/lib/topics";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg-dim">
              A field guide to the human system. Learn every aspect of the body
              and mind — and everything that damages or improves it.
            </p>
          </div>

          <div>
            <h3 className="eyebrow text-fg-faint">Domains</h3>
            <ul className="mt-4 space-y-2.5">
              {TOPICS.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/topics/${t.slug}`}
                    className="group inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: t.color }}
                    />
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-fg-faint">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
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

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-fg-faint sm:flex-row sm:items-center">
          <p>© {year} Exalt Human. Educational content, not medical advice.</p>
          <p className="eyebrow">Optimize the human</p>
        </div>
      </div>
    </footer>
  );
}
