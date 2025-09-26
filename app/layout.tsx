"use client";
import "./globals.css";
import "./data-tables-css.css";
import { ReactNode } from "react";
import "./satoshi.css";
import ProgressBar from "@/components/common/progress-bar";
import SnackbarProvider from "@/common/contexts/snackbarProvider";
import Providers from "@/components/Providers";
import { useParams } from "next/navigation";
import { I18nProviderClient } from "@/lib/i18n/client";

export default function RootLayout({ children }: { children: ReactNode }) {
  const { locale } = useParams();
  return (
    <html suppressHydrationWarning lang={locale as string}>
      <body>
        <I18nProviderClient locale={locale as string}>
          {/* <Providers> */}
          <Providers>
            <SnackbarProvider>
              <ProgressBar />
              {children}
            </SnackbarProvider>
          </Providers>
        </I18nProviderClient>
        {/* </Providers> */}
      </body>
    </html>
  );
}

