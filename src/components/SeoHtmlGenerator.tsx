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

  // Генерация HTML для главной страницы
  const generateMainPageHtml = () => {
    const meta = content.metaData;
    const canonicalUrl = meta.canonicalUrl || 'https://example.com/';
    const ogImage = `${canonicalUrl.replace(/\/$/, '')}/favicon.png`;
    
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
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Как работают метатеги для поисковиков
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Поисковые боты не выполняют JavaScript. Они видят только статический HTML. 
                Для правильного отображения метатегов нужно создать статические HTML-файлы.
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
