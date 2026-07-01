import type { Social } from "@/types";
import AnimateOnScroll from "./AnimateOnScroll";
import { Icon } from "@iconify/react";

interface SocialMetricsProps {
  socials: Social[];
  blogCount: number;
  totalViews: number;
  twitterFollowers: number;
  github: { followers: number; publicRepos: number } | null;
}

export default function SocialMetrics({ socials, blogCount, totalViews, twitterFollowers, github }: SocialMetricsProps) {
  const socialLinks = socials.filter((s) => s.name !== "Email" && s.name !== "GitHub" && s.name !== "Twitter" && s.name !== "LinkedIn" && s.name !== "Instagram");

  const stats = [
    { icon: "ion:document-text-outline", label: "Total Blogs", value: blogCount.toString(), sub: "till now" },
    { icon: "ion:eye-outline", label: "Total Blog Views", value: totalViews.toLocaleString(), sub: "all-time" },
    { icon: "ion:logo-twitter", label: "Twitter Followers", value: twitterFollowers.toString(), sub: "friends" },
    ...(github ? [
      { icon: "ion:logo-github", label: "GitHub Repos", value: github.publicRepos.toString(), sub: "public repos" },
      { icon: "ion:people-outline", label: "GitHub Followers", value: github.followers.toString(), sub: "friends" },
    ] : []),
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
      <AnimateOnScroll>
        <div className="flex items-center gap-2 mb-1">
          <Icon icon="ion:share-outline" width={16} className="text-primary" />
          <p className="text-primary font-label text-xs font-semibold tracking-widest uppercase">
            Social Media Metrics
          </p>
        </div>
        <p className="font-body text-sm text-on-surface-variant/70 mb-6">
          tracks my social media metrics
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <AnimateOnScroll key={stat.label} delay={0.02 * (i + 1)}>
            <div className="bg-surface-container-low rounded-xl p-4 inner-glow h-full">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon icon={stat.icon} width={13} className="text-primary/70" />
                <p className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="font-headline font-bold text-lg tracking-tight text-on-surface mb-0.5">{stat.value}</p>
              <p className="font-label text-[10px] text-on-surface-variant/40">{stat.sub}</p>
            </div>
          </AnimateOnScroll>
        ))}

        {socialLinks.map((s, i) => (
          <AnimateOnScroll key={s.name} delay={0.02 * (i + stats.length + 2)}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-container-low rounded-xl p-4 inner-glow h-full block hover:bg-surface-container transition-colors duration-200 group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon icon={s.icon} width={13} className="text-primary/70" />
                <p className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-wider">{s.name}</p>
              </div>
              <p className="font-headline font-bold text-lg tracking-tight text-on-surface group-hover:text-primary transition-colors mb-0.5">
                {s.username ?? s.name}
              </p>
              <p className="font-label text-[10px] text-on-surface-variant/40">connect</p>
            </a>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
