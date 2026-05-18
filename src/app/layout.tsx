import type { Metadata } from "next";
import { Space_Grotesk, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/client/providers/ThemeProvider";
import { AuthProvider } from "@/app/components/client/providers/AuthProvider";
import { TooltipProvider } from "@/shadcn/components/ui/tooltip";
import localFont from "next/font/local";
import { getDataSourceStatus } from "@/api/services/homeSections";
import { IS_DEV_BUILD } from "@/config/buildTarget";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  const locale = await getLocale();
  const ogLocale = locale === "pt-br" ? "pt_BR" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    authors: [{ name: "Nicholas Emery", url: "https://nicholasemery.com" }],
    applicationName: t("title"),
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://newsly-portal.vercel.app/",
      siteName: t("title"),
      images: [
        {
          url: "https://newsly-portal.vercel.app/images/og-image.png",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
      locale: ogLocale,
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
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const isDevEnvironment = IS_DEV_BUILD;

  const dataSource = IS_DEV_BUILD
    ? (await getDataSourceStatus()).displaySource
    : "api";

  const DevEnvironmentNotice = IS_DEV_BUILD
    ? (await import("@/app/components/client/feedback/DevEnvironmentNotice"))
        .default
    : null;

  return (
    <html
      lang={locale}
      className={`h-screen w-screen overflow-x-hidden font-sans ${inter.variable}`}
    >
      <body
        className={`${poppins.variable} ${poppinsLocal.variable} ${spaceGrotesk.variable} ${spaceGroteskLocal.variable} antialiased bg-gray-100 dark:bg-[#1a202c] min-w-screen min-h-screen transition-colors duration-500`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          {DevEnvironmentNotice && (
            <DevEnvironmentNotice
              isDevEnvironment={isDevEnvironment}
              dataSource={dataSource}
            />
          )}
          <TooltipProvider>
            <AuthProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </AuthProvider>
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
