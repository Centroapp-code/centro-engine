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
      "No. Centro connects to the phone system you already have and handles inbound sales calls on your behalf. Everything else keeps working exactly as it does today.",
  },
  {
    question: "How does Centro qualify a sales call?",
    answer:
      "Centro asks a configurable set of questions during the call to understand who's calling and what they're offering, then scores the opportunity before it reaches your team.",
  },
  {
    question: "What happens after a call is qualified?",
    answer:
      "Centro can transfer a genuinely worthwhile call live to your team, or save the summary, score, and contact details to your dashboard for later review.",
  },
  {
    question: "Can Centro send opportunities to our CRM?",
    answer:
      "Yes. Growth and Enterprise plans include CRM integration, so qualified opportunities flow directly into the CRM your team already uses.",
  },
  {
    question: "Do we need any new hardware or phone numbers?",
    answer:
      "No new hardware or number is required. You forward calls to Centro from the phone system you already use.",
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
