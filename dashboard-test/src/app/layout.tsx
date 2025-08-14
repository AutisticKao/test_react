import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Dashboard",
  description: "Junior FE Dashboard Technical Test",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {children}
      </body>
    </html>
  );
}
