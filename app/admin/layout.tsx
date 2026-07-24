import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "./actions";
import { Logo } from "@/components/logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = await getSession();

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Exalt Human home">
              <Logo />
            </Link>
            <span className="hidden rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-fg-faint sm:inline">
              Studio
            </span>
          </div>

          {email && (
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="text-sm font-medium text-fg-dim hover:text-fg"
              >
                Articles
              </Link>
              <Link
                href="/admin/new"
                className="rounded-full bg-volt px-3.5 py-1.5 text-sm font-semibold text-ink"
              >
                New
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-fg-dim hover:text-fg"
                >
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
