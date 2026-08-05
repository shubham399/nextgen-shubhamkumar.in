import type { Service } from "@/types";
import { Icon } from "@iconify/react";
import SectionHeader from "../ui/SectionHeader";
import { StaggerContainer, StaggerItem } from "../ui/AnimateOnScroll";

interface ServicesProps {
  services: Service[];
}

const FALLBACK_ICONS = [
  "mdi:server-network",
  "mdi:cash-multiple",
  "mdi:source-branch",
];

function isValidIconifyName(name: string): boolean {
  return /^[a-z0-9-]+:.+$/i.test(name);
}

const SERVICE_ACCENTS = [
  {
    tile: "from-primary/20 to-primary-container/10",
    text: "text-primary",
  },
  {
    tile: "from-secondary/20 to-secondary-container/10",
    text: "text-secondary",
  },
  {
    tile: "from-tertiary/20 to-tertiary-container/10",
    text: "text-tertiary",
  },
];

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="section-base">
      <SectionHeader
        label="What I Do"
        title="Services I offer"
        description="From architecture to optimization - here's where I deliver the most value."
      />

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => {
          const accent = SERVICE_ACCENTS[idx % SERVICE_ACCENTS.length];
          const icon = isValidIconifyName(service.icon)
            ? service.icon
            : FALLBACK_ICONS[idx % FALLBACK_ICONS.length];
          return (
            <StaggerItem key={service.title}>
              <div className="relative h-full bg-surface-container-low rounded-2xl p-7 inner-glow hover:bg-surface-container hover:shadow-glow hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                {/* Background gradient wash */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${accent.tile} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                />

                {/* Index */}
                <span className="absolute top-7 right-7 font-label text-xs tracking-widest text-on-surface-variant/50">
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${accent.tile} inner-glow flex items-center justify-center mb-6 ${accent.text} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon icon={icon} width={22} />
                </div>

                <div className="relative">
                  <h3 className="font-headline font-bold text-lg tracking-tight text-on-surface group-hover:text-primary transition-colors mb-3">
                    {service.title}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
