## Why

Motion in the app is implemented as inline magic numbers scattered across 10 components (338 `framer-motion` usages). There is no shared timing vocabulary: durations span 7 distinct values (0.8 used 10×, 0.5, 0.2, 0.3, 1.5, 2, 4), delays span 12 distinct values, and 336 of 338 animations specify no easing at all (falling back to Framer defaults). The same "fade up from 20px" reveal is duplicated everywhere but with different durations and even flipped key order, so elements that should rise into place together drift apart. The most-seen animation — the "Buka Undangan" page open (`app.jsx:160`) — is an asymmetric mismatch: a flat opacity exit (default ~0.3s) followed by an unrelated 0.5s fade-in, reading as a blink rather than an intentional transition. No component respects `prefers-reduced-motion`. This is the natural moment to introduce a shared motion system because all three problems share one root cause: no single source of truth for motion.

## What Changes

- Introduce a shared motion module (`src/lib/motion.js`) defining named duration tiers, standardized easing, and reusable variant presets (fade, fade-up, scale-in, page enter/exit, stagger).
- Adopt the shared tokens/variants across all 10 motion components, replacing inline magic numbers so equivalent animations share identical timing.
- Redesign the landing → main page transition (`app.jsx`) so exit and enter are a deliberate, symmetric pair with shared timing and directional continuity.
- Respect `prefers-reduced-motion`: when the user requests reduced motion, animations collapse to instant/opacity-only with no positional movement.

Non-goals: no API, data, routing, or business-logic changes; no new dependencies (Framer Motion already present); no redesign of layout or visual styling beyond motion timing/behavior; ambient/decorative loops (FloatingHearts, countdown pulse) may be tokenized but their character is preserved.

## Capabilities

### New Capabilities
- `motion-system`: A shared, centralized definition of animation timing (duration tiers, easing), reusable motion variant presets, page-transition behavior, and reduced-motion handling that all UI components consume instead of inline values.

### Modified Capabilities
<!-- None: no existing spec defines motion behavior; this is net-new. -->

## Impact

- **New code**: `src/lib/motion.js` (tokens, variants, reduced-motion-aware helpers).
- **Modified components** (motion adoption, presentational only): `src/app.jsx`, `src/components/layout/layout.jsx`, `src/components/layout/bottom-bar.jsx`, `src/features/invitation/components/hero.jsx`, `src/features/invitation/components/landing-page.jsx`, `src/features/events/components/events.jsx`, `src/features/events/components/events-card.jsx`, `src/features/gifts/components/gifts.jsx`, `src/features/location/components/location.jsx`, `src/features/wishes/components/wishes.jsx`.
- **Dependencies**: none added; uses Framer Motion's existing `useReducedMotion`.
- **Tests**: existing suites are API/schema-focused and do not cover animation; verification is primarily visual review plus lint/build. Optional: a light unit test asserting the motion module exposes expected tokens/variants.
- **Accessibility**: adds `prefers-reduced-motion` support where there was none.
