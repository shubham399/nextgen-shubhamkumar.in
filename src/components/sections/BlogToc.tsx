"use client";

import { useState, useEffect } from "react";
import type { TableOfContentsItem } from "@wisp-cms/table-of-content";

export default function BlogToc({ items }: { items: TableOfContentsItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="lg:sticky lg:top-32">
      <h3 className="font-headline text-sm font-semibold tracking-tighter text-on-surface mb-4">
        On this page
      </h3>
      <div className="border-l border-outline-variant/30 pl-4 space-y-2.5">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block font-body text-sm transition-all duration-200 py-0.5 ${
              activeId === item.id
                ? "text-primary border-l -ml-4 pl-[calc(1rem-1px)] border-primary"
                : "text-on-surface-variant/50 hover:text-on-surface-variant"
            }`}
            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
          >
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
