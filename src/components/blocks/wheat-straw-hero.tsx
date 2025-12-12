import { AnimatedGroup } from '@/components/tailark/motion/animated-group';
import { TextEffect } from '@/components/tailark/motion/text-effect';
import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Variants } from 'motion/react';
import { useTranslations } from 'next-intl';

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

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background - subtle radial gradients matching main hero */}
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden opacity-40 contain-strict lg:block"
      >
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

      {/* Subtle gradient overlay using theme colors */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5" />

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
            className="mb-6 text-balance text-4xl font-bold tracking-tight font-bricolage-grotesque sm:text-5xl md:text-6xl lg:text-7xl"
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
            className="mb-8 text-balance text-lg text-muted-foreground md:text-xl lg:text-2xl"
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

          {/* Feature highlights with improved styling */}
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
            className="mt-12 grid gap-6 sm:grid-cols-3"
          >
            <div className="group rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-1">
              <div className="mb-3 text-3xl transition-transform duration-300 group-hover:scale-110">
                🎨
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {t('feature1Title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('feature1Desc')}
              </p>
            </div>

            <div className="group rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-1">
              <div className="mb-3 text-3xl transition-transform duration-300 group-hover:scale-110">
                🚀
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {t('feature2Title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('feature2Desc')}
              </p>
            </div>

            <div className="group rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-1">
              <div className="mb-3 text-3xl transition-transform duration-300 group-hover:scale-110">
                📦
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {t('feature3Title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('feature3Desc')}
              </p>
            </div>
          </AnimatedGroup>
        </div>
      </div>
    </section>
  );
}
