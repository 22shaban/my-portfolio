import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "Your Name — Creative Developer",
  description:
    "An editorial portfolio template for creative developers: fluid WebGL, smooth scroll and typographic detail. All content is placeholder.",
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Your Name — Creative Developer",
    description:
      "Editorial portfolio template with WebGL, GSAP and Lenis. Placeholder content.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8e5df" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
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
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
