import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSpaceSession } from "@/lib/space-auth";
import { getItem, SERIES_LABEL, type Series } from "@/lib/content";
import { ReviewActions } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Draft review — Exalt Space",
  robots: { index: false, follow: false },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type Para = { text: string; citations?: number[] };
type Section = { id?: string; title: string; paragraphs: Para[]; evidence?: { strength: string; text: string } };
type Ref = { title: string; source: string; year: string; href: string };

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getSpaceSession())) redirect("/space/login");
  const { id } = await params;
  const item: any = await getItem(id);
  if (!item) notFound();

  const series = (item.series as Series) || "desk";
  const sections: Section[] = Array.isArray(item.sections) ? item.sections : [];
  const takeaways: string[] = Array.isArray(item.takeaways) ? item.takeaways : [];
  const refs: Ref[] = Array.isArray(item.refs) ? item.refs : [];
  const hasDraft = sections.length > 0;

  return (
    <div className="rev">
      <style>{CSS}</style>

      <header className="rev-bar">
        <Link href="/space" className="rev-back">← Board</Link>
        <span className={`rev-status s-${item.status}`}>{labelFor(item.status)}</span>
        <span className="rev-sys">{SERIES_LABEL[series]}{item.pillar ? ` · ${item.pillar}` : ""}</span>
      </header>

      <main className="rev-doc">
        <p className="rev-eyebrow">{SERIES_LABEL[series]}{item.pillar ? ` · ${item.pillar}` : ""}</p>
        <h1>{item.title}</h1>
        {item.deck ? <p className="rev-deck">{item.deck}</p> : null}
        <p className="rev-meta">
          {item.byline || "Exalt Human Research Desk"}
          {item.read_time ? ` · ${item.read_time}` : ""}
        </p>

        {!hasDraft ? (
          <div className="rev-empty">
            <p>No draft yet.</p>
            <p className="rev-dim">
              {item.note ? `Angle: ${item.note}` : "Open this card on the board and choose “Draft now” to generate a cited draft."}
            </p>
          </div>
        ) : (
          <>
            {sections.map((s, i) => (
              <section key={s.id || i} className="rev-section">
                <h2>{s.title}</h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j}>
                    {p.text}
                    {p.citations && p.citations.length ? (
                      <sup className="rev-cite">
                        {p.citations.map((c, k) => (
                          <a key={k} href={`#ref-${c}`}>{c}{k < p.citations!.length - 1 ? "," : ""}</a>
                        ))}
                      </sup>
                    ) : null}
                  </p>
                ))}
                {s.evidence ? (
                  <aside className="rev-evidence">
                    <span>Evidence · {s.evidence.strength}</span>
                    <p>{s.evidence.text}</p>
                  </aside>
                ) : null}
              </section>
            ))}

            {takeaways.length ? (
              <section className="rev-section">
                <h2>Key takeaways</h2>
                <ul className="rev-takeaways">
                  {takeaways.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </section>
            ) : null}

            {refs.length ? (
              <section className="rev-section">
                <h2>References</h2>
                <ol className="rev-refs">
                  {refs.map((r, i) => (
                    <li key={i} id={`ref-${i + 1}`}>
                      <a href={r.href} target="_blank" rel="noopener noreferrer">{r.title}</a>
                      <span className="rev-dim"> — {r.source}{r.year ? `, ${r.year}` : ""}</span>
                    </li>
                  ))}
                </ol>
                <p className="rev-verify">Open each source in a new tab and confirm it says what the draft claims before publishing.</p>
              </section>
            ) : null}
          </>
        )}
      </main>

      <ReviewActions id={String(item.id)} status={item.status} slug={item.slug} hasDraft={hasDraft} />
    </div>
  );
}

function labelFor(s: string) {
  return { idea: "Idea", drafting: "Drafting…", review: "In review", scheduled: "Scheduled", live: "Live" }[s] || s;
}

