import { ImagePlayground } from '@/ai/image/components/ImagePlayground';
import { getRandomSuggestions } from '@/ai/image/lib/suggestions';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const pt = await getTranslations({ locale, namespace: 'AIImagePage' });

  return constructMetadata({
    title: pt('title') + ' | ' + t('title'),
    description: pt('description'),
    canonicalUrl: getUrlWithLocale('/ai/image', locale),
  });
}

export default async function AIImagePage() {
  const t = await getTranslations('AIImagePage');

  return (
    <div className="mx-auto space-y-8">
      <ImagePlayground suggestions={getRandomSuggestions(5)} />
    </div>
  );
}
