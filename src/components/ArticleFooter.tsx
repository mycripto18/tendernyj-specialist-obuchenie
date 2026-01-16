import { Link } from "react-router-dom";
import { useContent } from "@/contexts/ContentContext";

export const ArticleFooter = () => {
  const { content } = useContent();
  
  const footerText = content.footerText || 'Интернет-сайт носит информационный характер и ни при каких условиях не является публичной офертой, которая определяется положениями статьи 437 Гражданского кодекса РФ.';
  const footerEmail = content.footerEmail || 'info@example.com';
  const footerLinks = content.footerLinks || [];
  const legalPages = (content.legalPages || []).filter(p => p.showInFooter);
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="contacts" className="bg-primary/95 py-6 md:py-8 mt-6 md:mt-8">
      <div className="container max-w-4xl mx-auto px-4 text-center">
        <p className="text-xs md:text-sm text-primary-foreground/70 mb-4 md:mb-5">
          {footerText}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-primary-foreground/80">
          <span>© {currentYear}</span>
          
          {/* Ссылки на правовые страницы */}
          {legalPages.map((page) => (
            <span key={page.id} className="flex items-center gap-3">
              <span className="text-primary-foreground/40">•</span>
              <Link 
                to={`/legal/${page.slug}`} 
                className="hover:text-primary-foreground transition-colors"
              >
                {page.title}
              </Link>
            </span>
          ))}
          
          {/* Дополнительные ссылки из footerLinks */}
          {footerLinks.map((link, index) => (
            <span key={index} className="flex items-center gap-3">
              <span className="text-primary-foreground/40">•</span>
              {link.isExternal ? (
                <a 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link 
                  to={link.href} 
                  className="hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )}
            </span>
          ))}
          
          <span className="text-primary-foreground/40">•</span>
          <a href={`mailto:${footerEmail}`} className="hover:text-primary-foreground transition-colors">Контакты</a>
        </div>
      </div>
    </footer>
  );
};