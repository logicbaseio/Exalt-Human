import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-5">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 glow-volt opacity-50" />
      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl border border-line bg-surface p-8">
          <p className="eyebrow text-fg-faint">Contributor access</p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-fg">
            Sign in to Studio
          </h1>
          <p className="mt-2 text-sm text-fg-dim">
            Write and publish to Exalt Human.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
