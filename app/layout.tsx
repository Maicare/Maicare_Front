"use client";
import "./globals.css";
import "./data-tables-css.css";
import { ReactNode, useEffect, useState } from "react";
import "./satoshi.css";
import ProgressBar from "@/components/common/progress-bar";
import SnackbarProvider from "@/common/contexts/snackbarProvider";
import Providers from "@/components/Providers";
import { useParams, useRouter, usePathname } from "next/navigation";
import { I18nProviderClient } from "@/lib/i18n/client";

const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'nl'];
const DEFAULT_LOCALE = 'nl';

export default function RootLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const locale = params.locale as string;

  useEffect(() => {
    // Check if we need to redirect due to missing or invalid locale
    if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
      setIsRedirecting(true);
      
      // Get preferred locale from various sources
      const getPreferredLocale = (): string => {
        // 1. Check if there's a locale in the current path (invalid one)
        const pathLocale = pathname.split('/')[1];
        if (SUPPORTED_LOCALES.includes(pathLocale)) {
          return pathLocale;
        }
        
        // 2. Check localStorage for previous preference
        if (typeof window !== 'undefined') {
          const storedLocale = localStorage.getItem('preferred-locale');
          if (storedLocale && SUPPORTED_LOCALES.includes(storedLocale)) {
            return storedLocale;
          }
        }
        
        // 3. Check browser language
        if (typeof navigator !== 'undefined') {
          const browserLang = navigator.language.split('-')[0];
          if (SUPPORTED_LOCALES.includes(browserLang)) {
            return browserLang;
          }
        }
        
        // 4. Default to NL
        return DEFAULT_LOCALE;
      };

      const preferredLocale = getPreferredLocale();
      
      // Extract the clean path without any locale prefix
      let cleanPath = pathname;
      SUPPORTED_LOCALES.forEach(loc => {
        if (cleanPath.startsWith(`/${loc}/`)) {
          cleanPath = cleanPath.replace(`/${loc}`, '');
        } else if (cleanPath === `/${loc}`) {
          cleanPath = '/';
        }
      });

      // Construct new URL with proper locale
      const newPath = `/${preferredLocale}${cleanPath === '/' ? '' : cleanPath}`;
      
      // Only redirect if we're not already on the correct path
      if (pathname !== newPath) {
        router.replace(newPath);
      } else {
        setIsRedirecting(false);
      }
    } else {
      // Valid locale detected, save it for future visits
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-locale', locale);
      }
      setIsRedirecting(false);
    }
  }, [locale, pathname, router]);

  // Show loading state during redirection
  if (isRedirecting || !locale || !SUPPORTED_LOCALES.includes(locale)) {
    return (
      <html suppressHydrationWarning lang={DEFAULT_LOCALE}>
        <body>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Setting up your language preferences...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html suppressHydrationWarning lang={locale}>
      <body>
        <I18nProviderClient locale={locale}>
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