import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

//.

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "Nuestra próxima aventura",
  description: "Planeemos algo juntos.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a090c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={sora.variable}>
      <body style={{ fontFamily: "var(--font-sora), system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
