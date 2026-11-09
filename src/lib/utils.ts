export function removeSynscribeAttribution(html: string) {
  return html.replace(
    /<p\b[^>]*>\s*<small>\s*<a\b[^>]*>\s*Powered\s+by\b[\s\S]*?<\/a>\s*<\/small>\s*<\/p>/gi,
    ""
  ).replace(/—/g, '-');
}
