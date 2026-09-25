import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  utm?: Record<string, string>;
};

export function UTMLink({
  href,
  className,
  children,
  utm = {
    utm_source: "portfolio_site",
    utm_medium: "link",
    utm_campaign: "default",
  },
  ...anchorProps
}: Props) {
  const url = new URL(href);

  Object.entries(utm).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return (
    <a
      {...anchorProps}
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
