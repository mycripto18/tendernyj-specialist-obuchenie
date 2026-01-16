import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Settings, FileJson, Globe, Users, HelpCircle, Layers, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Tutorial = () => {
  return (
    <>
      <Helmet>
        <title>Туториал — Руководство пользователя</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                На главную
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Туториал</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Intro */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Руководство пользователя</h1>
            <p className="text-muted-foreground text-lg">
              Полное руководство по использованию сайта и админ-панели.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <QuickLink 
              icon={<Globe className="w-5 h-5" />}
              title="Главная страница"
              description="Структура и навигация"
              href="#main-page"
            />
            <QuickLink 
              icon={<GraduationCap className="w-5 h-5" />}
              title="Просмотр курсов"
              description="Карточки и детали"
              href="#courses"
            />
            <QuickLink 
              icon={<Settings className="w-5 h-5" />}
              title="Админ-панель"
              description="Вход и интерфейс"
              href="#admin"
            />
            <QuickLink 
              icon={<Layers className="w-5 h-5" />}
              title="Управление контентом"
              description="Редактирование данных"
              href="#content"
            />
            <QuickLink 
              icon={<FileJson className="w-5 h-5" />}
              title="Экспорт/Импорт"
              description="Работа с JSON"
              href="#export-import"
            />
            <QuickLink 
              icon={<HelpCircle className="w-5 h-5" />}
              title="FAQ"
              description="Частые вопросы"
              href="#faq"
            />
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {/* Main Page */}
            <Section id="main-page" title="Главная страница сайта" icon={<Globe className="w-5 h-5" />}>
              <p className="mb-4">Главная страница содержит следующие блоки:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Шапка</strong> — заголовок статьи с количеством отзывов и датой обновления</li>
                <li><strong>Навигация</strong> — быстрые ссылки на разделы сайта</li>
                <li><strong>Блок автора</strong> — информация об авторе статьи с фото</li>
                <li><strong>Вступительный текст</strong> — краткое описание темы</li>
                <li><strong>Критерии выбора</strong> — на что обращать внимание при выборе курса</li>
                <li><strong>Список курсов</strong> — карточки с кратким описанием курсов</li>
                <li><strong>Детали курсов</strong> — подробная информация о каждом курсе</li>
                <li><strong>FAQ</strong> — часто задаваемые вопросы</li>
              </ul>
            </Section>

            {/* Courses */}
            <Section id="courses" title="Просмотр курсов" icon={<GraduationCap className="w-5 h-5" />}>
              <h4 className="font-semibold mb-2">Карточки курсов</h4>
              <p className="mb-4">Каждая карточка содержит:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>🏷️ Бейдж (ТОП, Популярный, Новый)</li>
                <li>🏫 Логотип школы</li>
                <li>📝 Название курса</li>
                <li>💰 Цена и старая цена (если есть скидка)</li>
                <li>📅 Длительность</li>
                <li>✨ Ключевые особенности</li>
              </ul>

              <h4 className="font-semibold mb-2">Подробности курса</h4>
              <p>При клике на курс открывается полное описание: список навыков, программа обучения, преподаватели, ссылки на отзывы и промокод (если есть).</p>
            </Section>

            {/* Admin */}
            <Section id="admin" title="Админ-панель" icon={<Settings className="w-5 h-5" />}>
              <h4 className="font-semibold mb-2">Вход в админку</h4>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Перейдите по секретному URL: <code className="bg-muted px-2 py-1 rounded">/panel-x7k9m2</code></li>
                <li>Введите пароль администратора</li>
                <li>После 5 неудачных попыток — блокировка на 15 минут</li>
              </ol>

              <h4 className="font-semibold mb-2">Вкладки админки</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Вкладка</th>
                      <th className="text-left py-2">Описание</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b"><td className="py-2 pr-4">📝 Контент</td><td>Мета-данные, заголовки</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4">👤 Автор</td><td>Информация об авторе</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4">📚 Курсы</td><td>Управление списком курсов</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4">❓ FAQ</td><td>Редактирование вопросов</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4">🧩 Блоки</td><td>Контентные блоки статьи</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4">📄 Страницы</td><td>Дополнительные страницы</td></tr>
                    <tr><td className="py-2 pr-4">⚙️ Настройки</td><td>Favicon, навигация</td></tr>
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Content Management */}
            <Section id="content" title="Управление контентом" icon={<Layers className="w-5 h-5" />}>
              <h4 className="font-semibold mb-2">Редактирование курсов</h4>
              <p className="mb-4">Для каждого курса можно редактировать:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Название, школу, логотип, ссылку</li>
                <li>Цены (текущая, старая, рассрочка)</li>
                <li>Формат, длительность, документ</li>
                <li>Особенности, навыки, преимущества</li>
                <li>Программу обучения</li>
                <li>Промокод и ссылки на отзывы</li>
              </ul>

              <h4 className="font-semibold mb-2">Сортировка курсов</h4>
              <p className="mb-4">Перетаскивайте курсы мышкой для изменения порядка отображения.</p>

              <h4 className="font-semibold mb-2">Массовые операции</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Массовая замена URL</strong> — вставьте ссылки по одной на строку</li>
                <li><strong>Массовая замена промокодов</strong> — формат: <code className="bg-muted px-1 rounded">КОД</code> или <code className="bg-muted px-1 rounded">КОД|Текст|Процент</code></li>
              </ul>
            </Section>

            {/* Export/Import */}
            <Section id="export-import" title="Экспорт и импорт данных" icon={<FileJson className="w-5 h-5" />}>
              <h4 className="font-semibold mb-2">Экспорт в JSON</h4>
              <ol className="list-decimal pl-6 space-y-1 mb-4">
                <li>Нажмите "Экспорт JSON"</li>
                <li>Выберите страницу (главная или дополнительная)</li>
                <li>Скачается файл с контентом</li>
              </ol>

              <h4 className="font-semibold mb-2">Импорт из JSON</h4>
              <ol className="list-decimal pl-6 space-y-1 mb-4">
                <li>Нажмите "Импорт JSON" или перетащите файл в область админки</li>
                <li>Выберите целевую страницу</li>
                <li>Загрузите файл</li>
              </ol>

              <h4 className="font-semibold mb-2">Формат данных</h4>
              <p>JSON файл содержит все данные страницы: мета-информацию, автора, курсы, FAQ и контентные блоки.</p>
            </Section>

            {/* FAQ */}
            <Section id="faq" title="Частые вопросы" icon={<HelpCircle className="w-5 h-5" />}>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Как сбросить пароль админки?</AccordionTrigger>
                  <AccordionContent>
                    Пароль хранится в коде приложения. Для изменения обратитесь к разработчику или измените его в файле AdminAuth.tsx.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Почему изменения не видны на сайте?</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Нажмите "Сохранить" в админке</li>
                      <li>Обновите страницу сайта (Ctrl+F5)</li>
                      <li>Очистите кэш браузера если не помогло</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Как восстановить данные?</AccordionTrigger>
                  <AccordionContent>
                    Используйте кнопку "Сброс к исходному" для возврата к дефолтным данным, или импортируйте резервный JSON файл.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Курсы не отображаются?</AccordionTrigger>
                  <AccordionContent>
                    Проверьте, что у курсов заполнены обязательные поля: название, школа и URL.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Изображения не загружаются?</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Проверьте правильность URL изображения</li>
                      <li>Используйте HTTPS ссылки</li>
                      <li>Убедитесь, что хост разрешает hotlinking</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>Где найти секретный URL админки?</AccordionTrigger>
                  <AccordionContent>
                    URL админки: <code className="bg-muted px-2 py-1 rounded">/panel-x7k9m2</code>. Рекомендуется изменить его на свой уникальный путь в файле App.tsx.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>Документация актуальна на декабрь 2024</p>
            <p className="mt-2">React + Vite + Tailwind CSS + shadcn/ui</p>
          </div>
        </main>
      </div>
    </>
  );
};

// Quick Link Card
const QuickLink = ({ icon, title, description, href }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  href: string; 
}) => (
  <a href={href} className="block">
    <Card className="h-full hover:border-primary/50 transition-colors">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </a>
);

// Section Component
const Section = ({ id, title, icon, children }: { 
  id: string; 
  title: string; 
  icon: React.ReactNode;
  children: React.ReactNode; 
}) => (
  <section id={id} className="scroll-mt-20">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none dark:prose-invert">
        {children}
      </CardContent>
    </Card>
  </section>
);

export default Tutorial;
