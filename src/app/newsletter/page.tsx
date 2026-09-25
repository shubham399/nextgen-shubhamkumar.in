import type { Metadata } from "next";
import { getMe, getSocials, getNav } from "@/lib/api";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Divider from "@/components/ui/Divider";
import NewsletterSubscribe from "./NewsletterSubscribe";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Newsletter — Shubham Kumar",
    description:
      "A Friday note on backend architecture, production incidents, and the decisions behind reliable software.",
  };
}

const DELIVERY_NOTES = [
  ["Friday", "One short dispatch, written for people who keep systems running."],
  ["Five minutes", "Enough context to understand the trade-off, not just the outcome."],
  ["No noise", "No filler, growth hacks, or advice copied from a conference slide."],
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

      <main id="main-content">
        <section className="section-base pb-16 pt-24 md:pb-20 md:pt-32">
          <AnimateOnScroll>
            <p className="signal-label mb-4">Newsletter</p>
            <h1 className="mb-6 max-w-3xl font-headline text-4xl font-bold tracking-tighter text-on-surface sm:text-5xl lg:text-6xl">
              Notes on systems that stay up.
            </h1>
            <p className="mb-8 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant sm:text-lg">
              Join {me.name.split(" ")[0]} for a Friday note on backend architecture, production incidents, and the decisions behind reliable software.
            </p>
            <div className="flex justify-start">
              <NewsletterSubscribe />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.15} className="mt-16 max-w-3xl">
            <p className="signal-label mb-4">Inside each issue</p>
            <div className="flex flex-col gap-2">
              {DELIVERY_NOTES.map(([label, description]) => (
                <div key={label} className="editorial-row">
                  <span className="w-24 flex-shrink-0 font-headline text-sm font-semibold text-secondary">
                    {label}
                  </span>
                  <span className="font-body text-sm text-on-surface-variant">{description}</span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Divider />
        </div>

        <section className="section-base pb-24">
          <AnimateOnScroll>
            <div className="surface-card max-w-3xl p-8 sm:p-10">
              <p className="signal-label mb-4">One useful dispatch, every Friday</p>
              <h2 className="mb-4 font-headline text-3xl font-bold tracking-tighter text-on-surface sm:text-4xl">
                Keep the useful parts close.
              </h2>
              <p className="mb-8 max-w-xl font-body text-base leading-relaxed text-on-surface-variant">
                A focused note on the systems, incidents, and decisions that deserve a second look.
              </p>
              <NewsletterSubscribe />
            </div>
          </AnimateOnScroll>
        </section>
      </main>

      <Footer socials={socials} nav={nav} me={me} />
    </>
  );
}
