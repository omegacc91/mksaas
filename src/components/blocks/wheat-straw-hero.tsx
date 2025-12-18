'use client'
import { AnimatedGroup } from '@/components/tailark/motion/animated-group';
import { TextEffect } from '@/components/tailark/motion/text-effect';
import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Variants } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      y: 12,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  } as Variants,
};

export default function WheatStrawHero() {
  const t = useTranslations('HomePage.wheatStrawHero');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 定义轮播图片
  const images = [
    '/images/yingxiongqu1/qingming.jpg',
    '/images/yingxiongqu1/shouye1.jpg',
    '/images/yingxiongqu1/shouye2.jpg'
  ];

  // 自动轮播逻辑
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 每5秒切换一张图片

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background image carousel */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* Background mask overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/40 via-black/30 to-black/50" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge with animation */}
          <AnimatedGroup variants={transitionVariants}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-2 text-sm font-medium text-primary border border-primary/20 shadow-sm">
              <Sparkles className="h-4 w-4" />
              {t('badge')}
            </div>
          </AnimatedGroup>

          {/* Title with text effect */}
          <TextEffect
            per="line"
            preset="fade-in-blur"
            speedSegment={0.3}
            as="h1"
            className="mb-6 text-balance text-4xl font-bold tracking-tight font-bricolage-grotesque text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t('title')}
          </TextEffect>

          {/* Description with text effect */}
          <TextEffect
            per="line"
            preset="fade-in-blur"
            speedSegment={0.3}
            delay={0.3}
            as="p"
            className="mb-8 text-balance text-lg text-white/90 md:text-xl lg:text-2xl"
          >
            {t('description')}
          </TextEffect>

          {/* Action buttons with animation */}
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.6,
                  },
                },
              },
              ...transitionVariants,
            }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <div
              key={1}
              className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
            >
              <Button
                size="lg"
                asChild
                className="rounded-xl px-5 text-base cursor-pointer"
              >
                <LocaleLink href="/wheat-straw">
                  {t('cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </LocaleLink>
              </Button>
            </div>

            <Button
              key={2}
              size="lg"
              variant="outline"
              asChild
              className="h-10.5 rounded-xl px-5 cursor-pointer"
            >
              <LocaleLink href="/pricing">{t('viewPricing')}</LocaleLink>
            </Button>
          </AnimatedGroup>

          {/* Feature highlights styled like cards */}
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.8,
                  },
                },
              },
              ...transitionVariants,
            }}
            className="mt-16 grid gap-8 sm:grid-cols-3"
          >
            <div className="group relative rounded-xl bg-gradient-to-br from-[#3B1E13] to-[#C89557] p-8 shadow-xl transition-all duration-400 hover:shadow-2xl hover:-translate-y-3">

              <div className="mb-4 text-4xl transition-transform duration-400 group-hover:scale-120 text-white">
                🎨
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">
                {t('feature1Title')}
              </h3>
              <p className="text-base text-white/90 leading-relaxed">
                {t('feature1Desc')}
              </p>
            </div>

            <div className="group relative rounded-xl bg-gradient-to-br from-[#3B1E13] to-[#C89550] p-8 shadow-xl transition-all duration-400 hover:shadow-2xl hover:-translate-y-3">

              <div className="mb-4 text-4xl transition-transform duration-400 group-hover:scale-120 text-white">
                🚀
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">
                {t('feature2Title')}
              </h3>
              <p className="text-base text-white/90 leading-relaxed">
                {t('feature2Desc')}
              </p>
            </div>

            <div className="group relative rounded-xl bg-gradient-to-br from-[#3B1E13] to-[#C89557] p-8 shadow-xl transition-all duration-400 hover:shadow-2xl hover:-translate-y-3">

              <div className="mb-4 text-4xl transition-transform duration-400 group-hover:scale-120 text-white">
                📦
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">
                {t('feature3Title')}
              </h3>
              <p className="text-base text-white/90 leading-relaxed">
                {t('feature3Desc')}
              </p>
            </div>
          </AnimatedGroup>
        </div>
      </div>
    </section>
  );
}
