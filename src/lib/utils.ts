export function removeSynscribeAttribution(html: string) {
  return html.replace(
    /<p\b[^>]*>\s*<small\b[^>]*>[\s\S]*?\bPowered\s+by\b[\s\S]*?<\/small>\s*<\/p>/gi,
    ""
  ).replace(/—/g, '-');
}
