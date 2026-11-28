import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_TAGLINE } from "@/lib/site-meta";

const TITLE = SITE_TITLE;
const DESCRIPTION =
  "Shaban Shaikh is a cloud and infrastructure engineer in Mumbai, building reliable, automated and observable platforms with AWS, Kubernetes, Terraform and CI/CD.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  keywords: [
    "Shaban Shaikh",
    "cloud engineer",
    "infrastructure engineer",
    "DevOps",
    "platform engineering",
    "Kubernetes",
    "Terraform",
    "AWS",
    "CI/CD",
    "Mumbai",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/icons/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-144.png", sizes: "144x144", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_TAGLINE,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_TAGLINE,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8e5df" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  jobTitle: "Cloud & Infrastructure Engineer",
  url: SITE_URL,
  description: SITE_TAGLINE,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressCountry: "IN",
  },
  sameAs: [
    "https://github.com/22shaban",
    "https://www.linkedin.com/in/isthatshaban",
  ],
  knowsAbout: [
    "Cloud infrastructure",
    "Kubernetes",
    "Terraform",
    "CI/CD",
    "Observability",
    "AWS",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: ["shabanshaikh.me", "Shaban Shaikh — Cloud & Infrastructure Engineer"],
  url: SITE_URL,
  inLanguage: "en",
  publisher: {
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'ink' || stored === 'fog'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'ink' : 'fog');
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'fog';
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="fog" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/InstrumentSerif-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="grain">
        <ThemeProvider>
          <SmoothScroll />
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
