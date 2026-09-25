import { Icon } from "@iconify/react";
import type { Me, Contact, Experience } from "@/types";
import SectionHeader from "../ui/SectionHeader";
import AnimateOnScroll from "../ui/AnimateOnScroll";

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
  const proof = [
    {
      value: getYearsOfExperience(experience),
      label: "years shipping",
      detail: "backend systems since 2018",
      accent: "text-primary",
    },
    {
      value: "90%",
      label: "latency removed",
      detail: "Juspay payout processing",
      accent: "text-secondary",
    },
    {
      value: "75%+",
      label: "launch success",
      detail: "AirFi captive portals",
      accent: "text-tertiary",
    },
  ];

  return (
    <section id="about" className="section-base">
      <SectionHeader
        label="About Me"
        title="Engineered for precision"
        description="A glimpse into the person behind the architecture."
      />

      <AnimateOnScroll className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 rounded-2xl bg-surface-container-low p-2 inner-glow">
          {proof.map((item) => (
            <div key={item.label} className="rounded-xl bg-surface-container p-5 sm:p-6">
              <p className={`font-headline text-3xl font-bold tracking-tighter ${item.accent}`}>
                {item.value}
              </p>
              <p className="font-headline text-sm font-semibold text-on-surface mt-2">
                {item.label}
              </p>
              <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll className="grid grid-cols-1 lg:grid-cols-2 gap-6" delay={0.1}>
        {/* Bio card */}
        <div className="bg-surface-container-low rounded-2xl p-7 inner-glow">
          <p className="font-label text-xs font-semibold tracking-widest uppercase text-secondary mb-3">
            The through-line
          </p>
          <h3 className="font-headline font-bold text-xl tracking-tighter text-on-surface mb-4">
            Make the system legible.
          </h3>
          <p className="font-body text-sm leading-[1.8] text-on-surface-variant">
            {me.about} My work spans the systems behind fast payments and in-flight connectivity, where latency, availability, and failure behavior matter more than novelty.
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
