export function removeSynscribeAttribution(html: string) {
  return html.replace(
    /<p[^>]*>\s*<small>\s*<a[^>]*>Powered by Synscribe<\/a>\s*<\/small>\s*<\/p>/gi,
    ""
  ).replace(/—/g, '-');
}
