// lib/i18n/config.ts
export const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'nl'] as const;
export const DEFAULT_LOCALE = 'nl';

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];