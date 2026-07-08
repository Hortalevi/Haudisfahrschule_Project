import { Section, SectionHeading } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getFaqItems } from "@/lib/faq";

export async function FAQ() {
  const faqItems = await getFaqItems();

  return (
    <Section tone="sand">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Gut zu wissen"
          align="center"
          className="mx-auto"
        />

        <Accordion type="single" collapsible className="mt-12">
          {faqItems.map((item, i) => (
            <AccordionItem key={item.question} value={`item-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}
