import type { Skill } from "@/types";
import SectionHeader from "../ui/SectionHeader";
import { StaggerContainer, StaggerItem } from "../ui/AnimateOnScroll";

interface SkillsProps {
  skills: Skill[];
}

const CATEGORY_ORDER = [
  "programming language",
  "framework and runtime",
  "databases",
  "Specializations",
  "tools",
];

const CATEGORY_LABELS: Record<string, string> = {
  "programming language": "Languages",
  "framework and runtime": "Frameworks & Runtime",
  databases: "Databases",
  Specializations: "Specializations",
  tools: "Tools & Platforms",
};

function isValidIconSrc(src: string): boolean {
  return (
    src.startsWith("data:image") ||
    src.startsWith("https://") ||
    src.startsWith("http://")
  ) && !src.startsWith("http://0.0.0.0");
}

function getIconSrc(icon: Skill["icon"]): string | null {
  if (!icon) return null;
  if (typeof icon === "string") {
    return isValidIconSrc(icon) ? icon : null;
  }
  const src = icon.dark || icon.light || "";
  return isValidIconSrc(src) ? src : null;
}

export default function Skills({ skills }: SkillsProps) {
  // Group by category
  const grouped = CATEGORY_ORDER.reduce(
    (acc, cat) => {
      const items = skills.filter(
        (s) => s.category.toLowerCase() === cat.toLowerCase()
      );
      if (items.length) acc[cat] = items;
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Tech Stack - Shubham Kumar",
    description: "Languages, frameworks, and platforms used by Shubham Kumar",
    programmingLanguage: skills
      .filter((s) => s.category.toLowerCase() === "programming language")
      .map((s) => s.skill),
    runtimePlatform: skills
      .filter((s) => s.category.toLowerCase() === "framework and runtime")
      .map((s) => s.skill),
    softwareRequirements: skills
      .filter((s) => s.category.toLowerCase() === "tools")
      .map((s) => s.skill),
    author: {
      "@type": "Person",
      name: "Shubham Kumar",
      url: "https://www.shubhkumar.in",
    },
  };

  return (
    <section id="skills" className="section-base">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SectionHeader
        label="Tooling"
        title="The stack behind the work"
        description="The languages, frameworks, and platforms I reach for when the system has to hold."
      />

      <div className="flex flex-col gap-10">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <p className="mb-4 font-label text-xs font-semibold uppercase tracking-widest text-content-muted">
              {CATEGORY_LABELS[category] ?? category}
            </p>
            <StaggerContainer className="flex flex-wrap gap-2.5">
              {items.map((skill) => {
                const iconSrc = getIconSrc(skill.icon);
                const content = (
                  <>
                    {iconSrc && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={iconSrc}
                        alt=""
                        width={16}
                        height={16}
                        className="flex-shrink-0 object-contain"
                      />
                    )}
                    <span className="font-label text-sm text-on-surface-variant transition-colors group-hover:text-on-surface group-focus-visible:text-on-surface">
                      {skill.skill}
                    </span>
                  </>
                );
                return (
                  <StaggerItem key={skill.skill}>
                    {skill.href !== "/" ? (
                      <a
                        href={skill.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="interactive-surface group inline-flex min-h-11 items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2 hover:bg-surface-container-high focus-visible:bg-surface-container-high"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2">
                        {content}
                      </span>
                    )}
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        ))}
      </div>
    </section>
  );
}
