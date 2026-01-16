import { useContent, ContentBlock } from "@/contexts/ContentContext";

interface ContentBlocksProps {
  contentBlocksData?: ContentBlock[];
}

const ContentBlocks = ({ contentBlocksData }: ContentBlocksProps) => {
  const { content } = useContent();
  const contentBlocks = contentBlocksData || content.contentBlocks;
  return (
    <section className="py-4 md:py-8">
      <div className="space-y-6 md:space-y-10">
        {contentBlocks.map((block, index) => (
          <article key={index} className="space-y-3 md:space-y-4">
            {/* Заголовок блока */}
            <h2 className="flex items-start gap-3 text-lg md:text-2xl font-bold text-foreground">
              <span className="text-primary mt-1">●</span>
              {block.title}
            </h2>

            {/* Параграфы */}
            {block.paragraphs && (
              <div className="space-y-3 md:space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base">
                {block.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Список с иконками */}
            {block.list && (
              <ul className="space-y-2 md:space-y-3 mt-3 md:mt-4">
                {block.list.map((item, lIndex) => (
                  <li key={lIndex} className="flex items-start gap-3">
                    <span className="text-base md:text-lg flex-shrink-0">{item.icon}</span>
                    <span className="text-muted-foreground text-sm md:text-base">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ContentBlocks;
