import { getMe, getTestimonials, getSocials, getNav, getExperience, getContacts } from "@/lib/api";
import type { Experience } from "@/types";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimateOnScroll, { StaggerContainer, StaggerItem } from "@/components/ui/AnimateOnScroll";
import CTA from "@/components/sections/CTA";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { UTMLink } from "@/components/ui/UTMLink";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

function getYearsOfExperience(experience: Experience[]): string {
  const starts = experience.filter((e) => !e.skip).map((e) => new Date(e.start).getFullYear());
  const earliest = Math.min(...starts);
  const years = new Date().getFullYear() - earliest;
  return `${years}+`;
}

function getCompanyCount(experience: Experience[]): string {
  const companies = new Set(experience.filter((e) => !e.skip).map((e) => e.company));
  return `${companies.size}`;
}

const CONSULTING_SERVICES = [
  {
    title: "System Architecture & Design",
    icon: "ion:layers-outline",
    description:
      "End-to-end system design for platforms processing millions of transactions. Architecture reviews, database modeling, API design, and scalability planning.",
    gradient: "from-primary/10 to-primary-container/10",
    iconColor: "text-primary",
  },
  {
    title: "Code Reviews & Quality",
    icon: "ion:code-slash-outline",
    description:
      "Deep-dive code reviews focused on correctness, performance, and maintainability. TypeScript, React, Node.js, Go, Python, and Haskell codebases.",
    gradient: "from-secondary/10 to-secondary-container/10",
    iconColor: "text-secondary",
  },
  {
    title: "Performance Optimization",
    icon: "ion:flash-outline",
    description:
      "Identify and eliminate bottlenecks. Database query optimization, caching strategies, CDN configuration, bundle size reduction, and rendering performance.",
    gradient: "from-tertiary/10 to-tertiary-container/10",
    iconColor: "text-tertiary",
  },
  {
    title: "Cloud Infrastructure & DevOps",
    icon: "ion:cloud-outline",
    description:
      "Kubernetes cluster setup, CI/CD pipeline design, Terraform infrastructure-as-code, monitoring & observability stacks, and incident response planning.",
    gradient: "from-primary/10 to-primary-container/10",
    iconColor: "text-primary",
  },
  {
    title: "Growth & Product Engineering",
    icon: "ion:trending-up-outline",
    description:
      "Build growth loops, referral systems, SEO infrastructure, and product analytics. I've built systems that drove millions in revenue through engineering-led growth.",
    gradient: "from-secondary/10 to-secondary-container/10",
    iconColor: "text-secondary",
  },
  {
    title: "Technical Strategy & Advisory",
    icon: "ion:compass-outline",
    description:
      "Fractional CTO/tech advisor for early-stage startups. Technology selection, team structuring, sprint planning, and helping non-technical founders make informed decisions.",
    gradient: "from-tertiary/10 to-tertiary-container/10",
    iconColor: "text-tertiary",
  },
];

const HONEST_BOUNDARIES = [
  {
    title: "No SEO agencies",
    description: "I don't do keyword stuffing, backlink schemes, or content farms.",
  },
  {
    title: "No simple websites",
    description: "Not building brochure sites or landing pages. I work on complex, high-impact technical problems.",
  },
  {
    title: "No overnight miracles",
    description: "Good architecture takes time. If you need it yesterday, I'm not the right person.",
  },
  {
    title: "No full-time employment",
    description: "I'm available as a consultant or advisor, not as a full-time employee.",
  },
];

const TARGET_AUDIENCES = [
  {
    title: "Early-stage startups",
    description: "Founders who need to make the right technical decisions before they become expensive mistakes.",
    icon: "ion:rocket-outline",
  },
  {
    title: "Growing product teams",
    description: "Teams scaling from MVP to millions of users who need architectural guidance and code quality.",
    icon: "ion:people-outline",
  },
  {
    title: "Non-technical founders",
    description: "Founders who need a trusted technical partner to evaluate their stack, team, and roadmap.",
    icon: "ion:bulb-outline",
  },
];

const FAQ_ITEMS = [
  {
    q: "What's your availability like?",
    a: "I typically respond within 24 hours. For retainer and fractional CTO clients, I guarantee same-day responses during business hours (IST).",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. I'm happy to sign an NDA before we discuss anything sensitive.",
  },
  {
    q: "What industries do you work with?",
    a: "Primarily fintech, Battery Operated Airline IFE systems, SaaS, and developer tools — but I'm open to interesting problems in any space.",
  },
  {
    q: "Can you work with my existing team?",
    a: "Absolutely. I integrate with your existing workflows — Slack, GitHub, Linear, Notion — and work alongside your engineers.",
  },
  {
    q: "What's the typical engagement length?",
    a: "Hourly calls are one-off. Retainers are month-to-month. Fractional CTO engagements typically run 3-6 months.",
  },
];

