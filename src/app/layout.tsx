import type { Metadata } from "next";
import { MotionConfig } from "framer-motion";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import NewsletterFullscreen from "@/components/sections/NewsletterFullscreen";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getMe } from "@/lib/api";
import { defaultPalette, themeCss } from "@/lib/theme";
import { allPaletteCss, allPaletteInitScript } from "@/lib/palette-candidates";
import ThemePicker from "@/components/ui/ThemePicker";

/**
 * A theme is only switchable in local dev. `NODE_ENV` is inlined at build time,
 * so a production build ships the shipped palette and nothing else: the
 * candidates never reach the CSS, the restore script is not emitted, and
 * `ThemePicker` renders null. Not hidden behind a media query or a CSS
 * `display: none`, simply not there.
 */
const isDev = process.env.NODE_ENV !== "production";
const paletteCss = isDev ? allPaletteCss() : themeCss({ ember: defaultPalette });
const restoreScript = isDev ? allPaletteInitScript() : "";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let data;
  const BASE_URL = process.env.API_URL || "http://localhost:3001";
  try {
    const res = await fetch(
      `${BASE_URL}/api/publicmetadata`,
      {
        next: { revalidate: 86400 }, // 1 day
      }
    );

    data = await res.json();
  } catch {
    data = {
      title: "Shubham Kumar",
      description: "Senior Engineer II",
    };
  }

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    authors: [{ name: data.author, url: data.url }],
    creator: data.author,

    icons: {
      apple: "/apple-touch-icon.png",
      icon: "/favicon.ico",
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      url: data.url,
      title: data.title,
      description: data.description,
      siteName: data.siteName,
      images: data.images,
    },

    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      creator: data.twitter,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let me: { name: string; avatarUrl: string; about: string } = {
    name: "Shubham Kumar",
    avatarUrl: "",
    about: "Senior Engineer II",
  };
  try {
    me = await getMe();
  } catch {}

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shubham Kumar",
    url: "https://www.shubhkumar.in",
    jobTitle: me.about,
    sameAs: [
      "https://github.com/shubhamkumar",
      "https://linkedin.com/in/shubhamkumar",
      "https://twitter.com/shubhamkumar",
    ],
  };

  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: paletteCss }} />
        {restoreScript ? <script dangerouslySetInnerHTML={{ __html: restoreScript }} /> : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-surface text-on-surface font-body">
        <AnimatedBackground />
        <MotionConfig reducedMotion="user">
          <div className="relative z-10">
            {children}
            <NewsletterFullscreen name={me.name} avatarUrl={me.avatarUrl} />
            <ThemePicker />
            <Analytics />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
            <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "81cd3bc5c97945c4b8b57909f87a3926"}'></script>
          </div>
        </MotionConfig>
      </body>
    </html>
  );
}
