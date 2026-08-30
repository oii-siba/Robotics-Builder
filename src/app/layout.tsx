import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#0A0E17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://robotics-builder.vercel.app'),
  title: {
    default: "Robotics Builder | Free Online 3D Robotics CAD, Circuit Diagram & Firmware Studio",
    template: "%s | Robotics Builder",
  },
  description: "Design modular robots in 3D, build photorealistic circuit diagrams with ESP32 & Arduino, route multi-point Manhattan wires with jump arches, write firmware code in Monaco IDE, and share online for free.",
  keywords: [
    "Robotics Builder",
    "circuit diagram online",
    "circuit diagram maker",
    "robotics circuit simulator",
    "free fritzing online alternative",
    "ESP32 circuit designer",
    "Arduino robotics wiring",
    "L298N motor driver wiring diagram",
    "3D robotics CAD",
    "robot simulator online",
    "circuit editor with jump wires",
    "electronic component netlist generator",
    "robotics chassis assembly",
    "autonomous robot designer",
    "রোবটিক্স সার্কিট বিল্ডার",
    "সার্কিট ডায়াগ্রাম অনলাইন",
  ],
  authors: [{ name: "Robotics Builder Inc." }],
  creator: "Robotics Builder",
  publisher: "Robotics Builder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://robotics-builder.vercel.app",
    siteName: "Robotics Builder",
    title: "Robotics Builder | Free Online 3D Robotics CAD & Circuit Studio",
    description: "Build photorealistic robotics circuits, 3D modular robots, and write C++ firmware in browser. Design, Build & Innovate.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "Robotics Builder - Design • Build • Innovate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Robotics Builder | Design • Build • Innovate",
    description: "Design modular robots in 3D and wire photorealistic circuit schematics with ESP32, Arduino, and Motors online.",
    images: ["/logo.png"],
    creator: "@roboticsbuilder",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "7k9X_xbFeKPnKrnkgpyNrTZIR07NN0IsCNgOKBU7kb4",
  },
  category: "technology",
};

// Google Schema.org JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Robotics Builder",
  "operatingSystem": "All",
  "applicationCategory": "DesignApplication, EducationalApplication, EngineeringApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "description": "Interactive web-based 3D Robotics CAD, Photorealistic Circuit Diagram Wiring Workbench, and Microcontroller Firmware IDE.",
  "image": "https://robotics-builder.vercel.app/logo.png",
  "softwareVersion": "2.0",
  "featureList": [
    "Photorealistic vector hardware circuit diagram editor",
    "Multi-point orthogonal Manhattan wire routing with jump arches",
    "3D Modular robotics assembly CAD",
    "Microcontroller firmware Monaco IDE editor",
    "Bill of Materials (BOM) cost and power calculator",
    "One-click online project sharing and forking",
    "Gmail OTP secure cloud project synchronization"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
