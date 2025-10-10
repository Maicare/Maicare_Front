"use client";
import { ReactNode,  } from "react";
import ProgressBar from "@/components/common/progress-bar";
import SnackbarProvider from "@/common/contexts/snackbarProvider";
import Providers from "@/components/Providers";
import "./globals.css"
import "./satoshi.css"
import "./data-tables-css.css"



export default function RootLayout({ children }: { children: ReactNode }) {
  
  return (
    <html suppressHydrationWarning lang={"nl"}>
      <body>
          <Providers>
            <SnackbarProvider>
              <ProgressBar />
              {children}
            </SnackbarProvider>
          </Providers>
      </body>
    </html>
  );
}