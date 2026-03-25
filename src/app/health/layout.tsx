import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
