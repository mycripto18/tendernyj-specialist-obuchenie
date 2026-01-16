import { useContent } from "@/contexts/ContentContext";
import { BookOpen, Award, Users } from "lucide-react";

export const ArticleHeader = () => {
  const { content } = useContent();
  const { pageTitle, courses, headerStats } = content;
  
  // Динамические данные из контента
  const coursesCount = courses.length;
  const schoolsCount = new Set(courses.map(c => c.school)).size;

  return (
    <header className="relative overflow-hidden" role="banner">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-48 md:w-72 h-48 md:h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>
      
      {/* Content */}
      <div className="relative container max-w-5xl mx-auto px-4 py-8 md:py-16 lg:py-20">
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-primary-foreground/90 text-xs md:text-sm font-medium">
            <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {headerStats.badgeText}
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-tight text-center mb-4 md:mb-6 max-w-4xl mx-auto px-2">
          {pageTitle}
        </h1>
        
        {/* Subtitle */}
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
      
      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </header>
  );
};
