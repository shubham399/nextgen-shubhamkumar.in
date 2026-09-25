import Image from "next/image";
import { Icon } from "@iconify/react";
import type { Certificate } from "@/types";
import SectionHeader from "../ui/SectionHeader";
import { StaggerContainer, StaggerItem } from "../ui/AnimateOnScroll";

interface CertificatesProps {
  certificates: Certificate[];
}

export default function Certificates({ certificates }: CertificatesProps) {
  return (
    <section id="certificates" className="section-base">
      <SectionHeader
        label="Credentials"
        title="A few credentials"
        description="Formal training that supports the practical work."
      />

      <StaggerContainer className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {certificates.map((certificate, index) => (
          <StaggerItem key={`${certificate.title}-${index}`}>
            <a
              href={certificate.link}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-surface group flex h-full items-start gap-4 rounded-2xl bg-surface-container-low p-5 sm:p-6"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container-high p-1.5">
                <Image
                  src={certificate.issuerIcon}
                  alt=""
                  width={28}
                  height={28}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-headline text-sm font-semibold text-primary">
                    {certificate.issuer}
                  </p>
                  <p className="font-label text-xs text-content-muted">{certificate.issuedAt}</p>
                </div>
                <p className="mt-2 font-headline font-semibold leading-snug text-on-surface transition-colors group-hover:text-primary group-focus-visible:text-primary">
                  {certificate.title}
                </p>
                <p className="mt-4 flex items-center gap-1.5 font-label text-xs text-tertiary">
                  <Icon icon="ion:checkmark-circle-outline" width={14} aria-hidden="true" />
                  Verified credential
                </p>
              </div>
              <Icon
                icon="ion:open-outline"
                width={16}
                className="mt-1 flex-shrink-0 text-content-subtle transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:translate-x-0.5 group-focus-visible:text-primary"
                aria-hidden="true"
              />
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
