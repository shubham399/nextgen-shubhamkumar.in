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
  const starts = experience
    .filter((entry) => !entry.skip)
    .map((entry) => new Date(entry.start).getFullYear())
    .filter((year) => Number.isFinite(year));
  if (!starts.length) return "0+";
  return `${new Date().getFullYear() - Math.min(...starts)}+`;
}

export default function About({ me, contacts, experience }: AboutProps) {
  const proof = [
    {
      value: getYearsOfExperience(experience),
      label: "years in production",
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
        label="Point of view"
        title="What I optimize for"
        description="The through-line is simple: make complex systems easier to operate."
      />

      <AnimateOnScroll className="mb-10">
        <div className="grid grid-cols-1 gap-1 rounded-2xl bg-surface-container-low p-2 lg:grid-cols-5">
          {proof.map((item, index) => (
            <div
              key={item.label}
              className={`rounded-xl bg-surface-container p-5 sm:p-6 ${
                index === 0
                  ? "lg:col-span-2 lg:row-span-2 lg:flex lg:flex-col lg:justify-between"
                  : "lg:col-span-3"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <p className={`font-headline text-4xl font-bold tracking-tighter sm:text-5xl ${item.accent}`}>
                  {item.value}
                </p>
                <span className="font-label text-xs tracking-widest text-content-subtle">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-8 lg:mt-0">
                <p className="font-headline text-sm font-semibold text-on-surface">
                  {item.label}
                </p>
                <p className="mt-1 max-w-sm font-body text-xs leading-relaxed text-content-muted">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll className="grid grid-cols-1 gap-6 lg:grid-cols-2" delay={0.1}>
        <div className="surface-card p-7">
          <p className="signal-label mb-3">The through-line</p>
          <h3 className="mb-4 font-headline text-xl font-bold tracking-tight text-on-surface">
            Make the system legible.
          </h3>
          <p className="font-body text-sm leading-[1.8] text-on-surface-variant">
            {me.about} My work spans the systems behind fast payments and in-flight connectivity, where latency, availability, and failure behavior matter more than novelty.
          </p>
        </div>

        <div className="surface-card p-7">
          <h4 className="mb-5 font-headline text-sm font-semibold tracking-tight text-on-surface">
            Contact details
          </h4>
          <div className="flex flex-col gap-4">
            {contacts.map((contact) => (
              <div key={contact.title} className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <Icon icon={contact.icon} width={16} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-label text-xs text-on-surface-variant">
                    {contact.title}
                  </p>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="font-body text-sm text-on-surface transition-colors hover:text-primary"
                    >
                      {contact.text}
                    </a>
                  ) : (
                    <p className="font-body text-sm text-on-surface">{contact.text}</p>
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
