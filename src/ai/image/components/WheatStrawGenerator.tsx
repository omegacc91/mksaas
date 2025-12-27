'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useLocaleRouter } from '@/i18n/navigation';
import { ArrowRight, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useImageGeneration } from '../hooks/use-image-generation';
import {
  MODEL_CONFIGS,
  type ProviderKey,
} from '../lib/provider-config';
import {
  EXAMPLE_PROMPTS,
  PROMPT_TIPS,
  enhanceWheatStrawPrompt,
} from '../lib/wheat-straw-prompts';

interface WheatStrawGeneratorProps {
  locale?: 'en' | 'zh';
}

export function WheatStrawGenerator({ locale = 'en' }: WheatStrawGeneratorProps) {
  const router = useLocaleRouter();
  const [prompt, setPrompt] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<Array<{
    prompt: string;
    imageUrl: string;
    timestamp: Date;
  }>>([]);

  // 使用自定义状态替代useImageGeneration，实现模拟功能
  const [images, setImages] = useState<Array<{provider: string; image: string | null; modelId: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Array<{provider: string; message: string}>>([]);
  
  // 重置状态函数
  const resetState = () => {
    setImages([]);
    setErrors([]);
    setIsLoading(false);
    setSelectedImageUrl(null);
  };

  const handlePromptSubmit = () => {
    if (!prompt.trim()) return;

    // 重置状态并设置加载状态
    resetState();
    setIsLoading(true);
    
    // 显示加载中的占位符
    setImages([
      {
        provider: 'openai',
        image: null,
        modelId: 'dall-e-3',
      }
    ]);
    
    // 模拟3秒加载时间
    setTimeout(() => {
      // 更新为本地图片URL
      setImages([
        {
          provider: 'openai',
          image: '/images/wheate-straw/ma1.jpg',
          modelId: 'dall-e-3',
        }
      ]);
      
      // 关闭加载状态
      setIsLoading(false);
    }, 3000);
  };

  const handleExamplePromptClick = (examplePrompt: typeof EXAMPLE_PROMPTS[0]) => {
    setPrompt(locale === 'zh' ? examplePrompt.zh : examplePrompt.en);
  };

  const handleRegenerateWithChanges = () => {
    resetState();
    setSelectedImageUrl(null);
  };

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    // Add to history
    setGenerationHistory(prev => [{
      prompt,
      imageUrl,
      timestamp: new Date(),
    }, ...prev.slice(0, 9)]); // Keep last 10
  };

  const handleProceedToCustomization = () => {
    if (!selectedImageUrl) return;
    
    // Store the selected image and prompt in session storage
    sessionStorage.setItem('wheatStrawImage', selectedImageUrl);
    sessionStorage.setItem('wheatStrawPrompt', prompt);
    
    // Navigate to customization page
    router.push('/wheat-straw/customize');
  };

  // 修改示例提示词，将"威严的中国龙"替换为"黑金装饰风马面"
  const modifiedExamplePrompts = EXAMPLE_PROMPTS.map(example => {
    if (example.zh.includes('威严的中国龙')) {
      return {
        ...example,
        zh: '黑金装饰风马面',
        en: 'Black-gold decorative horse fac'
      };
    }
    return example;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Title and Description */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          {locale === 'zh' ? '麦秆画创作' : 'Wheat straw painting'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'zh' 
            ? '使用AI创作传统中国麦秆画艺术作品' 
            : 'Create traditional Chinese wheat straw painting art with AI'}
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={locale === 'zh' 
                ? '描述您想要创作的麦秆画，例如：黑金装饰风马面' 
                : 'Describe the wheat straw painting you want to create, e.g., Black-gold decorative horse fac'}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Example Prompts */}
          <div>
            <p className="text-sm font-medium mb-2">
              {locale === 'zh' ? '示例提示词：' : 'Example Prompts:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {modifiedExamplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExamplePromptClick(example)}
                  className="text-xs"
                >
                  {locale === 'zh' ? example.zh : example.en}
                </Button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">
              {locale === 'zh' ? '创作建议：' : 'Tips:'}
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {PROMPT_TIPS[locale].map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handlePromptSubmit} 
              disabled={isLoading || !prompt.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {locale === 'zh' ? '生成中...' : 'Generating...'}
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {locale === 'zh' ? '生成麦秆画' : 'Generate Wheat Straw Painting'}
                </>
              )}
            </Button>
            {images.length > 0 && (
              <Button 
                variant="outline"
                onClick={handleRegenerateWithChanges}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Images */}
      {images.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {locale === 'zh' ? '生成结果' : 'Generated Results'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((result, index) => (
                <div key={result.provider} className="space-y-2">
                  {result.image ? (
                    <div 
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageUrl === result.image 
                          ? 'border-primary ring-2 ring-primary' 
                          : 'border-transparent hover:border-muted'
                      }`}
                      onClick={() => handleSelectImage(result.image!)}
                    >
                      <img
                        src={result.image}
                        alt={`Generated ${index}`}
                        className="w-full h-auto object-cover"
                      />
                      {selectedImageUrl === result.image && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                            {locale === 'zh' ? '已选择' : 'Selected'}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  {locale === 'zh' ? '生成过程中出现错误：' : 'Errors during generation:'}
                </p>
                <ul className="text-xs text-destructive mt-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Proceed Button */}
            {selectedImageUrl && (
              <div className="mt-6 flex justify-center">
                <Button 
                  size="lg"
                  onClick={handleProceedToCustomization}
                  className="min-w-[200px]"
                >
                  {locale === 'zh' ? '选择产品规格' : 'Choose Product Options'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generation History */}
      {generationHistory.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {locale === 'zh' ? '历史记录' : 'History'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {generationHistory.map((item, index) => (
                <div 
                  key={index}
                  className="cursor-pointer rounded-lg overflow-hidden border hover:border-primary transition-colors"
                  onClick={() => {
                    setPrompt(item.prompt);
                    setSelectedImageUrl(item.imageUrl);
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={`History ${index}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

