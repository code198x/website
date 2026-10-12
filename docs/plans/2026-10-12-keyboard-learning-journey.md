# Keyboard learning journey — issue #410

Scope: Start Here → Foundations → Counting in Twos → its first lesson, plus search, theme and narrow-screen menu. Review the published site using keyboard input only; DOM reads and screenshots provide observations, not shortcuts for interaction. This is not a screen-reader or full accessibility audit.

1. Record current main/deployed context, Chromium version, host OS and viewport. Preserve unrelated untracked files.
2. Use Tab, Shift+Tab, Enter, Space and Escape to follow the journey at desktop and narrow widths. Check visible focus, skip-link destination, page transitions, search results/dismissal, theme control, menu dismissal and hidden controls. Save a reproducible report and screenshots.
3. For any failure, reproduce it before changing the owning component (`src/layouts/Layout.astro`, `src/components/Search.astro`, or the current theme control). Add a targeted regression to `tests/navigation.spec.ts` or an adjacent focused test; prove it fails before the fix. No layout redesign or accessibility-baseline expansion.
4. Verify any correction against the production build, both themes and viewport widths, run applicable website checks and record results. Commit only task changes. Stop task-owned servers and browsers.

After this bounded review, proceed to emu198x/emu198x#1542 under its own repository rules and written plan. The agreed direction is to replace local BASIC tokenisers with the published family crates, preserving independent ROM-backed validation.
