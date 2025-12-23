'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Xiangqing2() {
  const t = useTranslations('HomePage.zodiacGallery');

  return (
    <section className="px-4 py-16 bg-white">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {t('zodiac.Straw Misty Blue')}
          </h1>
          <p className="text-xl text-foreground/70">麦秆烟蓝・蝶影</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{t('currencySymbol')}299</p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/wheate-straw/erzhui2.jpg"
            alt="麦秆烟蓝・蝶影"
            width={1000}
            height={1500}
            className="object-contain"
          />
        </div>

        
      </div>
    </section>
  );
}