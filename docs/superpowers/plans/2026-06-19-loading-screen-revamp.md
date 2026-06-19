# Loading Screen UI Revamp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace utilitarian "Memuat undangan..." loading screens with a premium typographic "PREPARING" animation + slide-up exit.

**Architecture:** Two files modified — `src/app.jsx` (global loading + Suspense fallback) and `src/features/wishes/components/wishes.jsx` (section-level loader). All animations use existing Framer Motion. No new dependencies.

**Tech Stack:** React 18, Framer Motion, Tailwind CSS, Playfair Display font (already configured as `font-serif`)

**Spec:** `docs/superpowers/specs/2026-06-19-loading-screen-revamp-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/app.jsx` | Modify | Global loading screen + Suspense fallback |
| `src/features/wishes/components/wishes.jsx` | Modify | Section-level wishes loading indicator |

---

### Task 1: Revamp global loading screen in `src/app.jsx`

**Files:**
- Modify: `src/app.jsx` (lines 17-90)

- [ ] **Step 1: Remove Heart import, add motion import adjustment**

In `src/app.jsx`, the `Heart` import from `lucide-react` (line 21) is only used in the loading/suspense states. Remove it.

Current line 21:
```jsx
import { Heart } from "lucide-react";
```

Delete this line entirely. The `Heart` icon is not used anywhere else in `app.jsx`.

Verify the remaining imports are:
```jsx
import { useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useInvitation } from "@/features/invitation";
import { useAudio } from "@/hooks/use-audio";
import staticConfig from "@/config/config";
import { useMotionPreset } from "@/lib/motion";
```

- [ ] **Step 2: Replace the loading state block (lines 78-90)**

Replace the current loading block:
```jsx
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <Heart
            className="h-12 w-12 text-rose-500 mx-auto mb-4 animate-pulse"
            fill="currentColor"
          />
          <p className="text-gray-600">Memuat undangan...</p>
        </div>
      </div>
    );
  }
```

With:
```jsx
  // Show loading state
  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf9f7]"
        role="status"
        aria-label="Loading invitation"
      >
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="font-serif text-xs text-gray-400 tracking-[6px] uppercase"
          >
            Preparing
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 44 }}
            transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
            className="h-px bg-rose-600 mx-auto mt-4"
          />
        </div>
      </div>
    );
  }
```

- [ ] **Step 3: Replace the Suspense fallback (lines 150-161)**

Replace the current Suspense fallback:
```jsx
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
            <div className="text-center">
              <Heart
                className="h-12 w-12 text-rose-500 mx-auto mb-4 animate-pulse"
                fill="currentColor"
              />
              <p className="text-gray-600">Memuat...</p>
            </div>
          </div>
        }
      >
```

With:
```jsx
      <Suspense
        fallback={
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf9f7]"
            role="status"
            aria-label="Loading"
          >
            <div className="text-center">
              <p className="font-serif text-xs text-gray-400 tracking-[6px] uppercase">
                Preparing
              </p>
              <div className="h-px w-[44px] bg-rose-600 mx-auto mt-4" />
            </div>
          </div>
        }
      >
```

Note: The Suspense fallback uses plain elements (no `motion`) because Framer Motion may not be loaded yet during Suspense.

- [ ] **Step 4: Verify the app runs without errors**

Run: `npm run dev`