export default async function ConsultingPage() {
  const [me, testimonials, socials, nav, experience, contacts] = await Promise.all([
    getMe(),
    getTestimonials(),
    getSocials(),
    getNav(),
    getExperience(),
    getContacts(),
  ]);

  return (
    <>
      <Navigation me={me} nav={nav} socials={socials} />

      <main>
        {/* Hero */}
        <section className="section-base pt-24 pb-16 md:pt-32 md:pb-20">
          <AnimateOnScroll>
            <p className="text-primary font-label text-xs font-semibold tracking-widest uppercase mb-4">
              Consulting
            </p>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-on-surface mb-6 max-w-4xl">
              Ship faster with expert{" "}
              <span className="gradient-text">engineering guidance</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl mb-8">
              {me.summary} I help startups and teams architect systems, review code,
              and make technical decisions that scale — without the overhead of a full-time hire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <CTA btn={me.cal} className="btn-primary">
                <Icon icon="ion:calendar-outline" width={16} />
                Schedule a Quick Call
              </CTA>
              <span className="font-body text-xs text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-full inner-glow">
                1st hour free
              </span>
              <a href="#faq" className="btn-ghost">
                <Icon icon="ion:help-circle-outline" width={16} />
                See FAQ
              </a>
            </div>
          </AnimateOnScroll>

          {/* Quick stats */}
          <AnimateOnScroll delay={0.15}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: getYearsOfExperience(experience), label: "Years Experience" },
                { value: getCompanyCount(experience), label: "Companies Served" },
                { value: "99.99%", label: "Uptime SLA" },
                { value: "M+", label: "Users Served" },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-container-low rounded-2xl p-5 inner-glow text-center">
                  <p className="font-headline text-2xl font-bold gradient-text mb-1">{stat.value}</p>
                  <p className="font-body text-xs text-on-surface-variant">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </section>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        {/* What I can help with */}
        <section id="services" className="section-base">
          <SectionHeader
            label="Services"
            title="What I can help with"
            description="These are the areas where I consistently deliver the highest impact."
          />
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONSULTING_SERVICES.map((service) => (
              <StaggerItem key={service.title}>
                <div className="relative h-full bg-surface-container-low rounded-2xl p-7 inner-glow hover:bg-surface-container hover:shadow-glow transition-all duration-300 group overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                  />
                  <div
                    className={`relative w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-6 ${service.iconColor}`}
                  >
                    <Icon icon={service.icon} width={22} />
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

        {/* Honest boundaries */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <section id="boundaries" className="section-base">
          <SectionHeader
            label="Clear Boundaries"
            title="What I don't do"
            description="I believe in being upfront. Here's what I won't take on, so we both save time."
          />
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {HONEST_BOUNDARIES.map((item) => (
              <StaggerItem key={item.title}>
                <div className="bg-surface-container-low rounded-2xl p-6 inner-glow h-full flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon="ion:close-circle-outline" width={18} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-base tracking-tight text-on-surface mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Who this is for */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <section id="audience" className="section-base">
          <SectionHeader
            label="Who This Is For"
            title="Is this you?"
            description="I work best with people who value quality, move fast, and need someone who's been there before."
          />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TARGET_AUDIENCES.map((item) => (
              <StaggerItem key={item.title}>
                <div className="bg-surface-container-low rounded-2xl p-7 inner-glow h-full">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-5 text-primary">
                    <Icon icon={item.icon} width={22} />
                  </div>
                  <h3 className="font-headline font-bold text-lg tracking-tight text-on-surface mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Pricing */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <section id="pricing" className="section-base">
          <SectionHeader
            label="Pricing"
            title="Simple, transparent"
            description="Fair rates for serious work. No hidden fees."
          />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <StaggerItem>
              <div className="bg-surface-container-low rounded-2xl p-7 inner-glow h-full flex flex-col">
                <h3 className="font-headline font-bold text-lg tracking-tight text-on-surface mb-1">
                  Short Term
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="font-headline text-3xl font-bold tracking-tighter gradient-text">
                    $30
                  </span>
                  <span className="font-body text-sm text-on-surface-variant">/hr</span>
                </div>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">
                  Pay-as-you-go for quick problems, code reviews, or architecture calls.
                </p>
                <ul className="space-y-3 mt-auto mb-6">
                  <li className="flex items-start gap-3">
                    <Icon icon="ion:checkmark-circle" width={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-on-surface">1 hour free consultation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon icon="ion:checkmark-circle" width={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-on-surface">Hourly billing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon icon="ion:checkmark-circle" width={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-on-surface">No commitment</span>
                  </li>
                </ul>
                <CTA btn={me.cal} className="btn-ghost w-full justify-center mt-auto">
                  <Icon icon="ion:calendar-outline" width={16} />
                  Schedule a Quick Call
                </CTA>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-surface-container-low rounded-2xl p-7 inner-glow h-full flex flex-col ring-1 ring-primary/30">
                <p className="font-label text-[10px] font-semibold tracking-widest uppercase text-primary mb-3">
                  Most popular
                </p>
                <h3 className="font-headline font-bold text-lg tracking-tight text-on-surface mb-1">
                  Discounted
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="font-headline text-3xl font-bold tracking-tighter gradient-text">
                    $25
                  </span>
                  <span className="font-body text-sm text-on-surface-variant">/hr</span>
                </div>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">
                  For startups and repeat clients who need ongoing support.
                </p>
                <ul className="space-y-3 mt-auto mb-6">
                  <li className="flex items-start gap-3">
                    <Icon icon="ion:checkmark-circle" width={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-on-surface">1 hour free consultation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon icon="ion:checkmark-circle" width={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-on-surface">Discounted hourly rate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon icon="ion:checkmark-circle" width={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-on-surface">Priority support</span>
                  </li>
                </ul>
                <CTA btn={me.cal} className="btn-primary w-full justify-center mt-auto">
                  <Icon icon="ion:calendar-outline" width={16} />
                  Schedule a Quick Call
                </CTA>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-surface-container-low rounded-2xl p-7 inner-glow h-full flex flex-col">
                <h3 className="font-headline font-bold text-lg tracking-tight text-on-surface mb-1">
                  Enterprise
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="font-headline text-2xl font-bold tracking-tighter gradient-text">
                    Let&rsquo;s discuss
                  </span>
                </div>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">
                  For teams needing deep engagement, retainer, or fractional CTO support.
                </p>
                <ul className="space-y-3 mt-auto mb-6">
                  <li className="flex items-start gap-3">
                    <Icon icon="ion:checkmark-circle" width={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-on-surface">1 hour free consultation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon icon="ion:checkmark-circle" width={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-on-surface">Custom pricing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon icon="ion:checkmark-circle" width={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-on-surface">Dedicated support</span>
                  </li>
                </ul>
                <CTA btn={me.cal} className="btn-ghost w-full justify-center mt-auto">
                  <Icon icon="ion:calendar-outline" width={16} />
                  Schedule a Quick Call
                </CTA>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* About me */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <section id="about" className="section-base">
          <SectionHeader
            label="About Me"
            title="Who's behind this?"
            description="A quick overview of my journey and what qualifies me to advise your team."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimateOnScroll className="lg:col-span-1" direction="left">
              <div className="bg-surface-container-low rounded-2xl p-6 inner-glow text-center h-full">
                <div className="relative w-24 h-24 rounded-full bg-surface-container mx-auto mb-4 overflow-hidden">
                  {me.avatarUrl ? (
                    <Image
                      src={me.avatarUrl}
                      alt={me.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-headline text-2xl font-bold text-primary">
                      {me.initials}
                    </div>
                  )}
                </div>
                <h3 className="font-headline font-bold text-xl tracking-tight text-on-surface mb-1">
                  {me.name}
                </h3>
                <p className="font-body text-sm text-on-surface-variant mb-4">
                  {experience[0]?.title} at {experience[0]?.company}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {socials.map((social) => (
                    <UTMLink
                      key={social.name}
                      href={social.href}
                      aria-label={social.name}
                      className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all duration-200"
                    >
                      <Icon icon={social.icon} width={16} />
                    </UTMLink>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll className="lg:col-span-2" delay={0.1} direction="right">
              <div className="bg-surface-container-low rounded-2xl p-7 inner-glow h-full">
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6 whitespace-pre-line">
                  {me.about}
                </p>
                <h4 className="font-headline font-semibold text-sm tracking-tight text-on-surface mb-4">
                  Past experience
                </h4>
                <div className="space-y-4">
                  {experience.filter((e) => !e.skip).slice(0, 4).map((exp) => (
                    <div key={exp.company + exp.title + exp.start} className="flex items-start gap-3">
                      <div className="relative w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                        {exp.logo ? (
                          <Image src={exp.logo} alt={exp.company} fill className="object-contain p-1" sizes="32px" unoptimized />
                        ) : (
                          <Icon icon="ion:briefcase-outline" width={14} className="text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-headline font-semibold text-sm tracking-tight text-on-surface">
                          {exp.title}
                        </p>
                        <p className="font-body text-xs text-on-surface-variant">
                          {exp.company} · {exp.start} – {exp.end || "Present"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Testimonials - Social Proof */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <Testimonials testimonials={testimonials} />

        {/* FAQ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <section id="faq" className="section-base">
          <SectionHeader
            label="FAQ"
            title="Frequently asked questions"
            description="Quick answers to common questions. If you don't see yours here, just ask."
          />
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <details
                key={item.q}
                className="group bg-surface-container-low rounded-2xl inner-glow overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-surface-container transition-colors duration-200">
                  <span className="font-headline font-semibold text-sm tracking-tight text-on-surface pr-4">
                    {item.q}
                  </span>
                  <Icon
                    icon="ion:chevron-down"
                    width={16}
                    className="text-on-surface-variant flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div className="px-5 pb-5">
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <Contact contacts={contacts} me={me} socials={socials} />
      </main>

      <Footer socials={socials} nav={nav} me={me} />
    </>
  );
}
