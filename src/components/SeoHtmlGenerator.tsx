import React, { useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { 
  Download, 
  Copy, 
  Check, 
  Globe, 
  FileCode,
  Info,
  FolderOpen,
  Lightbulb
} from 'lucide-react';

// Функция для очистки HTML-тегов из текста
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

// Функция для экранирования HTML-сущностей
const escapeHtml = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const SeoHtmlGenerator: React.FC = () => {
  const { content } = useContent();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Скопировано!');
  };

  const downloadHtml = (html: string, filename: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Файл ${filename} скачан`);
  };

  // Генерация статического контента для SEO (видимого ботам)
  const generateStaticContent = (isMainPage: boolean, pageData?: typeof content.pages[0]) => {
    let staticHtml = '';
    
    if (isMainPage) {
      // Главная страница - полный контент
      
      // Заголовок
      staticHtml += `    <h1>${escapeHtml(content.pageTitle || '')}</h1>\n`;
      
      // Автор
      if (content.author?.name) {
        staticHtml += `    <p>Автор: ${escapeHtml(content.author.name)}</p>\n`;
        if (content.author.description) {
          staticHtml += `    <p>${escapeHtml(content.author.description)}</p>\n`;
        }
      }
      
      // Вступительный текст
      if (content.introText) {
        staticHtml += `    <article>${escapeHtml(stripHtml(content.introText))}</article>\n`;
      }
      
      // Блок перед таблицей
      if (content.beforeTableBlock) {
        if (content.beforeTableBlock.title) {
          staticHtml += `    <h2>${escapeHtml(content.beforeTableBlock.title)}</h2>\n`;
        }
        if (content.beforeTableBlock.paragraphs && content.beforeTableBlock.paragraphs.length > 0) {
          content.beforeTableBlock.paragraphs.forEach(p => {
            staticHtml += `    <p>${escapeHtml(stripHtml(p))}</p>\n`;
          });
        }
      }
      
      // Курсы
      if (content.courses && content.courses.length > 0) {
        staticHtml += `    <h2>Курсы</h2>\n    <ul>\n`;
        content.courses.forEach((course, index) => {
          staticHtml += `      <li>\n`;
          staticHtml += `        <h3>${index + 1}. ${escapeHtml(course.title || '')}</h3>\n`;
          staticHtml += `        <p>Школа: ${escapeHtml(course.school || '')}</p>\n`;
          if (course.price) {
            staticHtml += `        <p>Цена: ${escapeHtml(String(course.price))} руб.</p>\n`;
          }
          if (course.duration) {
            staticHtml += `        <p>Длительность: ${escapeHtml(course.duration)}</p>\n`;
          }
          if (course.features && course.features.length > 0) {
            staticHtml += `        <ul>\n`;
            course.features.forEach(feature => {
              if (feature) {
                staticHtml += `          <li>${escapeHtml(stripHtml(feature))}</li>\n`;
              }
            });
            staticHtml += `        </ul>\n`;
          }
          if (course.advantages && course.advantages.length > 0) {
            staticHtml += `        <p>Преимущества: ${escapeHtml(course.advantages.join(', '))}</p>\n`;
          }
          staticHtml += `      </li>\n`;
        });
        staticHtml += `    </ul>\n`;
      }
      
      // Контентные блоки
      if (content.contentBlocks && content.contentBlocks.length > 0) {
        content.contentBlocks.forEach(block => {
          if (block.title) {
            staticHtml += `    <h2>${escapeHtml(block.title)}</h2>\n`;
          }
          if (block.paragraphs && block.paragraphs.length > 0) {
            block.paragraphs.forEach(p => {
              staticHtml += `    <p>${escapeHtml(stripHtml(p))}</p>\n`;
            });
          }
        });
      }
      
      // FAQ
      if (content.faqData && content.faqData.length > 0) {
        staticHtml += `    <h2>Часто задаваемые вопросы</h2>\n`;
        content.faqData.forEach(faq => {
          staticHtml += `    <h3>${escapeHtml(faq.question || '')}</h3>\n`;
          staticHtml += `    <p>${escapeHtml(stripHtml(faq.answer || ''))}</p>\n`;
        });
      }
      
      // Рекламное раскрытие
      if (content.adDisclosureText) {
        staticHtml += `    <p><small>${escapeHtml(content.adDisclosureText)}</small></p>\n`;
      }
      
    } else if (pageData) {
      // Дополнительная страница
      
      staticHtml += `    <h1>${escapeHtml(pageData.title || '')}</h1>\n`;
      
      // Автор страницы
      if (pageData.author?.name) {
        staticHtml += `    <p>Автор: ${escapeHtml(pageData.author.name)}</p>\n`;
        if (pageData.author.description) {
          staticHtml += `    <p>${escapeHtml(pageData.author.description)}</p>\n`;
        }
      }
      
      // Вступительный текст
      if (pageData.introText) {
        staticHtml += `    <article>${escapeHtml(stripHtml(pageData.introText))}</article>\n`;
      }
      
      // Блок перед таблицей
      if (pageData.beforeTableBlock) {
        if (pageData.beforeTableBlock.title) {
          staticHtml += `    <h2>${escapeHtml(pageData.beforeTableBlock.title)}</h2>\n`;
        }
        if (pageData.beforeTableBlock.paragraphs && pageData.beforeTableBlock.paragraphs.length > 0) {
          pageData.beforeTableBlock.paragraphs.forEach(p => {
            staticHtml += `    <p>${escapeHtml(stripHtml(p))}</p>\n`;
          });
        }
      }
      
      // Курсы страницы
      if (pageData.courses && pageData.courses.length > 0) {
        staticHtml += `    <h2>Курсы</h2>\n    <ul>\n`;
        pageData.courses.forEach((course, index) => {
          staticHtml += `      <li>\n`;
          staticHtml += `        <h3>${index + 1}. ${escapeHtml(course.title || '')}</h3>\n`;
          staticHtml += `        <p>Школа: ${escapeHtml(course.school || '')}</p>\n`;
          if (course.price) {
            staticHtml += `        <p>Цена: ${escapeHtml(String(course.price))} руб.</p>\n`;
          }
          if (course.duration) {
            staticHtml += `        <p>Длительность: ${escapeHtml(course.duration)}</p>\n`;
          }
          if (course.features && course.features.length > 0) {
            staticHtml += `        <ul>\n`;
            course.features.forEach(feature => {
              if (feature) {
                staticHtml += `          <li>${escapeHtml(stripHtml(feature))}</li>\n`;
              }
            });
            staticHtml += `        </ul>\n`;
          }
          if (course.advantages && course.advantages.length > 0) {
            staticHtml += `        <p>Преимущества: ${escapeHtml(course.advantages.join(', '))}</p>\n`;
          }
          staticHtml += `      </li>\n`;
        });
        staticHtml += `    </ul>\n`;
      }
      
      // Контентные блоки страницы
      if (pageData.contentBlocks && pageData.contentBlocks.length > 0) {
        pageData.contentBlocks.forEach(block => {
          if (block.title) {
            staticHtml += `    <h2>${escapeHtml(block.title)}</h2>\n`;
          }
          if (block.paragraphs && block.paragraphs.length > 0) {
            block.paragraphs.forEach(p => {
              staticHtml += `    <p>${escapeHtml(stripHtml(p))}</p>\n`;
            });
          }
        });
      }
      
      // FAQ страницы
      if (pageData.faqData && pageData.faqData.length > 0) {
        staticHtml += `    <h2>Часто задаваемые вопросы</h2>\n`;
        pageData.faqData.forEach(faq => {
          staticHtml += `    <h3>${escapeHtml(faq.question || '')}</h3>\n`;
          staticHtml += `    <p>${escapeHtml(stripHtml(faq.answer || ''))}</p>\n`;
        });
      }
    }
    
    return staticHtml;
  };

  // Генерация HTML для главной страницы
  const generateMainPageHtml = () => {
    const meta = content.metaData;
    const canonicalUrl = meta.canonicalUrl || 'https://example.com/';
    const ogImage = `${canonicalUrl.replace(/\/$/, '')}/favicon.png`;
    const staticContent = generateStaticContent(true);
    
    return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5" />
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <meta name="author" content="${content.author?.name || 'Автор'}" />
    <meta name="robots" content="index, follow" />
    <meta name="keywords" content="${meta.keywords || ''}" />
    
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/favicon.png" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph -->
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:site_name" content="${content.pageTitle?.split(' ').slice(0, 3).join(' ') || 'Сайт'}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${ogImage}" />
    
    <!-- Mobile -->
    <meta name="theme-color" content="#1d7bf5" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  </head>

  <body>
    <div id="root"></div>
    
    <!-- SEO: Статический контент для поисковых ботов -->
    <noscript>
${staticContent}
    </noscript>
    
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>`;
  };

  // Генерация HTML для дополнительной страницы (для папки public/slug/index.html)
  const generatePageHtml = (page: typeof content.pages[0]) => {
    const meta = page.metaData;
    const baseUrl = content.metaData.canonicalUrl?.replace(/\/$/, '') || 'https://example.com';
    const canonicalUrl = meta.canonicalUrl || `${baseUrl}/${page.slug}`;
    const ogImage = `${baseUrl}/favicon.png`;
    const staticContent = generateStaticContent(false, page);
    
    // Пути к ресурсам относительно папки slug/
    return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5" />
    <title>${meta.title || page.title}</title>
    <meta name="description" content="${meta.description || ''}" />
    <meta name="robots" content="index, follow" />
    <meta name="keywords" content="${meta.keywords || ''}" />
    
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/favicon.png" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph -->
    <meta property="og:title" content="${meta.title || page.title}" />
    <meta property="og:description" content="${meta.description || ''}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:locale" content="ru_RU" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title || page.title}" />
    <meta name="twitter:description" content="${meta.description || ''}" />
    <meta name="twitter:image" content="${ogImage}" />
    
    <!-- Mobile -->
    <meta name="theme-color" content="#1d7bf5" />
  </head>

  <body>
    <div id="root"></div>
    
    <!-- SEO: Статический контент для поисковых ботов -->
    <noscript>
${staticContent}
    </noscript>
    
    <script type="module">
      (async () => {
        const candidates = ["/src/main.tsx", "/assets/app.js"]; // dev → prod
        for (const src of candidates) {
          try {
            const res = await fetch(src, { method: "HEAD" });
            if (!res.ok) continue;
            const s = document.createElement("script");
            s.type = "module";
            s.src = src;
            document.body.appendChild(s);
            return;
          } catch {
            // ignore
          }
        }
      })();
    </script>
  </body>
</html>`;
  };

  const mainHtml = generateMainPageHtml();

  return (
    <div className="space-y-6">
      {/* Инфо-блок */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                ✅ SEO-оптимизировано для Яндекса и Google
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                HTML содержит статический контент внутри <code className="bg-green-100 dark:bg-green-900 px-1 rounded">&lt;noscript&gt;</code>, 
                который видят поисковые боты: заголовки, описания курсов, FAQ и другой текст.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Главная страница */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Главная страница
          </CardTitle>
          <CardDescription>
            Замените файл <code className="bg-muted px-1 rounded">index.html</code> в корне проекта
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Title: {content.metaData.title?.length || 0} символов</Badge>
            <Badge variant="outline">Description: {content.metaData.description?.length || 0} символов</Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">+ Статический контент</Badge>
            {content.metaData.canonicalUrl && (
              <Badge variant="secondary">{content.metaData.canonicalUrl}</Badge>
            )}
          </div>
          
          <Textarea 
            value={mainHtml}
            readOnly
            className="font-mono text-xs min-h-[200px]"
          />
          
          <div className="flex gap-2">
            <Button 
              onClick={() => downloadHtml(mainHtml, 'index.html')}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Скачать index.html
            </Button>
            <Button 
              variant="outline"
              onClick={() => copyToClipboard(mainHtml, 'main')}
            >
              {copied === 'main' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Дополнительные страницы */}
      {content.pages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              Дополнительные страницы
            </CardTitle>
            <CardDescription>
              Создайте папки в <code className="bg-muted px-1 rounded">public/</code> для каждой страницы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Инструкция по структуре папок */}
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    ✅ Работает без внешних сервисов!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Vercel сначала ищет статические файлы. Создайте папку для каждой страницы:
                  </p>
                  <div className="bg-green-100 dark:bg-green-900 rounded p-3 font-mono text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      <span>public/</span>
                    </div>
                    {content.pages.slice(0, 3).map(page => (
                      <div key={page.id} className="ml-6 flex items-center gap-2">
                        <FolderOpen className="w-3 h-3" />
                        <span>{page.slug}/</span>
                        <span className="text-green-600">index.html</span>
                      </div>
                    ))}
                    {content.pages.length > 3 && (
                      <div className="ml-6 text-muted-foreground">... и другие</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {content.pages.map((page) => {
                const pageHtml = generatePageHtml(page);
                return (
                  <AccordionItem key={page.id} value={page.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">public/{page.slug}/index.html</span>
                        <Badge variant="outline">/{page.slug}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Title: {page.metaData.title?.length || 0} символов</Badge>
                        <Badge variant="outline">Description: {page.metaData.description?.length || 0} символов</Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">+ Статический контент</Badge>
                      </div>
                      
                      <Textarea 
                        value={pageHtml}
                        readOnly
                        className="font-mono text-xs min-h-[150px]"
                      />
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => downloadHtml(pageHtml, 'index.html')}
                          variant="outline"
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Скачать index.html → положить в public/{page.slug}/
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => copyToClipboard(pageHtml, page.id)}
                        >
                          {copied === page.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Инструкция */}
      <Card>
        <CardHeader>
          <CardTitle>Инструкция по публикации</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Главная страница */}
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium mb-2">Главная страница</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Скачайте <code className="bg-muted px-1 rounded">index.html</code></li>
                <li>Замените файл в корне репозитория</li>
                <li>Сделайте git commit и push</li>
              </ol>
            </div>

            {/* Дополнительные страницы */}
            {content.pages.length > 0 && (
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium mb-2">Дополнительные страницы</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Создайте папку <code className="bg-muted px-1 rounded">public/[slug]/</code> для каждой страницы</li>
                  <li>Скачайте <code className="bg-muted px-1 rounded">index.html</code> и положите в эту папку</li>
                  <li>Сделайте git commit и push</li>
                </ol>
                <p className="text-xs text-muted-foreground mt-2">
                  Пример: для страницы <code>/kursy-menedzhmenta</code> создайте <code>public/kursy-menedzhmenta/index.html</code>
                </p>
              </div>
            )}
          </div>

          {/* После публикации */}
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              ⏱️ <strong>После публикации:</strong> Запросите переиндексацию в Яндекс.Вебмастере или Google Search Console. 
              Изменения появятся в поиске через несколько дней.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
