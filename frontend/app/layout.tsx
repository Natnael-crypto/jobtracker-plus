import type { Metadata } from "next";
import { Saira } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
});

export const metadata: Metadata = {
  title: "JobTracker +",
  description: "Build & Maintain with Confidence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${saira.className} antialiased font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
