import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pagify - AI-Powered PDF Summarizer & Query Tool",
  description:
    "Upload PDFs, get AI-generated summaries, ask questions, and hear answers in Indian English. Built with Next.js and MongoDB.",
  keywords: [
    "Pagify",
    "AI PDF reader",
    "PDF summarizer",
    "document analysis",
    "text-to-speech PDF",
    "Next.js",
    "MongoDB",
  ],
  authors: [{ name: "Aakarsh Tiwari" }],
  robots: "index, follow",
  openGraph: {
    title: "Pagify - AI-Powered PDF Summarizer & Query Tool",
    description:
      "Upload PDFs, get concise summaries, ask questions, and hear answers with Pagify's AI and text-to-speech in Indian English.",
    url: "https://pagify.aakarshtiwari.com",
    type: "website",
    images: [
      {
        url: "https://pagify.aakarshtiwari.com/images/pagify.webp",
        width: 1200,
        height: 630,
        alt: "Pagify Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pagify - AI-Powered PDF Summarizer & Query Tool",
    description:
      "Pagify: Summarize PDFs, query content, and listen to answers in Indian English.",
    images: ["https://pagify.aakarshtiwari.com/images/pagify.webp"],
    site: "@aakarshtiwari08",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
