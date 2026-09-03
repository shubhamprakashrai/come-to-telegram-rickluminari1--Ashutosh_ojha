import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Background3D from "@/components/Background3D";
import DisclaimerModal from "@/components/DisclaimerModal";
import { AuthProvider } from "@/components/AuthProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ashutoshojha.com"),
  title: {
    default: "Advocate Ashutosh Ojha | High Court Legal Counsel & Consultant",
    template: "%s | Adv. Ashutosh Ojha",
  },
  description:
    "Official legal chamber of Advocate Ashutosh Ojha. Providing specialized counsel in Commercial Arbitration, Corporate Advisory, Civil Disputes, and High Court Writ Jurisdictions.",
  keywords: [
    "Ashutosh Ojha",
    "Advocate Ashutosh Ojha",
    "Delhi High Court Advocate",
    "Corporate Lawyer India",
    "Commercial Arbitration Lawyer",
    "Legal Consultant Delhi",
    "Civil Dispute Lawyer",
    "Writ Petition Advocate",
  ],
  authors: [{ name: "Advocate Ashutosh Ojha", url: "https://ashutoshojha.com" }],
  creator: "Advocate Ashutosh Ojha",
  publisher: "Ashutosh Law Chambers",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ashutoshojha.com",
    siteName: "Advocate Ashutosh Ojha",
    title: "Advocate Ashutosh Ojha | Legal Counsel & Consultant",
    description:
      "Expert legal advisory, commercial litigation, arbitration, and High Court representation by Advocate Ashutosh Ojha.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Advocate Ashutosh Ojha Law Chambers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Advocate Ashutosh Ojha | Legal Counsel & Consultant",
    description:
      "Expert legal advisory, commercial litigation, arbitration, and High Court representation by Advocate Ashutosh Ojha.",
    images: ["https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200"],
  },
  alternates: {
    canonical: "https://ashutoshojha.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "Advocate Ashutosh Ojha Chambers",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
    url: "https://ashutoshojha.com",
    telephone: "+91-9918730999",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      addressCountry: "IN",
    },
    description: "Legal consultancy and advocacy in Commercial Litigation, Arbitration, and High Court Jurisdictions.",
    sameAs: [
      "https://www.linkedin.com/in/ashutoshojha15/"
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col relative bg-slate-900 text-white">
        <Background3D />
        <DisclaimerModal />
        <AuthProvider>
          <div className="relative z-10">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
