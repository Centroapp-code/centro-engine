import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/marketing/section";
import { faqs, faqSection } from "@/lib/content/marketing";

export function FAQ() {
  return (
    <Section id="faq" className="bg-muted/30">
      <SectionHeading eyebrow={faqSection.eyebrow} title={faqSection.title} />

      <div className="mx-auto mt-16 max-w-2xl">
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
