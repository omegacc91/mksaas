import { DEFAULT_LOCALE, LOCALES } from '@/i18n/routing';
import type { I18nConfig } from 'fumadocs-core/i18n';

/**
 * Internationalization configuration for FumaDocs
 *
 * https://fumadocs.dev/docs/ui/internationalization
 */
export const docsI18nConfig = {
  defaultLanguage: DEFAULT_LOCALE,
  languages: LOCALES,
  hideLocale: 'default-locale',
  parser: 'dot' as const,
} satisfies I18nConfig;
