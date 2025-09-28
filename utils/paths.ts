// lib/utils/path-utils.ts
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/i18n/config';

/**
 * Generates a localized path by prepending the current locale
 */
export function getLocalizedPath(path: string, locale: string): string {
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Remove any existing locale from the path to avoid duplicates
  const cleanPath = normalizedPath.replace(new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})`), '');
  
  // Return locale + path
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Extracts the clean path without locale prefix
 */
export function getCleanPath(path: string): string {
  const cleanPath = path.replace(new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})`), '');
  return cleanPath === '' ? '/' : cleanPath;
}

/**
 * Gets the locale from a path
 */
export function getLocaleFromPath(path: string): string {
  const match = path.match(new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})`));
  return match ? match[1] : DEFAULT_LOCALE;
}