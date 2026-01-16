import { useContent, Course } from "@/contexts/ContentContext";
import { CheckCircle2, ExternalLink, Clock, GraduationCap, CreditCard, FileText, Users, UserCircle, BookOpen, MessageCircle, Star, Copy, Check, Tag } from "lucide-react";
import { useState } from "react";

interface CourseDetailsProps {
  coursesData?: Course[];
}

export const CourseDetails = ({ coursesData }: CourseDetailsProps) => {
  const { content } = useContent();
  const courses = coursesData || content.courses;
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽';

  const handleCopyPromo = async (courseId: number, promoCode: string) => {
    await navigator.clipboard.writeText(promoCode);
    setCopiedId(courseId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-4 md:py-6">
      <div className="container max-w-4xl mx-auto px-4 space-y-6 md:space-y-8">
        {courses.map((course, index) => (
          <article 
            key={course.id} 
            id={`course-${course.id}`} 
            className="bg-card rounded-xl shadow-sm border border-border overflow-hidden scroll-mt-16"
            itemScope 
            itemType="https://schema.org/Course"
          >
            {/* Header */}
            <div className="bg-muted/30 p-4 md:p-5 border-b border-border">
              <h2 className="text-base md:text-xl font-bold text-foreground leading-tight">
                <span className="text-primary">{index + 1}.</span>{" "}
                <a 
                  href={course.url} 
                  className="text-primary hover:underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  itemProp="url"
                >
                  <span itemProp="name">{course.title}</span>
                </a>
                <span className="block md:inline text-foreground font-semibold mt-1 md:mt-0">
                  {" — "}<span itemProp="provider" itemScope itemType="https://schema.org/Organization">
                    <span itemProp="name">{course.school}</span>
                  </span>
                </span>
              </h2>
            </div>

            {/* School Logo / Screenshot */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-b border-border overflow-hidden">
              <img 
                src={course.schoolLogo} 
                alt={course.school} 
                className="w-full h-auto object-contain max-h-[300px] md:max-h-[400px]"
              />
            </div>

            {/* Info Grid */}
            <div className="p-4 md:p-5 border-b border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <CreditCard className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">Стоимость</div>
                    <div className="font-semibold text-sm" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                      <span itemProp="price" content={course.price.toString()}>от {formatPrice(course.price)}</span>
                      <meta itemProp="priceCurrency" content="RUB" />
                      {course.oldPrice && (
                        <span className="text-muted-foreground line-through text-xs ml-2">{formatPrice(course.oldPrice)}</span>
                      )}
                    </div>
                    {course.installment && (
                      <div className="text-xs text-success font-medium">Рассрочка от {formatPrice(course.installment)}/мес</div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">Длительность</div>
                    <div className="font-semibold text-sm" itemProp="timeRequired">{course.duration}</div>
                    <div className="text-xs text-muted-foreground">{course.format}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">Документ</div>
                    <div className="font-medium text-sm">{course.document}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">Для кого</div>
                    <div className="font-medium text-sm">{course.forWhom}</div>
                  </div>
                </div>

                {course.promoCode?.code && (
                  <div className="sm:col-span-2 flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/30">
                    <Tag className="w-5 h-5 text-success flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">
                        {course.promoCode.discountText} ({course.promoCode.discountPercent}%)
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Промокод:</span>
                        <code className="font-bold text-success text-base">
                          "{course.promoCode.code}"
                        </code>
                        <button
                          onClick={() => handleCopyPromo(course.id, course.promoCode!.code)}
                          className="p-1.5 hover:bg-success/20 rounded-md transition-colors"
                          title="Скопировать промокод"
                        >
                          {copiedId === course.id ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4 text-success" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="p-4 md:p-5 space-y-4 md:space-y-5">
              <div>
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-accent" />
                  Особенности курса
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed" itemProp="description">
                  {course.features.join(' ')}
                </p>
              </div>

              {course.teachers && course.teachers.length > 0 && (
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-accent" />
                    Преподаватели курса
                  </h3>
                  <ul className="space-y-2">
                    {course.teachers.map((teacher, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{teacher.name}</span>
                        <span className="text-muted-foreground"> — {teacher.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.program && course.program.length > 0 && (
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent" />
                    Кратко о программе курса
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {course.program.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary font-bold">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-2">Чему научитесь:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.skills.map((skill, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />{skill}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-2">Преимущества:</h3>
                <ul className="space-y-1.5">
                  {course.advantages.map((adv, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-accent font-bold">✓</span>{adv}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/20 rounded-lg p-4">
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-accent" />
                  Отзывы учеников
                </h3>
                <p className="text-muted-foreground text-sm italic mb-3">{course.reviews}</p>
                
                {course.reviewLinks && course.reviewLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                    {course.reviewLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-lg text-xs hover:border-primary/50 hover:bg-primary/5 transition-colors"
                      >
                        <span className="font-medium text-foreground">{link.platform}</span>
                        <span className="text-muted-foreground">{link.count}</span>
                        <span className="inline-flex items-center gap-0.5 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          {link.rating}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="flex justify-center">
                <a 
                  href={course.url} 
                  className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 md:py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all text-sm active:scale-[0.98]" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Перейти на сайт курса <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
