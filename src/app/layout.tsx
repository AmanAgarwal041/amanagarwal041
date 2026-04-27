import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500"],
});

const title = "Aman Agarwal — Principal Software Engineer & Co-founder";
const description =
  "Principal Software Engineer at Transilience AI building AI-powered security platforms. Co-founder of OpenLIT — open-source LLM observability with 2.4k+ GitHub stars.";
const url = "https://amanagarwal.dev";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  authors: [{ name: "Aman Agarwal", url }],
  keywords: [
    "Aman Agarwal", "Principal Software Engineer", "OpenLIT",
    "Transilience AI", "LLM Observability", "AI Security",
    "React", "TypeScript", "Next.js", "Frontend Engineer", "Co-founder",
  ],
  openGraph: { type: "website", url, title, description, siteName: "Aman Agarwal" },
  twitter: { card: "summary_large_image", site: "@_typeofnull", creator: "@_typeofnull", title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aman Agarwal",
  jobTitle: "Principal Software Engineer",
  url,
  sameAs: [
    "https://github.com/AmanAgarwal041",
    "https://www.linkedin.com/in/amanagarwal041/",
    "https://x.com/_typeofnull",
    "https://www.npmjs.com/~typeofnull",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-canvas antialiased">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
