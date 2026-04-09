import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});

const SITE_URL = "https://cligentic.railly.dev";
const SITE_NAME = "cligentic";
const SITE_TITLE = "cligentic: Copy-paste CLI blocks for the agent era";
const SITE_DESCRIPTION =
  "Your CLI is the last thing agents touch. Copy-paste blocks for trust ladders, killswitches, --json dual mode, audit trails. Battle-tested in CLIs shipping real money and real taxes.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | cligentic",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "cli",
    "shadcn",
    "copy-paste",
    "agent",
    "claude code",
    "cursor",
    "bun",
    "typescript",
    "registry",
    "agent-safe",
    "killswitch",
    "trust ladder",
    "json mode",
    "cli framework",
    "cli toolkit",
  ],
  authors: [{ name: "Railly Hugo", url: "https://railly.dev" }],
  creator: "Railly Hugo",
  publisher: "Railly Hugo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "cligentic: CLI blocks for the agent era",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@raillyhugo",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: {
    canonical: SITE_URL,
  },
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
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted JSON-LD
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "cligentic",
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "macOS, Linux, Windows",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Person",
                name: "Railly Hugo",
                url: "https://railly.dev",
              },
              license: "https://opensource.org/licenses/MIT",
            }),
          }}
        />
      </head>
      <body className="viewport-frame bg-[color:var(--color-bg)] text-[color:var(--color-fg)] antialiased">
        {children}
      </body>
    </html>
  );
}
