export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* mark: an upward chevron/pulse — "elevation" */}
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-volt">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 12.5 L6.2 5 L9 9.5 L11.4 3 L16 12.5"
            stroke="#08090b"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold tracking-tight text-fg">
          EXALT
        </span>
        <span className="text-[15px] font-extrabold tracking-tight text-fg-dim">
          HUMAN
        </span>
      </span>
    </span>
  );
}
