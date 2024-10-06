import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from './sidebar';
import styles from "../styles/main.module.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "It Is Done",
  description: "Accounting Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className={styles.app_container}>
          <Sidebar/>
          <div className={styles.content_container}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
