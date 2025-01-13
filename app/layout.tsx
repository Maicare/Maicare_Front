"use client";
import "./globals.css";
import "./data-tables-css.css";
// import Guards from "@/components/common/Guards";
// import Providers from "@/components/Providers";
import { ReactNode } from "react";
import "./satoshi.css";
import ProgressBar from "@/components/common/progress-bar";
import SnackbarProvider from "@/common/contexts/snackbarProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="nl">
      <body>
        {/* <Providers> */}

        <SnackbarProvider>
          <ProgressBar/>
          {children}
        </SnackbarProvider>
        {/* </Providers> */}
      </body>
    </html>
  );
}
