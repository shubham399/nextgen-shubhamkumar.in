"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * Dev-only palette switcher.
 *
 * This shell is deliberately thin and loads the actual control as a dynamic
 * import behind a build-time `NODE_ENV` check. `process.env.NODE_ENV` is inlined
 * by the compiler, so in a production build the guard folds to `true`, the
 * `import()` is dead code, and the control module is never emitted at all: the
 * candidate palettes in `palette-candidates.ts` do not reach a production
 * payload, in any chunk.
 *
 * A static import would not do, because a `use client` module pulled in by the
 * root layout is always in the client graph even when its component renders
 * null, so the candidate hexes would ride along in the preloaded layout chunk.
 */
export default function ThemePicker() {
  const [Control, setControl] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    let live = true;
    import("./ThemePickerControl").then((module) => {
      if (live) setControl(() => module.default);
    });
    return () => {
      live = false;
    };
  }, []);

  return Control ? <Control /> : null;
}