Open the browser. The loading screen should show "PREPARING" in serif font with a rose line beneath on a warm off-white background. Verify:
- No Heart icon visible
- No "Memuat undangan..." text
- Text is centered, uppercase, with wide letter-spacing
- Rose line appears below text
- Background is warm off-white (#faf9f7)

- [ ] **Step 5: Commit**

```bash
git add src/app.jsx
git commit -m "feat: revamp global loading screen with premium typography design

Replace Heart icon + 'Memuat undangan...' with minimal 'PREPARING' text
animation on warm off-white background. Uses serif font, rose accent line,
and fade-up entrance animation."
```

---

### Task 2: Add slide-up exit transition to loading screen

**Files:**
- Modify: `src/app.jsx`

- [ ] **Step 1: Wrap the loading state in AnimatePresence with exit animation**

The current loading block uses an early `return` with `if (isLoading)`. To enable Framer Motion exit animations, we need to restructure so that `AnimatePresence` can track when the loading screen unmounts.

Replace the entire loading block (the one we wrote in Task 1) AND the error block structure. The loading screen should be rendered as an overlay on top of the main content, not as an early return, so `AnimatePresence` can animate its exit.

Remove the early return `if (isLoading)` block entirely (lines ~78-90 after Task 1 edits).

Then, right after the opening `<HelmetProvider>` tag and the `<Helmet>...</Helmet>` block, add the loading overlay inside the return statement — just before `<Suspense>`:

```jsx
      {/* Loading overlay with exit animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-screen"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf9f7]"
            role="status"
            aria-label="Loading invitation"
          >
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                className="font-serif text-xs text-gray-400 tracking-[6px] uppercase"
              >
                Preparing
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

Keep the error early return as-is (lines 92-108 in original). The error state doesn't need animation.

The final structure of the return in `App()` should be:

```jsx
  // Show error state (keep as early return — no animation needed)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        ...error content unchanged...
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        ...meta tags unchanged...
      </Helmet>

      {/* Loading overlay with exit animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div key="loading-screen" ...>
            ...PREPARING content...
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={...}>
        <AnimatePresence mode="wait">
          ...landing/main content unchanged...
        </AnimatePresence>
      </Suspense>
    </HelmetProvider>
  );
```

- [ ] **Step 2: Test the exit transition**

Run: `npm run dev`

Test by throttling network in DevTools (Slow 3G) to extend loading time. When data arrives:
- Loading screen should slide upward while fading out (500ms)
- Content should be visible underneath as loading slides away
- No flash of white/blank between loading and content

- [ ] **Step 3: Commit**

```bash
git add src/app.jsx
git commit -m "feat: add slide-up exit transition to loading screen

Move loading screen from early return to AnimatePresence overlay
so Framer Motion can animate the exit. Screen slides up and fades
when data finishes loading."
```

---

### Task 3: Revamp wishes section loading indicator

**Files:**
- Modify: `src/features/wishes/components/wishes.jsx` (lines 14, 221-226)

- [ ] **Step 1: Remove Loader2 from imports if no longer needed elsewhere**

Check `wishes.jsx` — `Loader2` is used in two places:
1. Line 223: Wishes list loading spinner
2. Line 625: Submit button loading spinner

Since `Loader2` is still used in the submit button (line 625), keep the import. Only change the wishes list loading UI.

- [ ] **Step 2: Replace wishes list loading indicator (lines 221-226)**

Replace:
```jsx
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                <span className="ml-3 text-gray-600">Memuat pesan...</span>
              </div>
            )}
```

With:
```jsx
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 44 }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="h-px bg-rose-600"
                />
              </div>
            )}
```

This replaces the spinning icon + text with a minimal pulsing rose line that matches the global loading screen's design language.

- [ ] **Step 3: Test the wishes loading indicator**

Run: `npm run dev`

Open the invitation, scroll to the wishes section. If on slow network:
- Should see a thin rose line that animates width 0→44px→0 in a loop
- No spinning icon, no "Memuat pesan..." text
- Line should be centered with vertical padding

- [ ] **Step 4: Commit**

```bash
git add src/features/wishes/components/wishes.jsx
git commit -m "feat: replace wishes loading spinner with minimal rose line

Swap Loader2 spinner + 'Memuat pesan...' text for an animated rose
line that matches the new premium loading screen design language."
```

---

### Task 4: Final verification

- [ ] **Step 1: Full flow test**

Run: `npm run dev`

Test the complete flow:
1. Open app — should see "PREPARING" on warm off-white
2. When data loads — loading screen slides up, content appears beneath
3. Click "Buka Undangan" — landing page transitions normally
4. Scroll to wishes — section loader uses rose line (if still loading)
5. No console errors

- [ ] **Step 2: Test error state**

Test with an invalid invitation UID:
- Error screen should still work unchanged
- No regressions in error display

- [ ] **Step 3: Mobile responsive check**

Test in mobile viewport (375px width):
- "PREPARING" text + line centered properly
- Loading screen fills viewport
- Exit animation smooth on mobile

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: loading screen polish and edge case fixes"
```
