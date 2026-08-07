import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Forge — Learn Python & JavaScript by doing",
  description:
    "An immersive, evidence-based way to learn modern Python and JavaScript. Active recall, spaced repetition, live code, projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased">
        {children}
      </body>
    </html>
  );
}
