import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${protocol}://${host}` : "https://exalt-human.sites.openai.com";

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Exalt Human — Understand the system you live in",
      template: "%s — Exalt Human",
    },
    description:
      "Evidence-led intelligence for the human body, mind, psychology, and health.",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      title: "Exalt Human",
      description: "The most important system you’ll ever understand is your own.",
      type: "website",
      url: origin,
      siteName: "Exalt Human",
      images: [
        {
          url: `${origin}/og.png`,
          width: 1200,
          height: 630,
          alt: "Exalt Human — Understand the system you live in",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Exalt Human",
      description: "The most important system you’ll ever understand is your own.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
