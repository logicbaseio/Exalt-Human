/* eslint-disable @typescript-eslint/no-explicit-any */
import type Anthropic from "@anthropic-ai/sdk";

/**
 * Generate a cited ResearchArticle draft with Claude + web search.
 * Returns the body shape lib/content.saveDraft expects. Never fabricates —
 * the system prompt requires real, searched sources, and the result is always
 * saved to `review` status for a human to approve.
 */

export interface DraftInput {
  title: string;
  series: string;
  seriesLabel: string;
  pillar: string;
  note: string;
  source: string;
}

export interface DraftBody {
  deck: string;
  system: string;
  pillar: string;
  readTime: string;
  sections: unknown[];
  takeaways: unknown[];
  references: unknown[];
}

const SCHEMA = `{
  "deck": "one-sentence standfirst that hooks and summarizes",
  "system": "Series · Pillar  (e.g. Human Upgrade · Fitness)",
  "pillar": "the single pillar, e.g. Nutrition",
  "read_time": "e.g. 9 min read",
  "sections": [
    {
      "id": "kebab-case-id",
      "title": "Section heading",
      "paragraphs": [
        { "text": "A clear paragraph.", "citations": [1] },
        { "text": "A paragraph with no citation." }
      ],
      "evidence": { "strength": "Established | Emerging | Context", "text": "what the evidence supports and its limits" }
    }
  ],
  "takeaways": ["3-5 crisp, non-overstated, actionable lines"],
  "references": [
    { "title": "Exact source title", "source": "Journal / Institution (Author et al.)", "year": "2024", "href": "https://real-resolvable-url" }
  ]
}`;

function systemPrompt(input: DraftInput): string {
  return `You are the Chief Research Editor for ExaltHuman, an evidence-based
human-optimization publication that competes with Nature, Peter Attia, and
Huberman Lab — never wellness blogs.

Write a complete, publication-quality article for this brief:
- Working title: ${input.title}
- Series: ${input.seriesLabel}
- Pillar: ${input.pillar || "(choose the best fit)"}
- Angle / note: ${input.note || "(none)"}
- Anchor source hint: ${input.source || "(none — find the best primary sources)"}

Rules (non-negotiable):
- Use the web_search tool to find REAL primary sources (peer-reviewed journals,
  Nature/Science/Cell, NEJM/JAMA/Lancet, NIH/PubMed, university/FDA/WHO/CDC).
- NEVER fabricate a study, statistic, citation, or URL. Every reference href
  must be a real, resolvable link you found. If you cannot verify a claim, do
  not make it.
- State strength of evidence, limitations, sample sizes, and whether findings
  are observational vs randomized. Include at least one "evidence" block.
- Never promise cures or overstate. Keep medical caution; where health-relevant,
  note when to seek clinical care.
- Voice: elite science journalist. Short paragraphs, plain words, strong hook,
  concrete examples. Assume an intelligent non-scientist reader.
- 5-7 sections, each with 1-3 paragraphs. Citations are 1-based indexes into the
  references array.

When your research is complete, output ONLY the final article as a single JSON
object matching this exact shape, inside a \`\`\`json fenced block, with nothing
after it:

${SCHEMA}`;
}

function extractJson(text: string): any | null {
  // prefer a ```json fenced block
  const fence = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fence ? fence[1] : null;
  if (candidate) {
    try {
      return JSON.parse(candidate);
    } catch {}
  }
  // fall back: last balanced {...}
  const start = text.lastIndexOf("{");
  for (let i = start; i >= 0; i = text.lastIndexOf("{", i - 1)) {
    const slice = text.slice(i);
    let depth = 0;
    for (let j = 0; j < slice.length; j++) {
      if (slice[j] === "{") depth++;
      else if (slice[j] === "}") {
        depth--;
        if (depth === 0) {
          try {
            return JSON.parse(slice.slice(0, j + 1));
          } catch {
            break;
          }
        }
      }
    }
  }
  return null;
}

export async function draftArticle(
  client: Anthropic,
  input: DraftInput,
): Promise<DraftBody> {
  let messages: any[] = [
    { role: "user", content: `Research and write: "${input.title}". Follow the system instructions exactly.` },
  ];
  let text = "";

  for (let i = 0; i < 6; i++) {
    const resp: any = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 12000,
      system: systemPrompt(input),
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 6 } as any],
      messages,
    });
    text += resp.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n");
    if (resp.stop_reason === "pause_turn") {
      messages = [...messages, { role: "assistant", content: resp.content }];
      continue;
    }
    break;
  }

  const parsed = extractJson(text);
  if (parsed && Array.isArray(parsed.sections) && parsed.sections.length) {
    return {
      deck: String(parsed.deck ?? ""),
      system: String(parsed.system ?? `${input.seriesLabel} · ${input.pillar}`),
      pillar: String(parsed.pillar ?? input.pillar),
      readTime: String(parsed.read_time ?? "8 min read"),
      sections: parsed.sections,
      takeaways: Array.isArray(parsed.takeaways) ? parsed.takeaways : [],
      references: Array.isArray(parsed.references) ? parsed.references : [],
    };
  }

  // parsing failed — preserve the model output so the human can salvage it
  return {
    deck: "Draft needs review — automatic formatting failed.",
    system: `${input.seriesLabel} · ${input.pillar}`,
    pillar: input.pillar,
    readTime: "",
    sections: [
      {
        id: "raw-draft",
        title: "Raw draft (needs cleanup)",
        paragraphs: [{ text: text.slice(0, 6000) || "No content returned." }],
      },
    ],
    takeaways: [],
    references: [],
  };
}
