import { Roadmap } from '@/components/diceui/roadmap';
import Container from '@/components/layout/container';
import { constructMetadata } from '@/lib/metadata';
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
  const pt = await getTranslations({ locale, namespace: 'RoadmapPage' });

  return constructMetadata({
    title: pt('title') + ' | ' + t('title'),
    description: pt('description'),
    locale,
    pathname: '/roadmap',
  });
}

/**
 * inspired by https://nsui.irung.me/roadmap
 */
export default async function RoadmapPage() {
  const t = await getTranslations('RoadmapPage');

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-7xl space-y-8 pb-16">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-center text-3xl font-bold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-center text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* Roadmap */}
        <div className="flex justify-center w-full">
          <Roadmap />
        </div>
      </div>
    </Container>
  );
}
