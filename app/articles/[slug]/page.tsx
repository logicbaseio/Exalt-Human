import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { researchArticles, type ArticleParagraph } from "../article-data";
import { getLiveArticle, listLiveArticles } from "@/lib/content";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return researchArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getLiveArticle(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: article.title,
    description: article.deck,
    openGraph: {
      title: article.title,
      description: article.deck,
      type: "article",
      images: [{ url: article.image, alt: article.alt }],
    },
  };
}

function CitationLinks({
  paragraph,
}: {
  paragraph: ArticleParagraph;
}) {
  if (!paragraph.citations?.length) return null;

  return (
    <>
      {" "}
      {paragraph.citations.map((citation) => (
        <sup key={citation}>
          <a href={`#reference-${citation}`} aria-label={`Reference ${citation}`}>
            [{citation}]
          </a>
        </sup>
      ))}
    </>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getLiveArticle(slug);

  if (!article) notFound();

  const all = await listLiveArticles();
  const articleIndex = all.findIndex((item) => item.slug === slug);
  const previous =
    articleIndex >= 0 ? all[(articleIndex - 1 + all.length) % all.length] : article;
  const next = articleIndex >= 0 ? all[(articleIndex + 1) % all.length] : article;

  return (
    <main className="article-page">
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
          <nav aria-label="Article navigation">
            <Link href="/#atlas">Whole Human</Link>
            <Link href="/#research">Research</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/#standard">Our standard</Link>
          </nav>
          <Link className="article-header-back" href="/#research">
            All research <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      <section className="article-hero shell" aria-labelledby="article-title">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Exalt Human</Link>
          <span>/</span>
          <Link href="/#research">Research</Link>
          <span>/</span>
          <span>{article.system}</span>
        </nav>

        <div className="article-heading-grid">
          <aside className="article-meta">
            <span>{article.system}</span>
            <dl>
              <div>
                <dt>Reading time</dt>
                <dd>{article.time}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{article.published}</dd>
              </div>
              <div>
                <dt>Evidence reviewed</dt>
                <dd>{article.reviewed}</dd>
              </div>
              <div>
                <dt>By</dt>
                <dd>{article.byline}</dd>
              </div>
            </dl>
          </aside>

          <div className="article-title-block">
            <h1 id="article-title">{article.title}</h1>
            <p>{article.deck}</p>
          </div>
        </div>

        <figure
          className={`article-hero-image article-hero-image-${article.slug}`}
        >
          <Image
            src={article.image}
            alt={article.alt}
            width={article.width}
            height={article.height}
            priority
            sizes="(max-width: 820px) 100vw, 1480px"
          />
          <figcaption>{article.caption}</figcaption>
        </figure>
      </section>

      <div className="article-reading-grid shell">
        <nav className="article-contents" aria-label="In this article">
          <p>In this article</p>
          <ol>
            {article.sections.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  <span>0{index + 1}</span>
                  {section.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#takeaways">
                <span>0{article.sections.length + 1}</span>
                Key takeaways
              </a>
            </li>
            <li>
              <a href="#references">
                <span>0{article.sections.length + 2}</span>
                References
              </a>
            </li>
          </ol>
        </nav>

        <article className="article-body">
          {article.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.text}>
                  {paragraph.text}
                  <CitationLinks paragraph={paragraph} />
                </p>
              ))}
              {section.evidence ? (
                <aside className="evidence-note">
                  <span>Evidence note · {section.evidence.strength}</span>
                  <p>{section.evidence.text}</p>
                </aside>
              ) : null}
            </section>
          ))}

          <section className="article-takeaways" id="takeaways">
            <p>What the evidence supports</p>
            <h2>The useful signal.</h2>
            <ul>
              {article.takeaways.map((takeaway) => (
                <li key={takeaway}>{takeaway}</li>
              ))}
            </ul>
          </section>

          <section className="article-references" id="references">
            <p>References reviewed · {article.reviewed}</p>
            <h2>Sources</h2>
            <ol>
              {article.references.map((reference, index) => (
                <li id={`reference-${index + 1}`} key={reference.href}>
                  <span>0{index + 1}</span>
                  <a href={reference.href}>
                    <strong>{reference.title}</strong>
                    {reference.source} · {reference.year}
                  </a>
                </li>
              ))}
            </ol>
          </section>

          <aside className="medical-notice">
            <span>Medical information notice</span>
            <p>
              Exalt Human provides educational information, not medical advice,
              diagnosis, or treatment. Research findings describe groups and may
              not apply to an individual. Do not delay or replace care from a
              qualified health professional because of information presented
              here. Seek urgent medical help for severe, sudden, or
              life-threatening symptoms.
            </p>
          </aside>
        </article>

        <aside className="article-reading-rail">
          <p>Evidence language</p>
          <dl>
            <div>
              <dt>Established</dt>
              <dd>Repeated findings or durable scientific framework.</dd>
            </div>
            <div>
              <dt>Emerging</dt>
              <dd>Promising evidence with meaningful open questions.</dd>
            </div>
            <div>
              <dt>Context</dt>
              <dd>Interpretation depends on population, measurement, or use.</dd>
            </div>
          </dl>
        </aside>
      </div>

      <nav className="article-next shell" aria-label="More research">
        <Link href={`/articles/${previous.slug}`}>
          <span>Previous article ←</span>
          <b>{previous.title}</b>
        </Link>
        <Link href={`/articles/${next.slug}`}>
          <span>Next article →</span>
          <b>{next.title}</b>
        </Link>
      </nav>

      <section className="article-dispatch">
        <div className="shell">
          <p>Continue the inquiry</p>
          <h2>Research for the system you live in.</h2>
          <Link href="/#newsletter">
            Join The Dispatch <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

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
    </main>
  );
}
