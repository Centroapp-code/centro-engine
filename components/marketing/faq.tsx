import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/marketing/section";

const FAQS = [
  {
    question: "Does Centro replace our existing phone system?",
    answer:
      "No. Centro connects to the Sales option on the phone menu you already have. Every other option keeps working exactly as it does today.",
  },
  {
    question: "How does the AI qualify a lead?",
    answer:
      "Centro asks a configurable set of qualification questions during the call, understands the caller's needs, and scores the opportunity before it reaches your team.",
  },
  {
    question: "What happens to a call once it's qualified?",
    answer:
      "Centro can transfer the caller live to an available sales rep, or save the lead, summary, and score to your dashboard for follow-up.",
  },
  {
    question: "Can Centro send leads to our CRM?",
    answer:
      "Yes. Growth and Enterprise plans include CRM integration, so qualified leads flow directly into the CRM your sales team already uses.",
  },
  {
    question: "Do we need any new hardware or phone numbers?",
    answer:
      "No new hardware or number is required. You route your existing Sales menu option to Centro during setup.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, every plan starts with a free trial so you can see how Centro handles your real inbound call volume before committing.",
  },
];

export function FAQ() {
  return (
    <Section id="faq" className="bg-muted/30">
      <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />

      <div className="mx-auto mt-12 max-w-2xl">
        <Accordion>
          {FAQS.map((faq, index) => (
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
