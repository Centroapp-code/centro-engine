import { Section, SectionHeading } from "@/components/marketing/section";
import { ImagePlaceholder } from "@/components/marketing/image-placeholder";

export function ResultsPreview() {
  return (
    <Section id="results" className="bg-muted/30">
      <SectionHeading
        eyebrow="Results"
        title="See every opportunity, scored and summarized"
        description="Your dashboard turns raw calls into a clear picture of what's worth your team's time."
      />

      <ImagePlaceholder
        label="Analytics dashboard preview"
        aspectClassName="aspect-[16/9]"
        className="mx-auto mt-16 max-w-4xl"
      />
    </Section>
  );
}
