import type { Skill } from "@/types";
import SectionHeader from "./SectionHeader";
import { StaggerContainer, StaggerItem } from "./AnimateOnScroll";

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

  return (
    <section id="skills" className="section-base">
      <SectionHeader
        label="Tech Stack"
        title="Tools of the trade"
        description="The languages, frameworks, and platforms I rely on to build mission-critical systems."
      />

      <div className="flex flex-col gap-10">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <p className="font-label text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-4">
              {CATEGORY_LABELS[category] ?? category}
            </p>
            <StaggerContainer className="flex flex-wrap gap-2.5">
              {items.map((skill) => {
                const iconSrc = getIconSrc(skill.icon);
                return (
                  <StaggerItem key={skill.skill}>
                    <a
                      href={skill.href !== "/" ? skill.href : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container inner-glow transition-all duration-200 hover:shadow-glow group"
                    >
                      {iconSrc && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={iconSrc}
                          alt={skill.skill}
                          width={16}
                          height={16}
                          className="object-contain flex-shrink-0"
                        />
                      )}
                      <span className="font-label text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                        {skill.skill}
                      </span>
                    </a>
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
