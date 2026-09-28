"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { defaultPaletteName, themeStorageKey, type PaletteName } from "@/lib/theme";
import { allPalettes, allPaletteNames } from "@/lib/palette-candidates";

/**
 * The palette control itself, loaded lazily by `ThemePicker` and never rendered
 * in production.
 *
 * The shipped palette plus the candidates from `palette-candidates.ts`, so the
 * colour decisions can be judged against each other rather than in the abstract.
 * Selection is a `data-theme` attribute on `<html>`; `themeCss()` and
 * `allPaletteCss()` have already published the custom properties for every role,
 * chart series included, so the switch needs no re-render of the page itself.
 */
export default function ThemePickerControl() {
  const [active, setActive] = useState<PaletteName>(defaultPaletteName);
  const groupRef = useRef<HTMLDivElement>(null);

  // The pre-paint script may already have switched palettes by the time this
  // runs, so adopt whatever is on <html> rather than assuming the default.
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current && allPaletteNames().includes(current)) setActive(current);
  }, []);

  const select = useCallback((name: PaletteName) => {
    setActive(name);
    if (name === defaultPaletteName) document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", name);
    try {
      localStorage.setItem(themeStorageKey, name);
    } catch {
      // Private mode or blocked storage. The switch still works for this view.
    }
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!delta) return;
      event.preventDefault();
      const names = allPaletteNames();
      const next = names[(names.indexOf(active) + delta + names.length) % names.length];
      select(next);
      groupRef.current?.querySelector<HTMLButtonElement>(`[data-theme-option="${next}"]`)?.focus();
    },
    [active, select],
  );

  const palettes = allPalettes();
  const current = palettes[active];

  return (
    // z-[300] clears everything else on the page: the newsletter fullscreen sits
    // at z-[100] and the toast at z-[200]. A dev tool that hides behind the
    // newsletter modal is a dev tool you cannot reach when you need it.
    <div className="fixed bottom-4 right-4 z-[300] print:hidden">
      <div className="surface-card flex items-center gap-2 rounded-lg px-2.5 py-2 shadow-lg">
        <span className="signal-label pl-1" aria-hidden>
          Theme
        </span>
        <div
          ref={groupRef}
          role="radiogroup"
          aria-label="Colour theme, local development only"
          className="flex items-center gap-1"
          onKeyDown={onKeyDown}
        >
          {allPaletteNames().map((name) => {
            const selected = name === active;
            return (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                data-theme-option={name}
                title={palettes[name].blurb}
                onClick={() => select(name)}
                className={`badge flex items-center gap-1.5 px-2 py-1 font-label text-xs transition-colors ${
                  selected
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-content-muted hover:text-on-surface"
                }`}
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: palettes[name].colors.primary.primary }}
                />
                {palettes[name].label}
              </button>
            );
          })}
        </div>
      </div>
      <p className="sr-only">
        {current.story} The choice is remembered in this browser only, and no theme
        switcher is available in a production build.
      </p>
    </div>
  );
}
