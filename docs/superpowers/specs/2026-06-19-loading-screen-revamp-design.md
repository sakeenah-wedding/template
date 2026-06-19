# Loading Screen UI Revamp

**Date:** 2026-06-19  
**Status:** Approved

## Summary

Replace the utilitarian "Memuat undangan..." loading screen with a premium, modern-minimal loading experience using typographic animation.

## Current State

- **Global loading** (`src/app.jsx`): Pulsing Heart icon (Lucide) + "Memuat undangan..." on rose/pink gradient
- **Suspense fallback** (`src/app.jsx`): Similar "Memuat..." text
- **Wishes loading** (`src/features/wishes/components/wishes.jsx`): Spinning Loader2 icon + "Memuat pesan..."
- All feel utilitarian and generic

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Style | Modern & minimal | Premium, no visual noise |
| Focal element | Typography reveal | Clean, confident — text IS the design |
| Word | "PREPARING" | Understated luxury, international feel |
| Background | Warm off-white `#faf9f7` | Premium stationery feel, softer than pure white |
| Exit transition | Slide up & away | Subtle physicality, like lifting a cover sheet |
| Accent color | Rose `#be123c` | Consistent with existing brand palette |
| Load duration | 1-3 seconds | Sweet spot for branded micro-interaction |

## Visual Specification

### Global Loading Screen (Primary)

**Layout:**
- Full viewport height, centered flex container
- Background: solid `#faf9f7`

**Typography:**
- Word: "PREPARING"
- Font: Playfair Display (serif) — already configured as `font-serif` in Tailwind
- Size: ~13px (`text-xs` or custom)
- Color: `#999` / `text-gray-400`
- Letter-spacing: 6px (`tracking-[6px]`)
- Text-transform: uppercase

**Line accent:**
- Width: 44px
- Height: 1px
- Color: `#be123c` / `bg-rose-600`
- Centered below text with 16px margin-top

### Animation Sequence

```
0.0s  — Screen visible, warm off-white background
0.3s  — "PREPARING" fades up (opacity 0→1, translateY 8px→0, duration 1s, ease-out)
0.7s  — Rose line draws from center (width 0→44px, duration 1.2s, ease-out)
~load  — Hold until data ready
exit  — Entire screen slides up (y: 0 → "-100%") + fades (opacity 1→0)
        Duration: 500ms, ease: easeInOut
post  — Content visible underneath, no additional entry animation needed
```

### Implementation via Framer Motion

```jsx
// Loading screen container
<AnimatePresence>
  {isLoading && (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf9f7]"
    >
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
          className="font-serif text-xs text-gray-400 tracking-[6px] uppercase"
        >
          PREPARING
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 44 }}
          transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
          className="h-px bg-rose-600 mx-auto mt-4"
        />
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

### Wishes Section Loading (Secondary)

For section-level loading within the wishes component:
- No text — just a thin rose line animation (same draw effect)
- Keeps premium feel consistent without being heavy for inline use
- Replace the spinning Loader2 icon + "Memuat pesan..."

```jsx
<div className="flex items-center justify-center py-8">
  <motion.div
    initial={{ width: 0 }}
    animate={{ width: 44 }}
    transition={{ duration: 1.2, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
    className="h-px bg-rose-600"
  />
</div>
```

## Files to Modify

| File | Change |
|------|--------|
| `src/app.jsx` | Replace global loading screen + Suspense fallback |
| `src/features/wishes/components/wishes.jsx` | Replace wishes list loading indicator |

## Dependencies

No new dependencies. Uses:
- `framer-motion` (already installed)
- Tailwind CSS (already configured)
- Playfair Display font (already configured as `font-serif`)

## UX Considerations

- **Perceived performance**: The animation entrance (0.3s delay) creates intentional pacing — the screen never feels "stuck" because motion begins immediately
- **Minimum display time**: No artificial delay needed; the animation naturally fills the 1-3s load window
- **Exit smoothness**: Slide-up exit prevents the jarring "flash" of content replacing loader
- **Accessibility**: The word "PREPARING" communicates state to screen readers. Add `role="status"` and `aria-label="Loading invitation"` to the loading container so assistive tech announces the state without reading the decorative text literally
- **Consistency**: Same design language (rose line) used for both global and section-level loading, at different intensities
