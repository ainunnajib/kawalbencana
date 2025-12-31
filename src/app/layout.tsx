import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KawalBencana - Platform Pemulihan Ekonomi Aceh & Sumatera",
  description:
    "Platform untuk mengawal pemulihan ekonomi jangka panjang pasca bencana banjir dan longsor Aceh-Sumatera 2024-2025",
  keywords: [
    "bencana",
    "aceh",
    "sumatera",
    "pemulihan ekonomi",
    "bantuan",
    "transparansi",
    "gotong royong",
  ],
  authors: [{ name: "KawalBencana Team" }],
  openGraph: {
    title: "KawalBencana - Platform Pemulihan Ekonomi Aceh & Sumatera",
    description:
      "Platform untuk mengawal pemulihan ekonomi jangka panjang pasca bencana",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
