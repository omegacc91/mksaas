import * as Preview from '@/components/docs';
import { getMDXComponents } from '@/components/docs/mdx-components';
import { PremiumBadge } from '@/components/premium/premium-badge';
import { PremiumGuard } from '@/components/premium/premium-guard';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { LOCALES } from '@/i18n/routing';
import { constructMetadata } from '@/lib/metadata';
import { checkPremiumAccess } from '@/lib/premium-access';
import { getSession } from '@/lib/server';
import { source } from '@/lib/source';
import Link from 'fumadocs-core/link';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

export function generateStaticParams() {
  const slugParams = source.generateParams();
  const params = LOCALES.flatMap((locale) =>
    slugParams.map((param) => ({
      locale,
      slug: param.slug,
    }))
  );

  return params;
}

export async function generateMetadata({ params }: DocPageProps) {
  const { slug, locale } = await params;
  const language = locale as string;
  const page = source.getPage(slug, language);
  if (!page) {
    console.warn('docs page not found', slug, language);
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: `${page.data.title} | ${t('title')}`,
    description: page.data.description,
    locale,
    pathname: page.slugs.length > 0 ? `/docs/${page.slugs.join('/')}` : '/docs',
  });
}

function PreviewRenderer({ preview }: { preview: string }): ReactNode {
  if (preview && preview in Preview) {
    const Comp = Preview[preview as keyof typeof Preview];
    return <Comp />;
  }

  return null;
}

export const revalidate = false;

interface DocPageProps {
  params: Promise<{
    slug?: string[];
    locale: Locale;
  }>;
}

/**
 * Doc Page
 *
 * ref:
 * https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/app/docs/%5B...slug%5D/page.tsx
 */
export default async function DocPage({ params }: DocPageProps) {
  const { slug, locale } = await params;
  const language = locale as string;
  const page = source.getPage(slug, language);

  if (!page) {
    console.warn('docs page not found', slug, language);
    notFound();
  }

  const preview = page.data.preview;
  const { premium } = page.data;

  // Check premium access for premium docs
  const session = await getSession();
  const hasPremiumAccess =
    premium && session?.user?.id
      ? await checkPremiumAccess(session.user.id)
      : !premium; // Non-premium docs are always accessible

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk',
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      {premium && <PremiumBadge size="sm" className="mt-2" />}
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        {/* Preview Rendered Component */}
        {preview ? <PreviewRenderer preview={preview} /> : null}

        {/* MDX Content */}
        <PremiumGuard
          isPremium={!!premium}
          canAccess={hasPremiumAccess}
          className="max-w-none"
        >
          <MDX
            components={getMDXComponents({
              a: ({
                href,
                ...props
              }: { href?: string; [key: string]: any }) => {
                const found = source.getPageByHref(href ?? '');

                if (!found) return <Link href={href} {...props} />;

                return (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Link
                        href={
                          found.hash
                            ? `${found.page.url}#${found.hash}`
                            : found.page.url
                        }
                        {...props}
                      />
                    </HoverCardTrigger>
                    <HoverCardContent className="text-sm">
                      <p className="font-medium">{found.page.data.title}</p>
                      <p className="text-fd-muted-foreground">
                        {found.page.data.description}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                );
              },
            })}
          />
        </PremiumGuard>
      </DocsBody>
    </DocsPage>
  );
}
