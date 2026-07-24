/**
 * The five knowledge domains of Exalt Human.
 * Every article belongs to exactly one domain. The `slug` is the URL key and
 * the value stored in the database `topic` column.
 */
export type TopicSlug = "body" | "mind" | "psychology" | "health" | "elevation";

export interface Topic {
  slug: TopicSlug;
  name: string;
  /** short line used on cards / hero */
  tagline: string;
  /** longer intro used on the topic landing page */
  intro: string;
  /** css color token name -> resolved hex, used for accents */
  color: string;
  /** faint tint for backgrounds */
  tint: string;
}

export const TOPICS: Topic[] = [
  {
    slug: "body",
    name: "Body",
    tagline: "The machine you live in.",
    intro:
      "Muscle, bone, hormones, sleep, movement and recovery. Understand the systems that let you move, adapt and rebuild — and the inputs that make them stronger.",
    color: "#c8ff3d",
    tint: "rgba(200,255,61,0.10)",
  },
  {
    slug: "mind",
    name: "Mind",
    tagline: "Attention, memory, focus.",
    intro:
      "The brain as trainable hardware. Cognition, neuroplasticity, focus and the mechanics of learning — how to sharpen the instrument you think with.",
    color: "#4fd8ff",
    tint: "rgba(79,216,255,0.10)",
  },
  {
    slug: "psychology",
    name: "Psychology",
    tagline: "Why you do what you do.",
    intro:
      "Behavior, emotion, motivation and habit. The operating patterns beneath your choices — and how to rewrite the ones that hold you back.",
    color: "#b696ff",
    tint: "rgba(182,150,255,0.10)",
  },
  {
    slug: "health",
    name: "Health",
    tagline: "Defend the baseline.",
    intro:
      "Nutrition, immunity, longevity and prevention. What damages the system and what protects it — the science of staying alive and well for longer.",
    color: "#3ff0a0",
    tint: "rgba(63,240,160,0.10)",
  },
  {
    slug: "elevation",
    name: "Elevation",
    tagline: "Beyond the baseline.",
    intro:
      "Performance, discipline, energy and human potential. Where body, mind and psychology converge — the practice of becoming a more capable version of yourself.",
    color: "#ffc24b",
    tint: "rgba(255,194,75,0.10)",
  },
];

export const TOPIC_SLUGS = TOPICS.map((t) => t.slug) as TopicSlug[];

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

/** Safe lookup that always returns something renderable. */
export function topicOf(slug: string): Topic {
  return getTopic(slug) ?? TOPICS[0];
}
