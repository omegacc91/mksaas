'use client';

import { AnimatedGroup } from '@/components/tailark/motion/animated-group';
import { HeaderSection } from '@/components/layout/header-section';
import { BorderBeam } from '@/components/magicui/border-beam';
import type { Variants } from 'motion/react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 1.2,
      },
    },
  } as Variants,
};

// Chinese zodiac data with image filenames
const zodiacAnimals = [
  { id: 'rat', name: '鼠', image: 'shu.jpg' },
  { id: 'ox', name: '牛', image: 'niu.jpg' },
  { id: 'tiger', name: '虎', image: 'hu.jpg' },
  { id: 'rabbit', name: '兔', image: 'tu.jpg' },
  { id: 'dragon', name: '龙', image: 'long.jpg' },
  { id: 'snake', name: '蛇', image: 'she.jpg' },
  { id: 'horse', name: '马', image: 'ma.jpg' },
  { id: 'goat', name: '羊', image: 'yang.jpg' },
  { id: 'monkey', name: '猴', image: 'hou.jpg' },
  { id: 'rooster', name: '鸡', image: 'ji.jpg' },
  { id: 'dog', name: '狗', image: 'gou.jpg' },
  { id: 'pig', name: '猪', image: 'zhu.jpg' },
];

export default function ZodiacGallery() {
  const t = useTranslations('HomePage.zodiacGallery');
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);

  return (
    <section id="zodiac-gallery" className="px-4 py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5" />

      <div className="mx-auto max-w-7xl space-y-12">
        <HeaderSection
          title={t('title')}
          subtitle={t('subtitle')}
          subtitleAs="h2"
          description={t('description')}
          descriptionAs="p"
        />

        {/* Gallery Grid */}
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            },
            ...transitionVariants,
          }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {zodiacAnimals.map((zodiac) => (
            <motion.div
              key={zodiac.id}
              className="group relative aspect-square cursor-pointer"
              onClick={() => setSelectedZodiac(zodiac.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card container with border and shadow */}
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/40">
                {/* Image */}
                <Image
                  src={`/images/wheate-straw/${zodiac.image}`}
                  alt={`${t(`zodiac.${zodiac.id}` as any)} - ${zodiac.name}`}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Zodiac name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold text-center text-sm md:text-base">
                    {t(`zodiac.${zodiac.id}` as any)}
                  </p>
                  <p className="text-white/80 text-center text-xs md:text-sm">
                    {zodiac.name}
                  </p>
                </div>

                {/* Border beam effect on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <BorderBeam
                    duration={8}
                    size={100}
                    className="from-transparent via-primary/50 to-transparent"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatedGroup>

        {/* Modal for enlarged view */}
        {selectedZodiac && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedZodiac(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-primary/50 shadow-2xl">
                <Image
                  src={`/images/wheate-straw/${
                    zodiacAnimals.find((z) => z.id === selectedZodiac)?.image
                  }`}
                  alt={t(`zodiac.${selectedZodiac}` as any)}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
                <BorderBeam
                  duration={6}
                  size={200}
                  className="from-transparent via-primary to-transparent"
                />
              </div>
              <button
                onClick={() => setSelectedZodiac(null)}
                className="absolute -top-12 right-0 text-white hover:text-primary transition-colors text-sm font-medium"
              >
                {t('close')} ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
