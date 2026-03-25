import { Icon } from "@iconify/react";
import type { Me, Contact, Experience } from "@/types";
import SectionHeader from "./SectionHeader";
import AnimateOnScroll from "./AnimateOnScroll";
import { StaggerContainer, StaggerItem } from "./AnimateOnScroll";

interface AboutProps {
  me: Me;
  contacts: Contact[];
  experience: Experience[];
}

function getYearsOfExperience(experience: Experience[]): string {
  const starts = experience.filter((e) => !e.skip).map((e) => new Date(e.start).getFullYear());
  const earliest = Math.min(...starts);
  const years = new Date().getFullYear() - earliest;
  return `${years}+`;
}

export default function About({ me, contacts, experience }: AboutProps) {
  const STATS = [
    { value: getYearsOfExperience(experience), label: "Years Experience" },
    { value: "99.99%", label: "Uptime SLA" },
    { value: "90%", label: "Latency Reduction" },
    { value: "M+", label: "Users Served" },
  ];
  return (
    <section id="about" className="section-base">
      <SectionHeader
        label="About Me"
        title="Engineered for precision"
        description="A glimpse into the person behind the architecture."
      />

      {/* Stats row */}
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {STATS.map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="bg-surface-container-low rounded-xl p-4 inner-glow text-center">
              <p className="font-headline font-bold text-2xl tracking-tighter gradient-text">
                {stat.value}
              </p>
              <p className="font-label text-xs text-on-surface-variant mt-1">
                {stat.label}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <AnimateOnScroll className="grid grid-cols-1 lg:grid-cols-2 gap-6" delay={0.1}>
        {/* Bio card */}
        <div className="bg-surface-container-low rounded-2xl p-7 inner-glow">
          <h3 className="font-headline font-bold text-xl tracking-tighter text-on-surface mb-4">
            {me.about}
          </h3>
          <p className="font-body text-sm leading-[1.8] text-on-surface-variant whitespace-pre-line">
            {me.summary}
          </p>
        </div>

        {/* Contact info */}
        <div className="bg-surface-container-low rounded-2xl p-7 inner-glow">
          <h4 className="font-headline font-semibold text-sm tracking-tight text-on-surface mb-5">
            Contact Details
          </h4>
          <div className="flex flex-col gap-4">
            {contacts.map((contact) => (
              <div key={contact.title} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center">
                  <Icon
                    icon={contact.icon}
                    width={16}
                    className="text-primary"
                  />
                </div>
                <div>
                  <p className="font-label text-xs text-on-surface-variant">
                    {contact.title}
                  </p>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="font-body text-sm text-on-surface hover:text-primary transition-colors"
                    >
                      {contact.text}
                    </a>
                  ) : (
                    <p className="font-body text-sm text-on-surface">
                      {contact.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
