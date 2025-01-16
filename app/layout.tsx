"use client";
import "./globals.css";
import "./data-tables-css.css";
import { ReactNode } from "react";
import "./satoshi.css";
import ProgressBar from "@/components/common/progress-bar";
import SnackbarProvider from "@/common/contexts/snackbarProvider";
import Providers from "@/components/Providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="nl">
      <body>
        {/* <Providers> */}
        <Providers>
          <SnackbarProvider>
            <ProgressBar />
            {children}
          </SnackbarProvider>
        </Providers>
        {/* </Providers> */}
      </body>
    </html>
  );
}
