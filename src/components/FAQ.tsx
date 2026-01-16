import { useContent, FAQItem } from "@/contexts/ContentContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQProps {
  faqData?: FAQItem[];
}

export const FAQ = ({ faqData: faqDataProp }: FAQProps) => {
  const { content } = useContent();
  const faqData = faqDataProp || content.faqData;
  return (
    <section 
      className="py-4 md:py-6" 
      itemScope 
      itemType="https://schema.org/FAQPage"
      aria-labelledby="faq-heading"
    >
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm border border-border">
          <h2 
            id="faq-heading"
            className="text-lg md:text-2xl font-bold text-foreground mb-4 md:mb-6 border-l-4 border-accent pl-3 md:pl-4 flex items-center gap-2"
          >
            <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            Часто задаваемые вопросы
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqData.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/50 rounded-lg px-4 data-[state=open]:bg-muted/30"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary text-sm md:text-base py-4 hover:no-underline">
                  <span itemProp="name">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent 
                  className="text-muted-foreground text-sm pb-4 leading-relaxed"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">{item.answer}</span>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
