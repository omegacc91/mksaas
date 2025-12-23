'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Xiangqing1() {
  const t = useTranslations('HomePage.zodiacGallery');

  return (
    <section className="px-4 py-16 bg-white">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {t('zodiac.Straw Luster')}
          </h1>
          <p className="text-xl text-foreground/70">麦秆流光・羽蝶蜓</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{t('currencySymbol')}199</p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/wheate-straw/xiongzhen2.jpg"
            alt="麦秆流光・羽蝶蜓"
            width={800}
            height={1500}
            className="object-contain"
          />
        </div>

      </div>
    </section>
  );
}