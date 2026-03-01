# Project Review: Bugs, Optimizations, and Enhancements

Date: 2026-03-01

## Executive Summary

The project builds and lints successfully, but there are several structural, accessibility, and maintainability issues worth addressing. Most are low-to-medium risk but easy wins. The most important items are duplicate section IDs, missing fetch status validation, and keyboard accessibility gaps in interactive elements.

## What I checked

- Code structure and key UI sections in `src/App.tsx` and main feature components.
- Build/lint health via npm scripts.
- Dependency consistency in `package.json`.

## Potential Bugs

### 1) Duplicate section IDs in the DOM (high impact, easy fix)
- `App.tsx` wraps each section in `<section id="...">`, while many child components also render their own `<section id="...">` with the same ID.
- Duplicate IDs are invalid HTML and can cause anchor scroll/navigation targeting and accessibility tooling issues.
- Suggested fix: keep IDs in **one place only** (preferably in parent layout or inside each section component, but not both).

### 2) Fetch call does not validate HTTP status (medium impact)
- `fetch('./data.json')` directly calls `response.json()` without checking `response.ok`.
- Non-2xx responses can still parse and lead to confusing runtime states.
- Suggested fix: add `if (!response.ok) throw new Error(...)` before JSON parsing.

### 3) Clickable project cards are mouse-only interaction (accessibility bug)
- Project cards are interactive via `onClick` on a `<div>`.
- Keyboard users cannot activate cards via Enter/Space; this fails expected accessibility behavior for interactive controls.
- Suggested fix: use `<button>`/`<a>` semantics or add `role="button"`, `tabIndex={0}`, and keyboard handlers.

### 4) Mobile menu toggle button lacks explicit accessible name/state
- The mobile menu button in `Header.tsx` has no `aria-label` and no `aria-expanded`.
- Screen readers cannot clearly announce toggle purpose/state.
- Suggested fix: add `aria-label="Toggle navigation menu"`, `aria-expanded={isMenuOpen}`, and `aria-controls`.

### 5) Marker list uses array index as key (stability risk)
- `ProjectMaps.tsx` uses `key={idx}` for map markers.
- Index keys can cause unstable reconciliation when data ordering changes.
- Suggested fix: use a deterministic key (e.g., project name + region/location).

## Optimization Opportunities

### 1) Remove unused computed value in `KeyProjects`
- `categorizedProjects` is memoized but not used.
- This adds unnecessary computation and mental overhead.
- Suggested fix: remove it, or wire it into a category filter UI.

### 2) Simplify no-op helper
- `formatValue` returns input unchanged in all paths.
- Suggested fix: inline/remove function unless future formatting logic is planned.

### 3) Reduce dependency/type noise
- `react-router-dom` is version 6 while `@types/react-router-dom` is version 5 in `devDependencies`.
- Even if currently unused, this mismatch may create confusion or future type conflicts.
- Suggested fix: remove `@types/react-router-dom` (v6 ships its own types) unless a v5-specific package is intentionally used.

### 4) Lockfile strategy consistency
- Both `package-lock.json` and `pnpm-lock.yaml` are present.
- Maintaining two lockfiles can cause drift.
- Suggested fix: standardize on one package manager for deterministic CI/dev installs.

## Enhancement Ideas

1. Add lightweight tests (e.g., Vitest + React Testing Library) for:
   - Data loading success/error states.
   - Header navigation/menu toggle.
   - Project modal open/close behavior.

2. Add runtime data validation for `public/data.json` using `zod` (already a dependency).
   - This can protect against malformed content updates.

3. Add performance budget checks in CI.
   - Current JS bundle is ~472.6 kB before gzip; introduce a budget gate and monitor regressions.

4. Improve user-facing error state.
   - Replace generic “Error loading data” with retry action + more context.

## Command Results

- `npm run lint` ✅ passed.
- `npm run build` ✅ passed (with non-blocking Browserslist data staleness warning).

