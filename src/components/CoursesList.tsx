import { useContent, Course } from "@/contexts/ContentContext";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

interface CoursesListProps {
  courses?: Course[];
}

export const CoursesList = ({ courses: coursesProp }: CoursesListProps) => {
  const { content } = useContent();
  const courses = coursesProp || content.courses;
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽';

  const handleCopyPromo = async (courseId: number, promoCode: string) => {
    await navigator.clipboard.writeText(promoCode);
    setCopiedId(courseId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="courses" className="py-4 md:py-6 scroll-mt-16">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm border border-border">
          <h2 className="text-lg md:text-2xl font-bold text-foreground mb-4 md:mb-6 border-l-4 border-accent pl-3 md:pl-4">
            Рейтинг лучших курсов
          </h2>
          
          {/* Mobile: Card layout */}
          <div className="md:hidden space-y-3">
            {courses.map((course, index) => (
              <div 
                key={course.id} 
                className="bg-muted/30 rounded-lg p-4 border border-border/50"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{index + 1}</span>
                    <span className="text-lg">{getMedal(index)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    от {formatPrice(course.price)}
                  </span>
                </div>
                <a 
                  href={course.url} 
                  className="text-primary hover:underline font-medium text-sm block mb-1"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {course.title}
                </a>
                <div className="text-xs text-muted-foreground mb-2">{course.school}</div>
                {course.promoCode?.code && (
                  <div className="flex flex-col gap-1 mb-3 p-2 bg-success/10 rounded-lg border border-success/30">
                    <span className="text-xs font-medium text-success">
                      {course.promoCode.discountText} ({course.promoCode.discountPercent}%)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Промокод:</span>
                      <code className="flex-1 text-xs font-bold text-success truncate">
                        "{course.promoCode.code}"
                      </code>
                      <button
                        onClick={() => handleCopyPromo(course.id, course.promoCode!.code)}
                        className="p-1 hover:bg-success/20 rounded transition-colors"
                      >
                        {copiedId === course.id ? (
                          <Check className="w-3 h-3 text-success" />
                        ) : (
                          <Copy className="w-3 h-3 text-success" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <a 
                    href={`#course-${course.id}`}
                    className="flex-1 text-center py-2 px-3 bg-muted text-foreground rounded text-xs font-medium hover:bg-muted/80 transition-colors"
                  >
                    Подробнее
                  </a>
                  <a 
                    href={course.url} 
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Перейти <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table layout */}
          <div className="hidden md:block overflow-x-auto -mx-6 px-6">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="w-20 text-center font-semibold py-3 px-4 text-sm">Место</th>
                  <th className="font-semibold py-3 px-4 text-left text-sm">Программа обучения</th>
                  <th className="w-40 text-center font-semibold py-3 px-4 text-sm">Промокод</th>
                  <th className="w-28 text-center font-semibold py-3 px-4 text-sm">Сайт курса</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course.id} className="hover:bg-muted/30 border-b border-border/50 last:border-b-0">
                    <td className="text-center font-medium py-3 px-4">
                      {index + 1} {getMedal(index)}
                    </td>
                    <td className="py-3 px-4">
                      <a 
                        href={course.url} 
                        className="text-primary hover:underline font-medium"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {course.title}
                      </a>
                      <div className="text-sm text-muted-foreground">{course.school}</div>
                    </td>
                    <td className="text-center py-3 px-4">
                      {course.promoCode?.code ? (
                        <div className="inline-flex flex-col items-center gap-1 px-3 py-1.5 bg-success/10 rounded-lg border border-success/30">
                          <span className="text-xs font-medium text-success">
                            {course.promoCode.discountText} ({course.promoCode.discountPercent}%)
                          </span>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-bold text-success">
                              "{course.promoCode.code}"
                            </code>
                            <button
                              onClick={() => handleCopyPromo(course.id, course.promoCode!.code)}
                              className="p-1 hover:bg-success/20 rounded transition-colors"
                              title="Скопировать"
                            >
                              {copiedId === course.id ? (
                                <Check className="w-3.5 h-3.5 text-success" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-success" />
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      <a 
                        href={course.url} 
                        className="inline-flex items-center justify-center px-4 py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Перейти
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
