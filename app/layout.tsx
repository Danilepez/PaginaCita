import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";

//.

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Una pregunta importante",
  description: "Tengo algo que preguntarte…",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14040f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fraunces.variable}>
      <body
        className="m-0 overflow-hidden"
        style={{ background: "#14040f", fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        {children}
      </body>
    </html>
  );
}
