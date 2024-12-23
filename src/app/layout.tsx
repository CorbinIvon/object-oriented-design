import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TerminalWrapper from "./components/TerminalWrapper";
import Footer from "./components/Footer";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Object Oriented Design App",
  description: "A site for creating relational object-oriented designs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geistMono.variable}>
        <TerminalWrapper>{children}</TerminalWrapper>
        <Footer />
      </body>
    </html>
  );
}
