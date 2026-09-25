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
  const leadSpansFullRow = services.length <= 3;

  return (
    <section id="services" className="section-base">
      <SectionHeader
        label="Working together"
        title="The work I take on"
        description="Architecture, code review, and performance work for teams shipping critical paths."
      />

      <StaggerContainer className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {services.map((service, index) => {
          const accent = SERVICE_ACCENTS[index % SERVICE_ACCENTS.length];
          const icon = isValidIconifyName(service.icon)
            ? service.icon
            : FALLBACK_ICONS[index % FALLBACK_ICONS.length];
          const layoutClass = index === 0
            ? leadSpansFullRow
              ? "lg:col-span-3"
              : "lg:col-span-2"
            : "lg:col-span-1";

          return (
            <StaggerItem key={service.title} className={layoutClass}>
              <div
                className={`group relative flex h-full flex-col rounded-2xl p-6 transition-colors sm:p-7 ${
                  index === 0
                    ? "bg-surface-container"
                    : "bg-surface-container-low hover:bg-surface-container"
                }`}
              >
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent.icon} ${accent.text}`}>
                      <Icon icon={icon} width={20} aria-hidden="true" />
                    </span>
                    <h3 className={`font-headline font-bold tracking-tight text-on-surface transition-colors group-hover:text-primary ${
                      index === 0 ? "text-2xl" : "text-lg"
                    }`}>
                      {service.title}
                    </h3>
                  </div>
                  <span className="font-label text-xs tracking-widest text-content-subtle">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className={`mt-6 font-body text-sm leading-relaxed text-on-surface-variant ${index === 0 ? "max-w-xl" : "max-w-sm"}`}>
                  {service.description}
                </p>

                {index === 0 && (
                  <div className="mt-auto pt-10">
                    <p className="font-label text-xs uppercase tracking-[0.18em] text-secondary">
                      Start with the bottleneck
                    </p>
                  </div>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
