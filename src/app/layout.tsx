import type { Metadata } from "next";
import { Space_Grotesk, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/client/ThemeProvider";
import localFont from "next/font/local";
import { resolveDataSourceMode } from "@/api/connection/http";
import { getDataSourceStatus } from "@/api/services/homeSections";
import { IS_DEV_BUILD } from "@/config/buildTarget";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const spaceGroteskLocal = localFont({
  src: [
    {
      path: "../../public/fonts/SpaceGrotesk-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/SpaceGrotesk-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk-fallback",
});

const poppinsLocal = localFont({
  src: [
    {
      path: "../../public/fonts/Poppins-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins-fallback",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "700"],
  variable: "--font-space-grotesk",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Newsly Portal",
  description: "Seu portal de notícias atualizado e confiável.",
  authors: [{ name: "Nicholas Emery", url: "https://nicholasemery.com" }],
  applicationName: "Newsly Portal",
  keywords: [
    "notícias",
    "atualidades",
    "portal de notícias",
    "jornalismo",
    "informação",
    "notícias online",
    "notícias do dia",
    "notícias internacionais",
    "notícias locais",
    "notícias de última hora",
    "notícias confiáveis",
    "notícias em tempo real",
    "notícias de tecnologia",
  ],
  openGraph: {
    title: "Newsly Portal",
    description: "Seu portal de notícias atualizado e confiável.",
    url: "https://newsly-portal.vercel.app/",
    siteName: "Newsly Portal",
    images: [
      {
        url: "https://newsly-portal.vercel.app/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Newsly Portal",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  publisher: "Nicholas Emery",
  creator: "Nicholas Emery",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDevEnvironment = IS_DEV_BUILD;

  const dataSource = IS_DEV_BUILD
    ? (await getDataSourceStatus()).datasource
    : "api";

  const DevEnvironmentNotice = IS_DEV_BUILD
    ? (await import("@/app/components/client/DevEnvironmentNotice")).default
    : null;

  return (
    <html lang="pt-br" className={cn("h-screen w-screen overflow-x-hidden", "font-sans", inter.variable)}>
      <body
        className={`${poppins.variable} ${poppinsLocal.variable} ${spaceGrotesk.variable} ${spaceGroteskLocal.variable} antialiased bg-gray-100 dark:bg-[#1a202c] min-w-screen min-h-screen transition-colors duration-500`}
      >
        {DevEnvironmentNotice && (
          <DevEnvironmentNotice
            isDevEnvironment={isDevEnvironment}
            dataSource={dataSource}
          />
        )}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
