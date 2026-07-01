"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { hasViewed, markViewed } from "@/lib/cookies";

interface BlogViewCounterProps {
  slug: string;
}

export default function BlogViewCounter({ slug }: BlogViewCounterProps) {
  const totalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function animateNumber(
      start: number,
      end: number,
      duration: number,
      element: HTMLElement
    ) {
      const startTime = performance.now();
      const difference = end - start;

      function easeOutCubic(t: number) {
        return 1 - Math.pow(1 - t, 3);
      }

      function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentNumber = Math.round(start + difference * easedProgress);
        element.textContent = currentNumber.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }

    async function updateViewCount() {
      const alreadyViewed = hasViewed(slug);
      const url = alreadyViewed ? `/api/hit/${slug}?readonly=true` : `/api/hit/${slug}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(`[BlogViewCounter] slug=${slug} url=${url} status=${res.status} response=`, data);
        const total = data.total;

        if (totalRef.current) {
          if (typeof total !== "number" || total === 0) {
            totalRef.current.textContent = "N/A";
          } else {
            totalRef.current.textContent = "0";
            animateNumber(0, total, 1000, totalRef.current);
          }
        }

        if (!alreadyViewed) markViewed(slug);
      } catch {
        if (totalRef.current) {
          totalRef.current.textContent = "N/A";
        }
      }
    }

    updateViewCount();
  }, [slug]);

  return (
    <span className="font-label text-xs text-on-surface-variant/60 inline-flex items-center gap-1">
      <Icon icon="ion:eye-outline" width={13} />
      <span className="tabular-nums">
        <span ref={totalRef}><span className="animate-pulse">...</span></span>
      </span>
    </span>
  );
}
