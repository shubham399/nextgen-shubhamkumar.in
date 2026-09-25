import AnimateOnScroll from "./AnimateOnScroll";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  level?: "h1" | "h2";
}

export default function SectionHeader({ label, title, description, level = "h2" }: SectionHeaderProps) {
  const Heading = level;

  return (
    <AnimateOnScroll className="mb-14">
      <p className="signal-label mb-3">
        {label}
      </p>
      <Heading className="mb-4 font-headline text-3xl font-bold tracking-tighter text-on-surface sm:text-4xl">
        {title}
      </Heading>
      {description && (
        <p className="text-on-surface-variant font-body text-base leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </AnimateOnScroll>
  );
}
