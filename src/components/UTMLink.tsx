type Props = {
  href: string
  className?: string
  children: React.ReactNode
  utm?: Record<string, string>
}

export function UTMLink({
  href,
  className,
  children,
  utm = {
    utm_source: "portfolio_site",
    utm_medium: "link",
    utm_campaign: "default",
  },
}: Props) {
  const url = new URL(href)

  Object.entries(utm).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  return (
    <a
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}
