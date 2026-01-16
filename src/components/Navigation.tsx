import { useContent } from "@/contexts/ContentContext";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Phone, FileText } from "lucide-react";

const icons: Record<string, React.ReactNode> = {
  "Главная": <Home className="w-4 h-4" />,
  "Курсы": <BookOpen className="w-4 h-4" />,
  "Контакты": <Phone className="w-4 h-4" />,
};

export const Navigation = () => {
  const { content } = useContent();
  const location = useLocation();
  
  // Собираем навигацию: базовая + страницы из админки
  const navItems = [
    ...content.navigation,
    ...content.pages
      .filter(p => p.showInMenu)
      .map(p => ({ 
        label: p.menuLabel, 
        href: `/${p.slug}`,
        isExternal: false 
      }))
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    if (href.startsWith('#')) return false;
    return location.pathname === href;
  };

  return (
    <nav 
      className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary/20"
      role="navigation"
      aria-label="Основная навигация"
    >
      <div className="container max-w-4xl mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 h-11 md:h-12 overflow-x-auto scrollbar-hide">
          {navItems.map((item, index) => {
            const isAnchor = item.href.startsWith('#');
            const isExternalLink = item.isExternal;
            
            if (isAnchor || isExternalLink) {
              return (
                <a 
                  key={index} 
                  href={item.href} 
                  target={isExternalLink ? "_blank" : undefined}
                  rel={isExternalLink ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 rounded-md transition-colors"
                >
                  <span className="hidden sm:inline-flex">{icons[item.label] || <FileText className="w-4 h-4" />}</span>
                  {item.label}
                </a>
              );
            }
            
            return (
              <Link 
                key={index} 
                to={item.href} 
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href) 
                    ? 'text-primary-foreground bg-white/20' 
                    : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
                }`}
              >
                <span className="hidden sm:inline-flex">{icons[item.label] || <FileText className="w-4 h-4" />}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
