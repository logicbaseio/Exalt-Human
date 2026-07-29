import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS, getTool } from "@/lib/tools";
import { ToolsHeader, ToolsFooter, MedicalNotice } from "../chrome";
import { ToolRunner } from "./runner";

type ToolPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return { title: "Tool not found" };

  return {
    title: tool.name,
    description: tool.description,
    openGraph: {
      title: `${tool.name} — Exalt Human`,
      description: tool.description,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const others = TOOLS.filter((item) => item.slug !== tool.slug).slice(0, 3);

  return (
    <main className="tools-page tool-detail">
      <ToolsHeader />

      <section className="tool-hero shell">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Exalt Human</Link>
          <span>/</span>
          <Link href="/tools">Tools</Link>
          <span>/</span>
          <span>{tool.category}</span>
        </nav>

        <div className="tool-hero-grid">
          <div>
            <p className="tools-eyebrow">{tool.category}</p>
            <h1>{tool.headline}</h1>
            <p className="tool-deck">{tool.deck}</p>
          </div>
          {tool.relatedArticle ? (
            <aside className="tool-related">
              <p>Read the research</p>
              <Link href={`/articles/${tool.relatedArticle}`}>
                <b>{tool.relatedArticleTitle}</b>
                <span aria-hidden="true">↗</span>
              </Link>
            </aside>
          ) : null}
        </div>
      </section>

      <section className="tool-console shell">
        <ToolRunner slug={tool.slug} />
      </section>

      <section className="tool-meta shell">
        <div className="tool-limitation">
          <p className="tools-group-label">What this cannot tell you</p>
          <p>{tool.limitation}</p>
        </div>

        <div className="tool-sources">
          <p className="tools-group-label">Sources</p>
          <ol>
            {tool.references.map((reference, index) => (
              <li key={reference.href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <a href={reference.href} target="_blank" rel="noopener noreferrer">
                  <strong>{reference.title}</strong>
                  {reference.source} · {reference.year}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="shell">
        <MedicalNotice />
      </div>

      <section className="tool-more shell" aria-label="More tools">
        <p className="tools-group-label">More instruments</p>
        <ul>
          {others.map((item) => (
            <li key={item.slug}>
              <Link href={`/tools/${item.slug}`}>
                <b>{item.name}</b>
                <span>{item.category}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ToolsFooter />
    </main>
  );
}
