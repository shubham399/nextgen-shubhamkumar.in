import type { Service } from "@/types";
import SectionHeader from "./SectionHeader";
import { StaggerContainer, StaggerItem } from "./AnimateOnScroll";

interface ServicesProps {
  services: Service[];
}

const SERVICE_ICONS = [
  // Gradient backgrounds for service cards
  "from-primary/10 to-primary-container/10",
  "from-secondary/10 to-secondary-container/10",
  "from-tertiary/10 to-tertiary-container/10",
];

const SERVICE_ICON_COLORS = [
  "text-primary",
  "text-secondary",
  "text-tertiary",
];

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="section-base">
      <SectionHeader
        label="What I Do"
        title="Services I offer"
        description="From architecture to optimization — here's where I deliver the most value."
      />

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <StaggerItem key={service.title}>
            <div className="relative h-full bg-surface-container-low rounded-2xl p-7 inner-glow hover:bg-surface-container hover:shadow-glow transition-all duration-300 group overflow-hidden">
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${SERVICE_ICONS[idx % SERVICE_ICONS.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
              />

              {/* Icon */}
              <div
                className={`relative w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-6 ${SERVICE_ICON_COLORS[idx % SERVICE_ICON_COLORS.length]}`}
              >
                {/* Code/dev icon */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>

              <div className="relative">
                <h3 className="font-headline font-bold text-lg tracking-tight text-on-surface mb-3">
                  {service.title}
                </h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
