import type { TopicSlug } from "@/lib/topics";

/** Simple 2px line icons, one per knowledge domain. `color` sets the stroke. */
export function TopicIcon({
  slug,
  size = 28,
  color = "currentColor",
}: {
  slug: TopicSlug;
  size?: number;
  color?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (slug) {
    case "body":
      // torso / strength
      return (
        <svg {...common} aria-hidden>
          <circle cx="16" cy="6.5" r="3" />
          <path d="M8 13c2-1.5 5-2.5 8-2.5s6 1 8 2.5" />
          <path d="M16 10.5V22" />
          <path d="M10 27l2-9M22 27l-2-9" />
          <path d="M8 13l-2 6M24 13l2 6" />
        </svg>
      );
    case "mind":
      // brain / node network
      return (
        <svg {...common} aria-hidden>
          <path d="M16 5c-4 0-7 2.5-7 6 0 1.5.6 2.8 1.5 3.8C9.5 16 9 17.4 9 19c0 4 3.2 7 7 7s7-3 7-7c0-1.6-.5-3-1.5-4.2C22.4 13.8 23 12.5 23 11c0-3.5-3-6-7-6Z" />
          <path d="M16 5v21M12.5 9.5h7M11 15h10M12.5 21h7" />
        </svg>
      );
    case "psychology":
      // head + heart/gears
      return (
        <svg {...common} aria-hidden>
          <path d="M20 27v-4l3-2c1.5-1 2.5-2.8 2.5-5C25.5 10.4 21.7 6.5 17 6.5S8.5 10.4 8.5 15c0 2 1 3.6 2.5 4.5V27" />
          <path d="M17 15.5c1.6-1.7 3.6-.6 3.6 1 0 1.6-2 3-3.6 4.3-1.6-1.3-3.6-2.7-3.6-4.3 0-1.6 2-2.7 3.6-1Z" />
        </svg>
      );
    case "health":
      // heartbeat / shield
      return (
        <svg {...common} aria-hidden>
          <path d="M16 27C9 22.5 5 18 5 12.5 5 8.9 7.7 6 11 6c2 0 3.9 1 5 2.6C17.1 7 19 6 21 6c3.3 0 6 2.9 6 6.5C27 18 23 22.5 16 27Z" />
          <path d="M6 15.5h5l2-4 2.5 7 2-3h4.5" />
        </svg>
      );
    case "elevation":
      // upward chart / peak
      return (
        <svg {...common} aria-hidden>
          <path d="M5 24h22" />
          <path d="M6 20l6-8 4 4 8-11" />
          <path d="M20 5h4v4" />
        </svg>
      );
    default:
      return null;
  }
}
