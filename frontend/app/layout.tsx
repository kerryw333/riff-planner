import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riff Planner",
  description: "Chat with Gemini + Google Search to plan your trip",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
