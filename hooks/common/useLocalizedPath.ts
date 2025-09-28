// hooks/useLocalizedPath.ts
'use client';

import { useParams } from 'next/navigation';
import { getLocalizedPath, getCleanPath } from '@/utils/paths';
import type { SupportedLocale } from '@/lib/i18n/config';

export function useLocalizedPath() {
  const params = useParams();
  const currentLocale = params.locale as SupportedLocale;

  const localizedPath = (path: string, locale?: SupportedLocale): string => {
    return getLocalizedPath(path, locale || currentLocale);
  };

  const withLocale = (path: string, locale?: SupportedLocale): string => {
    return localizedPath(path, locale);
  };

  return {
    localizedPath,
    withLocale,
    getCleanPath,
    currentLocale,
  };
}