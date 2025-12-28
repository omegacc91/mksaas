/**
 * Wheat Straw Painting (麦秆画) Prompt Engineering
 * 
 * This module provides utilities for generating prompts that guide AI models
 * to create images in the traditional Chinese wheat straw painting art style.
 */

/**
 * Base style description for wheat straw paintings
 */
const WHEAT_STRAW_STYLE_EN = `in the style of traditional Chinese wheat straw painting (麦秆画), made from natural wheat stalks, featuring intricate layering, warm golden-brown tones, natural fiber texture, delicate craftsmanship, subtle gradients from light beige to deep amber, organic material aesthetic, handcrafted artisan quality, traditional Chinese folk art`;

const WHEAT_STRAW_STYLE_ZH = `传统中国麦秆画风格，由天然麦秸制作，精致的分层效果，温暖的金棕色调，天然纤维质感，精湛的手工艺，从浅米色到深琥珀色的微妙渐变，有机材料美学，手工匠人品质，中国传统民间艺术`;

/**
 * Quality and technical modifiers for better AI generation
 */
const QUALITY_MODIFIERS = `high quality, detailed, masterpiece, best quality, professional photograph, 8k resolution`;

/**
 * Negative prompt to avoid unwanted elements
 */
const NEGATIVE_PROMPT = `low quality, blurry, pixelated, modern materials, plastic, synthetic, painting, digital art, cartoon, anime`;

/**
 * Detects if the text is primarily Chinese characters
 */
function isChinese(text: string): boolean {
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const chineseChars = text.match(chineseRegex);
  if (!chineseChars) return false;
  return chineseChars.length > text.length * 0.3;
}

/**
 * Enhances user prompt with wheat straw painting style descriptors
 * 
 * @param userPrompt - The user's original prompt
 * @param options - Configuration options
 * @returns Enhanced prompt optimized for wheat straw painting generation
 */
export function enhanceWheatStrawPrompt(
  userPrompt: string,
  options: {
    includeQualityModifiers?: boolean;
    intensityLevel?: 'subtle' | 'moderate' | 'strong';
  } = {}
): string {
  const {
    includeQualityModifiers = true,
    intensityLevel = 'moderate',
  } = options;

  const chinese = isChinese(userPrompt);
  const styleDescriptor = chinese ? WHEAT_STRAW_STYLE_ZH : WHEAT_STRAW_STYLE_EN;

  // Adjust style intensity
  let stylePrefix = '';
  switch (intensityLevel) {
    case 'subtle':
      stylePrefix = 'subtly inspired by ';
      break;
    case 'strong':
      stylePrefix = 'entirely in ';
      break;
    case 'moderate':
    default:
      stylePrefix = '';
  }

  // Build the enhanced prompt
  const parts: string[] = [];
  
  // Add user's subject
  parts.push(userPrompt.trim());
  
  // Add style descriptor
  parts.push(stylePrefix + styleDescriptor);
  
  // Add quality modifiers if requested
  if (includeQualityModifiers) {
    parts.push(QUALITY_MODIFIERS);
  }

  return parts.join(', ');
}

/**
 * Get the negative prompt for wheat straw painting generation
 */
export function getWheatStrawNegativePrompt(): string {
  return NEGATIVE_PROMPT;
}

/**
 * Pre-defined prompt templates for common subjects
 */
export const WHEAT_STRAW_TEMPLATES = {
  landscape: {
    en: 'Chinese landscape with mountains, rivers, and pavilions',
    zh: '中国山水风景，山川河流，亭台楼阁',
  },
  flowers: {
    en: 'Traditional Chinese flowers and plants, elegant composition',
    zh: '传统中国花卉植物，优雅构图',
  },
  animals: {
    en: 'Traditional Chinese animal motif, such as dragons, phoenixes, or cranes',
    zh: '传统中国动物图案，如龙凤仙鹤',
  },
  portrait: {
    en: 'Portrait in traditional Chinese style with delicate features',
    zh: '传统中国风格肖像，精致的五官',
  },
  architecture: {
    en: 'Traditional Chinese architecture with intricate details',
    zh: '传统中国建筑，精致细节',
  },
  abstract: {
    en: 'Abstract patterns with flowing lines and natural forms',
    zh: '抽象图案，流畅的线条和自然形态',
  },
} as const;

/**
 * Get a template prompt by category
 */
export function getTemplatePrompt(
  category: keyof typeof WHEAT_STRAW_TEMPLATES,
  locale: 'en' | 'zh' = 'en'
): string {
  return WHEAT_STRAW_TEMPLATES[category][locale];
}

/**
 * Suggestions for users on how to create effective prompts
 */
export const PROMPT_TIPS = {
  en: [
    'Describe the main subject clearly (e.g., "panda eating bamboo")',
    'Include compositional elements (e.g., "centered", "profile view")',
    'Mention desired colors if specific (e.g., "golden tones", "warm colors")',
    'Add contextual details (e.g., "in a bamboo forest", "with mountains in background")',
    'Keep it concise - 1-2 sentences work best',
  ],
  zh: [
    '清晰描述主要主题（例如："熊猫吃竹子"）',
    '包含构图元素（例如："居中"，"侧面视图"）',
    '如果有具体要求，提及期望的颜色（例如："金色调"，"暖色"）',
    '添加背景细节（例如："在竹林中"，"背景有山峦"）',
    '保持简洁 - 1-2句话效果最佳',
  ],
};

/**
 * Example prompts to inspire users
 */
export const EXAMPLE_PROMPTS = [
  {
    en: 'A majestic Chinese dragon flying through clouds',
    zh: '威严的中国龙在云中飞翔',
  },
  {
    en: 'Blooming peony flowers with delicate petals',
    zh: '盛开的牡丹花，花瓣精致',
  },
  {
    en: 'Traditional Chinese pavilion by a peaceful lake',
    zh: '宁静湖边的传统中国亭台',
  },
  {
    en: 'Graceful crane standing on one leg',
    zh: '优雅的仙鹤单脚站立',
  },
  {
    en: 'Mountain landscape with winding river valley',
    zh: '蜿蜒河谷的山水风光',
  },
  {
    en: 'Bamboo grove in gentle breeze',
    zh: '微风中的竹林',
  },
  {
    en: 'Black-gold decorative horse fac',
    zh: '黑金装饰风马面',
  },
];

