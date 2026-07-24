import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-5">
      <div className="grain" aria-hidden />
      <div className="relative z-[2] w-full max-w-sm">
        <div className="border-t-2 border-volt border-x border-b border-line bg-surface p-8">
          <p className="eyebrow text-fg-faint">Contributor access</p>
          <h1 className="display mt-4 text-4xl text-fg">Sign in to Studio</h1>
          <p className="mt-2 text-sm text-fg-dim">
            Write and publish to Exalt Human.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
