import type { Service } from "@/types";
import { Icon } from "@iconify/react";
import SectionHeader from "../ui/SectionHeader";
import { StaggerContainer, StaggerItem } from "../ui/AnimateOnScroll";

interface ServicesProps {
  services: Service[];
}

const FALLBACK_ICONS = ["mdi:server-network", "mdi:cash-multiple", "mdi:source-branch"];

const SERVICE_ACCENTS = [
  { icon: "bg-primary/10", text: "text-primary" },
  { icon: "bg-secondary/10", text: "text-secondary" },
  { icon: "bg-tertiary/10", text: "text-tertiary" },
];

function isValidIconifyName(name: string): boolean {
  return /^[a-z0-9-]+:.+$/i.test(name);
}

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="section-base">
      <SectionHeader
        label="Working together"
        title="The work I take on"
        description="Architecture, code review, and performance work for teams shipping critical paths."
      />

      <StaggerContainer className="flex flex-col gap-3">
        {services.map((service, index) => {
          const accent = SERVICE_ACCENTS[index % SERVICE_ACCENTS.length];
          const icon = isValidIconifyName(service.icon)
            ? service.icon
            : FALLBACK_ICONS[index % FALLBACK_ICONS.length];
          const isLead = index === 0;

          return (
            <StaggerItem key={service.title}>
              <article
                className={`grid gap-x-6 gap-y-4 rounded-2xl p-6 transition-colors duration-150 ease-out sm:p-7 lg:grid-cols-[2.75rem_minmax(0,22rem)_minmax(0,1fr)] lg:items-start ${
                  isLead ? "bg-surface-container" : "bg-surface-container-low hover:bg-surface-container"
                }`}
              >
                <span className={`font-label text-xs font-semibold tracking-[0.18em] ${accent.text}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent.icon} ${accent.text}`}
                  >
                    <Icon icon={icon} width={20} aria-hidden="true" />
                  </span>
                  <h3
                    className={`text-balance font-headline font-bold tracking-tight text-on-surface ${
                      isLead ? "text-2xl" : "text-xl"
                    }`}
                  >
                    {service.title}
                  </h3>
                </div>

                <div className="lg:col-start-3">
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                    {service.description}
                  </p>

                  {isLead && (
                    <p className="mt-5 font-label text-xs uppercase tracking-[0.18em] text-secondary">
                      Start with the bottleneck
                    </p>
                  )}
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
