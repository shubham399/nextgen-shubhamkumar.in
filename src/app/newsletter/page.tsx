import { getMe, getSocials, getNav } from "@/lib/api";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { Icon } from "@iconify/react";
import NewsletterSubscribe from "./NewsletterSubscribe";

const BENEFITS = [
  {
    icon: "ion:code-slash-outline",
    title: "Production Engineering",
    description: "Real lessons from building fintech systems, handling payments at scale, and keeping 99.99% uptime.",
  },
  {
    icon: "ion:layers-outline",
    title: "System Design Deep-Dives",
    description: "Architecture breakdowns of systems I've built and operated — from IFE platforms to payment gateways.",
  },
  {
    icon: "ion:flash-outline",
    title: "Tools & Workflows",
    description: "Dev environment setups, CI/CD patterns, monitoring stacks, and productivity hacks I use daily.",
  },
  {
    icon: "ion:bulb-outline",
    title: "Career & Mindset",
    description: "Navigating engineering growth, remote work, and building a career across continents.",
  },
  {
    icon: "ion:lock-closed-outline",
    title: "Security & CTF",
    description: "Lessons from ethical hacking, CTF writeups, and security practices for production systems.",
  },
  {
    icon: "ion:rocket-outline",
    title: "Early Access",
    description: "New projects, open-source releases, and experiments before they go public.",
  },
];

export default async function NewsletterPage() {
  const [me, socials, nav] = await Promise.all([
    getMe(),
    getSocials(),
    getNav(),
  ]);

  return (
    <>
      <Navigation me={me} nav={nav} socials={socials} />

      <main>
        {/* Hero */}
        <section className="section-base pt-24 pb-16 md:pt-32 md:pb-20">
          <AnimateOnScroll>
            <p className="text-primary font-label text-xs font-semibold tracking-widest uppercase mb-4">
              Newsletter
            </p>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-on-surface mb-6 max-w-3xl">
              Engineering insights{" "}
              <span className="gradient-text">from the trenches</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl mb-8">
              Join {me.name.split(" ")[0]}&rsquo;s newsletter for weekly dispatches on distributed systems,
              fintech engineering, and building things that work at scale.
            </p>
            <div className="flex justify-start">

              <NewsletterSubscribe />
            </div>
          </AnimateOnScroll>

          {/* Stats */}
          <AnimateOnScroll delay={0.15}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "Weekly", label: "Posts" },
                { value: "5 min", label: "Read time" },
                { value: "No spam", label: "Ever" },
                { value: "Unsubscribe", label: "Anytime" },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-container-low rounded-2xl p-5 inner-glow text-center">
                  <p className="font-headline text-sm font-bold gradient-text mb-1">{stat.value}</p>
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



        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        {/* Final CTA */}
        <section className="section-base pb-24">
          <AnimateOnScroll>
            <div
              className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(165,231,255,0.07) 0%, rgba(0,210,255,0.07) 100%)",
              }}
            >
              <div
                className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-10 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #00d2ff 0%, transparent 70%)",
                }}
              />
              <div className="relative">
                <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter text-on-surface mb-4">
                  Join the list
                </h2>
                <p className="font-body text-base text-on-surface-variant leading-relaxed max-w-xl mx-auto mb-8">
                  No spam, no filler. Just engineering insights from building at scale.
                </p>
                <div className="flex justify-center">
                  <NewsletterSubscribe />
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </section>
      </main>

      <Footer socials={socials} nav={nav} me={me} />
    </>
  );
}
