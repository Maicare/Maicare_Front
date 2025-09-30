"use client";
import { ReactNode,  } from "react";
import ProgressBar from "@/components/common/progress-bar";
import SnackbarProvider from "@/common/contexts/snackbarProvider";
import Providers from "@/components/Providers";
import { useParams } from "next/navigation";
import { I18nProviderClient } from "@/lib/i18n/client";



export default function RootLayout({ children }: { children: ReactNode }) {
  const {locale} = useParams();
  
  return (
    <html suppressHydrationWarning lang={locale as string || "nl"}>
      <body>
        <I18nProviderClient locale={locale as string || "nl"}>
          <Providers>
            <SnackbarProvider>
              <ProgressBar />
              {children}
            </SnackbarProvider>
          </Providers>
        </I18nProviderClient>
      </body>
    </html>
  );
}