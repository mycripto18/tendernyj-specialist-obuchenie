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

// Получить дату последнего понедельника
const getLastMonday = (): string => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
  return monday.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Schema.org микроразметка
const generateSchemaMarkup = (metaData: any, author: any, faqData: any[], courses: any[], baseUrl: string) => {
  const dateModified = new Date().toISOString();
  const datePublished = "2025-01-01T00:00:00Z";
  const ogImageUrl = `${baseUrl}/favicon.png`;

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": metaData.title,
    "description": metaData.description,
    "image": ogImageUrl,
    "author": {
      "@type": "Person",
      "name": author.name,
      "url": baseUrl,
      "description": author.description
    },
    "publisher": {
      "@type": "Organization",
      "name": "Рейтинг онлайн-курсов",
      "logo": {
        "@type": "ImageObject",
        "url": ogImageUrl
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": baseUrl
    }
  };

  // FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  // ItemList Schema для курсов
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": courses.map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.title,
        "description": course.features.join(' '),
        "provider": {
          "@type": "Organization",
          "name": course.school,
          "sameAs": course.url
        },
        "offers": {
          "@type": "Offer",
          "price": course.price,
          "priceCurrency": "RUB",
          "availability": "https://schema.org/InStock"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "online",
          "duration": course.duration
        }
      }
    }))
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Курсы",
        "item": `${baseUrl}#courses`
      }
    ]
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": metaData.title,
    "description": metaData.description,
    "url": baseUrl,
    "inLanguage": "ru-RU",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Рейтинг онлайн-курсов",
      "url": baseUrl
    },
    "about": {
      "@type": "Thing",
      "name": "Онлайн-образование"
    },
    "lastReviewed": getLastMonday()
  };

  return [articleSchema, faqSchema, itemListSchema, breadcrumbSchema, webPageSchema];
};

const Index = () => {
  const { content, isLoading } = useContent();
  const { metaData, author, faqData, courses } = content;
  
  // Формируем полный URL для og:url
  const getFullUrl = (url: string) => {
    if (!url) return window.location.origin;
    if (url.startsWith('http')) return url;
    return window.location.origin + (url.startsWith('/') ? url : '/' + url);
  };

  const fullCanonicalUrl = getFullUrl(metaData.canonicalUrl);
  const ogImageUrl = `${window.location.origin}/favicon.png`;
  
  const schemas = generateSchemaMarkup(metaData, author, faqData, courses, fullCanonicalUrl);

  // Показываем пустой экран пока контент загружается из content.json
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <html lang="ru" />
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <meta name="keywords" content={metaData.keywords} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={author.name} />
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
        <ArticleHeader />
        <Navigation />
        
        <main className="flex-1">
          <AuthorBlock />
          <ArticleIntro />
          <BeforeTableBlock />
          <CoursesList />
          <CourseDetails />
          <div className="max-w-4xl mx-auto px-4">
            <ContentBlocks />
          </div>
          <FAQ />
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

export default Index;