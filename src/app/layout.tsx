import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ACC Moment | Wedding Content Creator Tulungagung",
  description:
    "Wedding Content Creator & All Event di Tulungagung dan sekitarnya. Abadikan momen spesialmu dengan konten pernikahan berkualitas.",
};

export default async function RootLayout(props: LayoutProps<"/">) {
  const { children } = props;

  return (
    <html lang="id" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
