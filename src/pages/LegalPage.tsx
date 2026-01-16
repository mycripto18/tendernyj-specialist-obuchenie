import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { ArticleFooter } from "@/components/ArticleFooter";
import { useContent, LegalPage as LegalPageType } from "@/contexts/ContentContext";

const LegalPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { content, isLoading } = useContent();
  const siteName = content.metaData?.title?.split(' - ')[0] || 'Сайт';
  
  // Найти страницу по slug
  const page: LegalPageType | undefined = (content.legalPages || []).find(p => p.slug === slug);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Если страница не найдена — редирект на 404
  if (!page) {
    return <Navigate to="/404" replace />;
  }

  // Преобразование текста с переносами и маркерами в JSX
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const result: JSX.Element[] = [];
    let listItems: string[] = [];
    
    const flushList = () => {
      if (listItems.length > 0) {
        result.push(
          <ul key={`list-${result.length}`} className="list-disc pl-5 space-y-1 my-2">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };
    
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        listItems.push(trimmed.substring(1).trim());
      } else if (trimmed) {
        flushList();
        result.push(<p key={idx} className="my-2">{trimmed}</p>);
      } else if (listItems.length === 0) {
        flushList();
      }
    });
    
    flushList();
    return result;
  };

  return (
    <>
      <Helmet>
        <html lang="ru" />
        <title>{page.title} — {siteName}</title>
        <meta name="description" content={page.title} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1 py-8 md:py-12">
          <article className="container max-w-3xl mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              {page.title}
            </h1>
            
            <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground">
              {page.sections.map((section, index) => (
                <section key={index}>
                  <h2 className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3">
                    {section.title}
                  </h2>
                  {renderContent(section.content)}
                </section>
              ))}
              
              {page.sections.length === 0 && (
                <p className="text-muted-foreground">Содержимое страницы не настроено.</p>
              )}
            </div>
          </article>
        </main>

        <ArticleFooter />
      </div>
    </>
  );
};

export default LegalPage;