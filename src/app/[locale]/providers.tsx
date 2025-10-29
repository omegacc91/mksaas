'use client';

import { PostHogProvider } from '@/analytics/posthog-analytics';
import { ActiveThemeProvider } from '@/components/layout/active-theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { websiteConfig } from '@/config/website';
import type { Translations } from 'fumadocs-ui/i18n';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { useTranslations } from 'next-intl';
import { ThemeProvider, useTheme } from 'next-themes';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
  locale: string;
}

/**
 * Providers
 *
 * This component is used to wrap the app in the providers.
 *
 * - PostHogProvider: Provides the PostHog analytics to the app.
 * - QueryProvider: Provides the query client to the app.
 * - ThemeProvider: Provides the theme to the app.
 * - ActiveThemeProvider: Provides the active theme to the app.
 * - RootProvider: Provides the root provider for Fumadocs UI.
 * - TooltipProvider: Provides the tooltip to the app.
 */
export function Providers({ children, locale }: ProvidersProps) {
  const theme = useTheme();
  const defaultMode = websiteConfig.ui.mode?.defaultMode ?? 'system';

  // available languages that will be displayed in the docs UI
  // make sure `locale` is consistent with your i18n config
  const locales = Object.entries(websiteConfig.i18n.locales).map(
    ([locale, data]) => ({
      name: data.name,
      locale,
    })
  );

  // translations object for fumadocs-ui from our message files
  const t = useTranslations('DocsPage');
  const translations: Partial<Translations> = {
    toc: t('toc'),
    search: t('search'),
    lastUpdate: t('lastUpdate'),
    searchNoResult: t('searchNoResult'),
    previousPage: t('previousPage'),
    nextPage: t('nextPage'),
    chooseLanguage: t('chooseLanguage'),
  };

  return (
    <PostHogProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme={defaultMode}
          enableSystem={true}
          disableTransitionOnChange
        >
          <ActiveThemeProvider>
            <RootProvider
              theme={theme}
              i18n={{ locale, locales, translations }}
            >
              <TooltipProvider>{children}</TooltipProvider>
            </RootProvider>
          </ActiveThemeProvider>
        </ThemeProvider>
      </QueryProvider>
    </PostHogProvider>
  );
}