const CSS = `
  .rev { min-height: 100dvh; background: #0a0a0c; color: #e9eaee;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    padding-bottom: 96px; }
  .rev a { color: inherit; }
  .rev-bar { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 14px;
    padding: 13px clamp(16px,4vw,40px); background: rgba(10,10,12,.9); backdrop-filter: blur(10px);
    border-bottom: 1px solid #24262d; }
  .rev-back { font-size: 13px; color: #9aa0aa; text-decoration: none; }
  .rev-back:hover { color: #fff; }
  .rev-status { font-family: ui-monospace, Menlo, monospace; font-size: 10.5px; letter-spacing: .1em;
    text-transform: uppercase; padding: 4px 9px; border: 1px solid #2e3038; border-radius: 999px; color: #9aa0aa; }
  .rev-status.s-review { color: #ffb020; border-color: rgba(255,176,32,.4); }
  .rev-status.s-drafting { color: #7aa2ff; border-color: rgba(122,162,255,.4); }
  .rev-status.s-live { color: #35c98d; border-color: rgba(53,201,141,.4); }
  .rev-status.s-scheduled { color: #b98cff; border-color: rgba(185,140,255,.4); }
  .rev-sys { margin-left: auto; font-family: ui-monospace, Menlo, monospace; font-size: 11px; color: #62666f;
    text-transform: uppercase; letter-spacing: .1em; }
  .rev-doc { max-width: 720px; margin: 0 auto; padding: 40px clamp(16px,4vw,24px) 40px; }
  .rev-eyebrow { font-family: ui-monospace, Menlo, monospace; font-size: 11px; letter-spacing: .16em;
    text-transform: uppercase; color: #ff5a2c; margin: 0 0 14px; }
  .rev-doc h1 { font-size: clamp(30px,5vw,44px); line-height: 1.08; letter-spacing: -.01em; margin: 0 0 16px;
    font-weight: 800; }
  .rev-deck { font-size: 18px; line-height: 1.5; color: #b7bcc4; margin: 0 0 16px; }
  .rev-meta { font-family: ui-monospace, Menlo, monospace; font-size: 11.5px; color: #62666f;
    border-top: 1px solid #24262d; padding-top: 14px; margin: 0 0 8px; }
  .rev-empty { border: 1px dashed #2e3038; border-radius: 12px; padding: 28px; text-align: center; margin-top: 24px; }
  .rev-empty p { margin: 0 0 6px; }
  .rev-dim { color: #62666f; font-size: 13px; }
  .rev-section { margin-top: 34px; }
  .rev-section h2 { font-size: 22px; font-weight: 750; letter-spacing: -.01em; margin: 0 0 12px; }
  .rev-doc p { font-size: 16.5px; line-height: 1.72; color: #d6dae1; margin: 0 0 15px; }
  .rev-cite { font-size: .62em; color: #ff5a2c; margin-left: 2px; }
  .rev-cite a { color: #ff5a2c; text-decoration: none; }
  .rev-evidence { border-left: 3px solid #ffb020; background: #131418; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 4px 0 6px; }
  .rev-evidence span { font-family: ui-monospace, Menlo, monospace; font-size: 10px; letter-spacing: .1em;
    text-transform: uppercase; color: #ffb020; }
  .rev-evidence p { font-size: 14.5px; color: #c7ccd4; margin: 6px 0 0; }
  .rev-takeaways { padding-left: 20px; }
  .rev-takeaways li { font-size: 16px; line-height: 1.6; color: #d6dae1; margin: 0 0 8px; }
  .rev-refs { padding-left: 22px; }
  .rev-refs li { font-size: 14.5px; line-height: 1.55; margin: 0 0 10px; }
  .rev-refs a { color: #ff8a66; text-decoration: underline; text-underline-offset: 2px; }
  .rev-verify { font-size: 12.5px; color: #62666f; margin-top: 16px; }
`;
/* eslint-enable @typescript-eslint/no-explicit-any */
