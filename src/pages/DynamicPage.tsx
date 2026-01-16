import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArticleHeader } from "@/components/ArticleHeader";
import { Navigation } from "@/components/Navigation";
import { AuthorBlock } from "@/components/AuthorBlock";
import { ArticleIntro } from "@/components/ArticleIntro";
import BeforeTableBlock from "@/components/BeforeTableBlock";
import { CoursesList } from "@/components/CoursesList";
import { CourseDetails } from "@/components/CourseDetails";
import ContentBlocks from "@/components/ContentBlocks";
import { FAQ } from "@/components/FAQ";
import { ArticleFooter } from "@/components/ArticleFooter";
import { useContent } from "@/contexts/ContentContext";
import { BookOpen, Award, Users } from "lucide-react";

// Получить дату последнего понедельника
const getLastMonday = (): string => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
  return monday.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Schema.org микроразметка для динамических страниц
const generatePageSchema = (
  metaData: any, 
  author: any, 
  faqData: any[], 
  courses: any[], 
  baseUrl: string,
  pageTitle: string
) => {
  const dateModified = new Date().toISOString();
  const datePublished = "2025-01-01T00:00:00Z";
  const ogImageUrl = `${baseUrl.split('/')[0]}//${baseUrl.split('/')[2]}/favicon.png`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": pageTitle,
    "description": metaData.description,
    "image": ogImageUrl,
    "author": {
      "@type": "Person",
      "name": author?.name || "Рейтинг курсов",
      "description": author?.description || ""
    },
    "publisher": {
      "@type": "Organization",
      "name": "Рейтинг онлайн-курсов",
      "logo": { "@type": "ImageObject", "url": ogImageUrl }
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl }
  };

  const faqSchema = faqData.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": { "@type": "Answer", "text": item.answer }
    }))
  } : null;

  const itemListSchema = courses.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": courses.slice(0, 10).map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.title,
        "description": course.features?.join(' ') || '',
        "provider": { "@type": "Organization", "name": course.school },
        "offers": {
          "@type": "Offer",
          "price": course.price,
          "priceCurrency": "RUB"
        }
      }
    }))
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": baseUrl.replace(/\/[^/]*$/, '') || baseUrl },
      { "@type": "ListItem", "position": 2, "name": pageTitle, "item": baseUrl }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": metaData.title,
    "description": metaData.description,
    "url": baseUrl,
    "inLanguage": "ru-RU",
    "lastReviewed": getLastMonday()
  };

  return [articleSchema, faqSchema, itemListSchema, breadcrumbSchema, webPageSchema].filter(Boolean);
};

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { content, isLoading } = useContent();
  
  // Показываем пустой экран пока контент загружается
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // Найти страницу по slug
  const page = content.pages.find(p => p.slug === slug);
  
  if (!page) {
    return <Navigate to="/" replace />;
  }

  // Использовать контент страницы или общий
  const pageTitle = page.pageTitle || content.pageTitle;
  const metaData = page.metaData;
  const author = page.author || content.author;
  const headerStats = page.headerStats || content.headerStats;
  const introText = page.introText || content.introText;
  const beforeTableBlock = page.beforeTableBlock || content.beforeTableBlock;
  const courses = page.courses || content.courses;
  const contentBlocks = page.contentBlocks || content.contentBlocks;
  const faqData = page.faqData || content.faqData;

  const coursesCount = courses.length;
  const schoolsCount = new Set(courses.map(c => c.school)).size;

  // Формируем полный URL для og:url
  const getFullUrl = (url: string) => {
    if (!url) return `${window.location.origin}/${slug}`;
    if (url.startsWith('http')) return url;
    return window.location.origin + (url.startsWith('/') ? url : '/' + url);
  };

  const fullCanonicalUrl = getFullUrl(metaData.canonicalUrl);
  const ogImageUrl = `${window.location.origin}/favicon.png`;
  
  // Генерируем Schema.org разметку
  const schemas = generatePageSchema(metaData, author, faqData, courses, fullCanonicalUrl, pageTitle);

  return (
    <>
      <Helmet>
        <html lang="ru" />
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <meta name="keywords" content={metaData.keywords} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={author?.name || "Рейтинг курсов"} />
        <link rel="canonical" href={fullCanonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaData.title} />
        <meta property="og:description" content={metaData.description} />
        <meta property="og:url" content={fullCanonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="Рейтинг онлайн-курсов" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaData.title} />
        <meta name="twitter:description" content={metaData.description} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:url" content={fullCanonicalUrl} />
        
        {/* Mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1d7bf5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Schema.org JSON-LD */}
        {schemas.map((schema, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        {page.blocks.showHeader && (
          <header className="relative overflow-hidden" role="banner">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-48 md:w-72 h-48 md:h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            </div>
            <div className="relative container max-w-5xl mx-auto px-4 py-8 md:py-16 lg:py-20">
              {/* Badge */}
              <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-primary-foreground/90 text-xs md:text-sm font-medium">
                  <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {headerStats.badgeText}
                </span>
              </div>
              
              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-tight text-center mb-4 md:mb-6 max-w-4xl mx-auto px-2">
                {pageTitle}
              </h1>
              <p className="text-center text-primary-foreground/80 text-sm md:text-lg max-w-2xl mx-auto mb-6 md:mb-8 px-4">
                {headerStats.subtitle}
              </p>
              
              {/* Stats */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10">
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-bold">{coursesCount}</div>
                    <div className="text-[10px] md:text-xs text-primary-foreground/70">Курсов</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Award className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-bold">{schoolsCount}</div>
                    <div className="text-[10px] md:text-xs text-primary-foreground/70">Школ</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Users className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-bold">{headerStats.reviewsCount}</div>
                    <div className="text-[10px] md:text-xs text-primary-foreground/70">Отзывов</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto" preserveAspectRatio="none">
                <path d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z" fill="hsl(var(--background))" />
              </svg>
            </div>
          </header>
        )}
        
        <Navigation />
        
        <main className="flex-1 pb-20 md:pb-0">
          {page.blocks.showAuthor && <AuthorBlock author={author} />}
          {page.blocks.showIntro && <ArticleIntro introText={introText} />}
          {page.blocks.showBeforeTable && <BeforeTableBlock beforeTableBlockData={beforeTableBlock} />}
          {page.blocks.showCoursesList && <CoursesList courses={courses} />}
          {page.blocks.showCourseDetails && <CourseDetails coursesData={courses} />}
          {page.blocks.showContentBlocks && (
            <div className="max-w-4xl mx-auto px-4">
              <ContentBlocks contentBlocksData={contentBlocks} />
            </div>
          )}
          {page.blocks.showFAQ && <FAQ faqData={faqData} />}
          {content.adDisclosureText?.trim() && (
            <div className="container max-w-4xl mx-auto px-4 mt-6 md:mt-8">
              <div className="bg-card rounded-lg py-2.5 md:py-3 px-4 md:px-6 shadow-sm border border-border">
                <p className="text-xs md:text-sm text-muted-foreground text-center">{content.adDisclosureText}</p>
              </div>
            </div>
          )}
        </main>

        <ArticleFooter />
      </div>
    </>
  );
};

export default DynamicPage;
