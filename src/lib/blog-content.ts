import { removeSynscribeAttribution } from "@/lib/utils";

function escapeAttribute(value: string) {
  return value
    .replace(/&(?!(?:#\d+|#x[\da-f]+|[a-z][\da-z]+);)/gi, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * CMS HTML is authored outside this app, so it cannot be trusted to start at
 * h2 or to carry image dimensions. Normalize it before it reaches the page and
 * before the table of contents is generated from the same markup.
 */
export function normalizeBlogContent(html: string, fallbackAlt = "") {
  let imageCount = 0;

  return removeSynscribeAttribution(html)
    .replace(/<h1(\s[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(
      /<h([2-6])(\s[^>]*)?>\s*(?:&nbsp;|<br\s*\/?>|\s)*<\/h\1>/gi,
      ""
    )
    .replace(/<img\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi, (_match, attrs: string) => {
      const selfClosing = /\/\s*$/.test(attrs);
      let next = attrs.replace(/\/\s*$/, "");

      if (!/(?:^|\s)alt\s*=/i.test(next)) {
        const title = next.match(/(?:^|\s)title\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
        const alt = title?.[1] || title?.[2] || (imageCount === 0 ? fallbackAlt : "");
        next += ` alt="${escapeAttribute(alt)}"`;
      }
      if (!/(?:^|\s)loading\s*=/i.test(next)) next += ' loading="lazy"';
      if (!/(?:^|\s)decoding\s*=/i.test(next)) next += ' decoding="async"';

      imageCount += 1;
      return `<img${next}${selfClosing ? " /" : ""}>`;
    })
    .replace(
      /<table\b[\s\S]*?<\/table>/gi,
      (table) =>
        `<div class="blog-table" role="region" aria-label="Table" tabindex="0">${table}</div>`
    );
}
