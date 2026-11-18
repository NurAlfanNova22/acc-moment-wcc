import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Great_Vibes } from "next/font/google";
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

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cursive",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ACC Moment | WCC & All Event Tulungagung, Blitar, Kediri & Trenggalek",
  description:
    "Your personal content creator. Melayani Wedding Content Creator & All Event di Tulungagung, Blitar, Kediri, Trenggalek dan sekitarnya.",
};

export default async function RootLayout(props: LayoutProps<"/">) {
  const { children } = props;

  return (
    <html
      lang="id"
      className={`${playfair.variable} ${dmSans.variable} ${greatVibes.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
