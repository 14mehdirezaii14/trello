import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Trello Clone - Demo Board",
  description: "Trello Clone built with Next.js, TypeScript and SCSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
