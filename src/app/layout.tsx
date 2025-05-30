import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/Provider";
export const metadata: Metadata = {
  title: "Krishan Traders",
  description: "App for managing stocks of Krishan Traders - A small business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`antialiased`} suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
