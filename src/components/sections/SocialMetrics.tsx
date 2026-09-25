import type { Social } from "@/types";
import AnimateOnScroll from "../ui/AnimateOnScroll";
import { Icon } from "@iconify/react";

interface SocialMetricsProps {
  socials: Social[];
  blogCount: number;
  totalViews: number;
  twitterFollowers: number;
  github: { followers: number; publicRepos: number } | null;
  subscribers: number;
}

export default function SocialMetrics({ socials, blogCount, totalViews, twitterFollowers, github, subscribers }: SocialMetricsProps) {
  const socialLinks = socials.filter((s) => s.name !== "Email" && s.name !== "GitHub" && s.name !== "Twitter" && s.name !== "LinkedIn" && s.name !== "Instagram");

  const stats = [
    { icon: "ion:document-text-outline", label: "Total blogs", value: blogCount.toString(), sub: "to date" },
    { icon: "ion:eye-outline", label: "Total blog views", value: totalViews.toLocaleString(), sub: "all time" },
    { icon: "ion:logo-twitter", label: "Twitter followers", value: twitterFollowers.toString(), sub: "friends" },
    { icon: "ion:mail-outline", label: "Newsletter subscribers", value: subscribers.toString(), sub: "readers" },
    ...(github ? [
      { icon: "ion:logo-github", label: "GitHub repositories", value: github.publicRepos.toString(), sub: "public repositories" },
      { icon: "ion:people-outline", label: "GitHub followers", value: github.followers.toString(), sub: "friends" },
    ] : []),
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
      <AnimateOnScroll>
        <div className="flex items-center gap-2 mb-1">
          <Icon icon="ion:share-outline" width={16} className="text-primary" />
          <h2 className="signal-label">Social media metrics</h2>
        </div>
        <p className="mb-6 font-body text-sm text-content-muted">
          A snapshot of the channels where I share notes and experiments.
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-divider sm:grid-cols-4">
        {stats.map((stat, i) => (
          <AnimateOnScroll key={stat.label} delay={0.02 * (i + 1)}>
            <div className="bg-surface-container-low p-4 h-full">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon icon={stat.icon} width={13} className="text-primary/70" />
                <p className="font-label text-xs font-medium text-content-subtle">{stat.label}</p>
              </div>
              <p className="font-headline font-bold text-lg tracking-tight text-on-surface mb-0.5">{stat.value}</p>
              <p className="font-label text-xs text-content-subtle">{stat.sub}</p>
            </div>
          </AnimateOnScroll>
        ))}

        {socialLinks.map((s, i) => (
          <AnimateOnScroll key={s.name} delay={0.02 * (i + stats.length + 2)}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-surface group block h-full bg-surface-container-low p-4"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon icon={s.icon} width={13} className="text-primary/70" />
                <p className="font-label text-xs font-medium text-content-subtle">{s.name}</p>
              </div>
              <p className="font-headline font-bold text-lg tracking-tight text-on-surface group-hover:text-primary transition-colors mb-0.5">
                {s.username ?? s.name}
              </p>
              <p className="font-label text-xs text-content-subtle">Connect</p>
            </a>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
