import Image from "next/image";
import Link from "next/link";

/** Header and footer shared by the tools hub and each tool page. */

export function ToolsHeader() {
  return (
    <header className="article-site-header">
      <div className="shell">
        <Link className="wordmark" href="/" aria-label="Exalt Human home">
          <Image
            className="brand-logo"
            src="/exalt-human-logo.png"
            alt=""
            width={196}
            height={51}
            priority
            unoptimized
          />
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/#atlas">Whole Human</Link>
          <Link href="/#research">Research</Link>
          <Link href="/tools">Tools</Link>
        </nav>
        <Link className="article-header-back" href="/tools">
          All tools <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}

export function ToolsFooter() {
  return (
    <footer className="article-footer">
      <div className="shell">
        <Link className="wordmark" href="/">
          <Image
            className="brand-logo"
            src="/exalt-human-logo.png"
            alt="Exalt Human"
            width={196}
            height={51}
            unoptimized
          />
        </Link>
        <p>Evidence-led human optimization.</p>
        <Link href="/#research">Research index ↗</Link>
      </div>
    </footer>
  );
}

export function MedicalNotice() {
  return (
    <aside className="medical-notice">
      <span>Medical information notice</span>
      <p>
        Exalt Human provides educational information, not medical advice,
        diagnosis, or treatment. These tools apply published formulas and
        population data; results describe groups and may not apply to an
        individual. Do not delay or replace care from a qualified health
        professional because of a result shown here. Seek urgent medical help
        for severe, sudden, or life-threatening symptoms.
      </p>
    </aside>
  );
}
