import Image from "next/image";
import type { Experience } from "@/types";
import SectionHeader from "./SectionHeader";
import AnimateOnScroll from "./AnimateOnScroll";
import { StaggerContainer, StaggerItem } from "./AnimateOnScroll";
import { UTMLink } from "./UTMLink";

interface ExperienceProps {
  experiences: Experience[];
}

const LIGHT_MODE_LOGOS = new Set(["AirFi", "Alaan"]);

function logoContainerClass(company: string) {
  return LIGHT_MODE_LOGOS.has(company) ? "bg-white" : "bg-surface-container-low";
}

export default function ExperienceSection({ experiences }: ExperienceProps) {
  const visible = experiences.filter((e) => !e.skip);

  return (
    <section id="experience" className="section-base">
      <SectionHeader
        label="Work History"
        title="Where I've shipped at scale"
      />

      <StaggerContainer className="flex flex-col gap-1 relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-surface-container-highest hidden sm:block" />

        {visible.map((exp, idx) => (
          <StaggerItem key={exp.title}>
            <div className="relative flex gap-6 group">
              {/* Timeline dot */}
              <div className="hidden sm:flex flex-col items-center z-10 mt-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${logoContainerClass(exp.company)} ring-2 transition-all duration-300 ${idx === 0
                    ? "ring-primary-container"
                    : "ring-surface-container-highest group-hover:ring-surface-variant"
                    }`}
                >
                  {exp.logo ? (
                    <Image
                      src={exp.logo}
                      alt={exp.company}
                      width={24}
                      height={24}
                      className="rounded-full object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="font-headline font-bold text-xs text-primary">
                      {exp.company[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Card */}
              <div className="flex-1 bg-surface-container-low rounded-2xl p-6 inner-glow mb-4 hover:bg-surface-container transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {/* Mobile logo */}
                      <div className={`sm:hidden w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ${logoContainerClass(exp.company)}`}>
                        {exp.logo && (
                          <Image
                            src={exp.logo}
                            alt={exp.company}
                            width={28}
                            height={28}
                            className="object-contain"
                            unoptimized
                          />
                        )}
                      </div>
                      <UTMLink
                        href={exp.link}
                        className="font-headline font-bold text-lg tracking-tighter text-on-surface hover:text-primary transition-colors"
                      >
                        {exp.company}
                      </UTMLink>
                    </div>
                    <p className="font-body text-sm text-on-surface-variant">
                      {exp.title}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:text-right">
                    <span className="badge">
                      {exp.start} — {exp.end ?? "Present"}
                    </span>
                    {exp.badges.map((badge) => (
                      <span key={badge} className="badge text-primary/80 bg-surface-container">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="flex flex-col gap-2">
                  {exp.description.map((point, i) => (
                    <li key={i} className="flex gap-2.5 items-start">
                      <span className="mt-[7px] w-1 h-1 rounded-full bg-primary-container flex-shrink-0" />
                      <span className="font-body text-sm text-on-surface-variant leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
