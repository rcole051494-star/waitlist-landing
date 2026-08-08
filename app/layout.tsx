import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { TutorProvider } from "@/lib/tutor/context";
import { TutorPanel } from "@/components/TutorPanel";
import { TutorShell } from "@/components/TutorShell";

export const metadata: Metadata = {
  title: "Code Forge — Learn Python & JavaScript by doing",
  description:
    "An immersive, evidence-based way to learn modern Python and JavaScript. Active recall, spaced repetition, live code, projects.",
  manifest: "/manifest.webmanifest",
  applicationName: "Code Forge",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Code Forge",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#07080b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased">
        <TutorProvider>
          <TutorShell>{children}</TutorShell>
          <TutorPanel />
        </TutorProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
