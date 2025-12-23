'use client';

// 导入必要的组件和库
import { AnimatedGroup } from '@/components/tailark/motion/animated-group'; // 动画分组组件
import { HeaderSection } from '@/components/layout/header-section'; // 头部区域组件
import { BorderBeam } from '@/components/magicui/border-beam'; // 边框光束动画效果
import type { Variants } from 'motion/react'; // 动画变体类型
import { motion } from 'motion/react'; // 动画库
import { useTranslations } from 'next-intl'; // 国际化翻译钩子
import Image from 'next/image'; // 图片组件
import Link from 'next/link'; // 链接组件
import { useState } from 'react'; // 状态管理钩子

// 定义动画变体 - 控制画廊项的入场动画效果
const transitionVariants = {
  item: {
    hidden: {
      opacity: 0, // 初始透明度为0
      y: 20, // 初始向下偏移20px
      scale: 0.95, // 初始缩放0.95倍
    },
    visible: {
      opacity: 1, // 显示时透明度为1
      y: 0, // 位置回到正常
      scale: 1, // 缩放回到1倍
      transition: {
        type: 'spring' as const, // 使用弹簧动画
        bounce: 0.3, // 弹跳强度
        duration: 1.2, // 动画持续时间
      },
    },
  } as Variants,
};


const zodiacAnimals = [
  { id: 'Summer Pond with Fish & Lotus', name: '夏塘鱼趣', image: "1.jpg", price: 69 },
  { id: 'Straw Misty Blue', name: '寒梅迎春', image: "2.jpg", price: 66 },
  { id: 'Ambitions Unfolding', name: '大展宏图', image: "33.jpg", price: 88 },
  { id: 'Spring Blossoms & Two Birds', name: '春枝双雀', image: "55.jpg", price: 68 },
  { id: 'Welcome Spring', name: '报春', image: "8.jpg", price: 59 }, 
  { id: 'Flowers and Birds', name: '花鸟', image: "3.jpg", price: 79 },
  { id: 'Pine and Crane', name: '松鹤', image: "4.jpg", price: 75 },
  { id: 'Landscape', name: '山水', image: "5.jpg", price: 89 },
];


export default function ZodiacGallery() {
  // 初始化国际化翻译
  const t = useTranslations('HomePage.zodiacGallery');
  // 状态管理：跟踪当前选中的生肖（用于大图预览）
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);

  return (
    // 画廊主容器
    <section id="zodiac-gallery" className="px-4 py-16 relative overflow-hidden bg-white dark:bg-card">

      <div className="mx-auto max-w-7xl space-y-12">
        <HeaderSection
          title={t('title')}
          subtitleAs="h2"
          description={t('description')}
          descriptionAs="p"
        />

        {/* Gallery Grid */}
        {/* 画廊网格 - 使用动画分组实现项的顺序入场效果 */}
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.08, // 子元素入场延迟间隔
                },
              },
            },
            ...transitionVariants,
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6" // 2行4列网格布局
        >
          {/* 遍历生肖数据，渲染每个生肖卡片 */}
          {zodiacAnimals.map((zodiac) => (
            <motion.div
              key={zodiac.id} // 唯一标识符
              className="group relative aspect-square cursor-pointer" // 卡片容器样式 - 正方形比例
              whileHover={{ scale: 1.05 }} // 鼠标悬停时的缩放效果
              whileTap={{ scale: 0.98 }} // 鼠标点击时的缩放效果
            >
              {/* 为特定图片添加超链接 */}
              {zodiac.image === "xiongzhen.jpg" ? (
                <Link href="/wheat-straw/brooch-detail" passHref>
                  <div className="relative h-full w-full overflow-hidden rounded-md shadow-md cursor-pointer">
                    <Image
                      src={`/images/wheate-straw/${zodiac.image}`} // 图片路径
                      alt={`${t(`zodiac.${zodiac.id}` as any)} - ${zodiac.name}`} // 图片描述
                      fill // 填充容器
                      className="object-cover" // 图片样式
                      sizes="(max-width: 768px) 50vw, 25vw" // 响应式图片尺寸
                    />
                  </div>
                </Link>
              ) : zodiac.image === "erzhui.jpg" ? (
                <Link href="/wheat-straw/earrings-detail" passHref>
                  <div className="relative h-full w-full overflow-hidden rounded-md shadow-md cursor-pointer">
                    <Image
                      src={`/images/wheate-straw/${zodiac.image}`} // 图片路径
                      alt={`${t(`zodiac.${zodiac.id}` as any)} - ${zodiac.name}`} // 图片描述
                      fill // 填充容器
                      className="object-cover" // 图片样式
                      sizes="(max-width: 768px) 50vw, 25vw" // 响应式图片尺寸
                    />
                  </div>
                </Link>
              ) : (
                // 其他图片保持原有功能
                <div 
                  className="relative h-full w-full overflow-hidden rounded-md shadow-md cursor-pointer"
                  onClick={() => setSelectedZodiac(zodiac.id)} // 点击事件：打开大图预览
                >
                  <Image
                    src={`/images/wheate-straw/${zodiac.image}`} // 图片路径
                    alt={`${t(`zodiac.${zodiac.id}` as any)} - ${zodiac.name}`} // 图片描述
                    fill // 填充容器
                    className="object-cover" // 图片样式
                    sizes="(max-width: 768px) 50vw, 25vw" // 响应式图片尺寸
                  />
                </div>
              )}
              {/* 标题部分 - 始终显示在图片下方 */}
              <div className="mt-1 p-3 bg-amber-50 dark:bg-muted/50 rounded-md text-center">
                <p className="text-base font-medium text-foreground">
                  {t(`zodiac.${zodiac.id}` as any)}
                </p>
                <p className="text-sm text-foreground/70">
                  {zodiac.name}
                </p>
                <p className="text-lg font-bold text-red-600 mt-1">
                  {t('currencySymbol')}{zodiac.price}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatedGroup>

        {/* 大图预览模态框 */}
        {selectedZodiac && (
          <motion.div
            initial={{ opacity: 0 }} // 初始状态：透明
            animate={{ opacity: 1 }} // 显示时：不透明
            exit={{ opacity: 0 }} // 退出时：透明
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" // 全屏背景
            onClick={() => setSelectedZodiac(null)} // 点击背景关闭模态框
          >
            {/* 模态框内容容器 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} // 初始状态：缩小且透明
              animate={{ scale: 1, opacity: 1 }} // 显示时：正常大小且不透明
              exit={{ scale: 0.9, opacity: 0 }} // 退出时：缩小且透明
              className="relative max-w-3xl w-full aspect-square" // 内容容器样式
              onClick={(e) => e.stopPropagation()} // 阻止事件冒泡（防止点击内容关闭模态框）
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-primary/50 shadow-2xl">
                {/* 放大的生肖图片 */}
              <Image
                  src={`/images/wheate-straw/${
                    zodiacAnimals.find((z) => z.id === selectedZodiac)?.image // 根据选中的ID查找对应图片
                  }`}
                  alt={t(`zodiac.${selectedZodiac}` as any)} // 图片描述
                  fill // 填充容器
                  className="object-contain" // 图片适应方式
                  sizes="(max-width: 768px) 100vw, 896px" // 响应式图片尺寸
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
