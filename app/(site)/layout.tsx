import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-col">
      <div className="grain" aria-hidden />
      <SiteHeader />
      <main className="relative z-[2] flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
