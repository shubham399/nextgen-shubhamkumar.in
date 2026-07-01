import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "../globals.css";

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
        next: { revalidate: 86400 },
      }
    );

    data = await res.json();
  } catch {
    data = {
      title: "Shubham Kumar",
      description: "Associate Lead Engineer",
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased bg-surface text-on-surface font-body">
        {children}
      </body>
    </html>
  );
}
