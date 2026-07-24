"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "/articles", label: "Articles" },
  { href: "/topics/body", label: "Body" },
  { href: "/topics/mind", label: "Mind" },
  { href: "/topics/psychology", label: "Psychology" },
  { href: "/topics/health", label: "Health" },
  { href: "/topics/elevation", label: "Elevation" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-line bg-ink/85 backdrop-blur-xl"
          : "border-line/60 bg-ink"
      }`}
    >
      {/* volt hairline */}
      <div className="h-[2px] w-full bg-volt" />

      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 border-x border-line px-5 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Exalt Human home">
          <Logo />
        </Link>

        <nav className="hidden items-center lg:flex">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 text-[13px] font-medium uppercase tracking-wide transition-colors ${
                  active ? "text-volt" : "text-fg-dim hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/articles"
            className="trans hidden bg-volt px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink hover:bg-fg sm:inline-flex"
          >
            Start learning
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-line text-fg lg:hidden"
          >
            <span className="relative block h-3.5 w-4.5">
              <span
                className={`absolute left-0 block h-0.5 w-4.5 bg-current transition-all ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-4.5 bg-current transition-all ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-4.5 bg-current transition-all ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="border-t border-line bg-ink lg:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col px-5 py-2 sm:px-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line-soft py-3.5 text-sm font-medium uppercase tracking-wide text-fg-dim last:border-0 hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/articles"
              className="mt-4 inline-flex justify-center bg-volt px-4 py-3 text-sm font-bold uppercase tracking-wide text-ink"
            >
              Start learning
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
