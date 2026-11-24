# Rebuild Plan — "Editorial Developer" Portfolio Template

> Reference studied: `https://www.adrienquechon.com/` (Nuxt 3 + Prismic + GSAP + Lenis + Three.js).
> Goal: an **original, reusable portfolio template** that keeps the *feel* (editorial type, fog/ink themes, fluid WebGL, binary loader) with 100% placeholder copy and assets.
> Nothing proprietary is copied: no PP Editorial Old / PP Playground fonts, no Prismic media, no personal copy.

---

## 0. What was inspected

| Item | Evidence |
| --- | --- |
| Desktop 1440×900 + mobile 390×844 | `ref/desktop-*.png`, `ref/mobile-*.png`, full-page captures |
| Loader frames | `ref/loader-desktop-1.png`, `-2.png`, `loader-desktop.html` |
| Hover / folder / theme states | `ref/desktop-work-hover.png`, `ref/desktop-folder-open.png`, `ref/mobile-toggle-after.png` |
| Computed CSS + tokens | `ref/desktop-data.json`, `ref/mobile-data.json`, `ref/site.css` |
| Theme switch internals | `ref/toggle.json` (`header[mode]` `0 → 1`, html bg `#4E4E4E → #000`) |
| Canvas / assets | 1 fixed full-viewport canvas, `z-index:-1`; only 2 `<img>` (smile + logo) |

The site is **not** a light-mode site with a dark toggle. It is **fog-first**:

- `mode 0` → soft grey fog backdrop, white type, no fluid (calm "light" state)
- `mode 1` → pure black, white type, full fluid WebGL (the "dark" state)
- The switch is a pill toggle, **only rendered on touch devices** (`(hover:none) and (pointer:coarse)`). On desktop the mode is inferred/auto.

---

## 1. Visual System & Theme

### 1.1 Colour tokens (extracted)

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#000000` | dark theme base |
| `--paper` | `#FFFFFF` | type, strokes, toggle knob |
| `--fog-0` | `#414141` | fog gradient edge |
| `--fog-1` | `#4E4E4E` | fog base / CSS fallback |
| `--fog-2` | `#595959` | fog gradient centre |
| `--fog-live` | `#5E5E5E → #979797` | actual rendered WebGL fog (sampled) |
| `--hairline` | `#D2D2D2` | work-row top borders |
| `--hairline-2` | `#D7D7D7` | progress rail + fill |
| `--muted` | `#676767` | toggle track |
| `--veil` | `rgba(0,0,0,.70)` | loader overlay fade |

CSS backdrop (the graceful no-WebGL fallback):

```css
background-color: #4e4e4e;
background-image:
  linear-gradient(#0000, #0000),
  linear-gradient(to right,
    #414141 0%, #494949 10%, #4e4e4e 20%, #555 30%,
    #585858 40%, #595959 50%, #585858 60%, #555 70%,
    #4e4e4e 80%, #494949 90%, #414141 100%);
```

Template palette addition (documented, optional): a single accent for focus rings `#C8FF4D`, used only on `:focus-visible`, never in the composition.

### 1.2 Typography

Original fonts (commercial — **do not ship**):

- `PP Editorial Old Ultralight` — display serif, all caps
- `PP Playground Light` — playful alternate glyphs (the swash `W` / `E`)
- `Sometype Mono 400/600/700` — UI, meta, labels

Free replacements (OFL):

- **Instrument Serif** → display (`--font-display`)
- **Fraunces** (variable, `WONK` + `SOFT` axes) → accent glyphs (`--font-accent`)
- **Sometype Mono** (same family, OFL on Google Fonts) → mono (`--font-mono`)
- Fallbacks: `Georgia, "Times New Roman", serif` / `ui-monospace, monospace`

Rules: display is always `text-transform: uppercase`, `font-weight: 400`, tracking `0.03em`, line-height `0.85`. Mono is uppercase for labels, sentence case for body. No bold display.

### 1.3 Type scale (exact, `svw` = small-viewport width)

| Token | Mobile (base) | Tablet `≥768 & AR≥3/5` | Desktop `≥1200` | LH / LS |
| --- | --- | --- | --- | --- |
| `text-xxl` (hero) | 14.92svw | 12svw | 7.52svw | .85 / .03em |
| `text-xl` (footer) | 20.94svw | 8.2svw | 4.86svw | .85 / .03em |
| `text-l` (about) | 7.46svw | 3.9svw | 2.31svw | 1.2 / .03em |
| `text-ml` (work titles) | — | max(20px, 2.44svw) | — | 1 / .03em |
| `text-m` (work) | 6.23svw | max(15px, 1.95svw) | max(20px, 1.56svw) | 1 / .03em |
| `text-ms` | 4.47svw | max(15px, 1.75svw) | max(15px, 1.04svw) | 1 / 0 |
| `text-mxs` | 3.99svw | max(14px, 1.56svw) | max(15px, .92svw) | 1 / 0 |
| `text-s` | 3.74svw | max(13px, 1.46svw) | max(15px, .86svw) | 1 / 0 |
| `text-xs` (UI) | 3.48svw | max(13px, 1.36svw) | max(14px, .81svw) | 1 / 0 |
| `text-xxs` (meta) | 2.98svw | max(12px, 1.17svw) | max(12px, .69svw) | 1 / 0 |
| `loader-l` | 8.72svw | 5.85svw | 3.47svw | .85 / 0 |
| `loader-s` | 2.74svw | max(11px, 1.07svw) | max(11px, .63svw) | 1 / .03em |

Reference measurements @1440: h1 `108.29px/92.04px`; about `33.26px/39.92px`; footer `69.98px/59.49px`.
@390: h1 `58.19px/49.46px`; about `29.09px/34.91px`; footer `81.67px/69.42px`.

### 1.4 Grid, spacing, borders

- `--grid-margin: 24px` at **all** breakpoints (page gutter, header, footer).
- `--grid-gutter: 10px` mobile → `24px` tablet/desktop; `--grid-gutter-half: 12px`.
- **120-column** fractions on desktop: `w-4/12`, `w-25/120`, `w-35/120`, `w-85/120`, `w-2/12`.
- Section rhythm: hero `100svh`; about A `min-h-100svh pt-25svh pb-15.55svh`; interlude auto (~210px); about B `min-h-100svh pt-33.4svh`; work `pt-22.22svh`; footer `min-h-100svh pb-24px`.
- Borders: `1px solid` only. Work rows `border-top: #D2D2D2` + last row bottom. Buttons `1px solid #fff`, padding `0.58em`. Progress rail `1px #D7D7D7`, fill `#D7D7D7`.
- Radii: **0px** everywhere except the theme pill (`999px`) and the toggle knob.
- Corner brackets: 12×12px, 1px white, `top-left`/`bottom-right` of the hero.

### 1.5 Theme switch (the "smooth page transition")

- State lives on `<html data-theme="fog|ink">`; `header[mode]` is replaced by this attribute.
- Fog → Ink: radial reveal from the toggle position (`clip-path: circle(0% at x y)` → `150%`), 900ms `expo.inOut`, while the WebGL uniform `uTheme` lerps 0→1.
- Ink → Fog: reverse, with a 120ms white flash overlay at 8% opacity (the "page blink").
- Persist in `localStorage`, default to `fog`, respect `prefers-color-scheme` on first visit, and honour `prefers-reduced-motion` (instant crossfade).

---

## 2. DOM Architecture (as found → template)

```
body
└─ .lenis
   ├─ header#main-header (fixed, z-100, 24px padding)
   │  ├─ progress rail + %  (left, 27svw → 15svw)
   │  ├─ ThemeSwitch (centre, touch only)
   │  └─ nav: LinkedIn ↗ · Awwwards ↗ · CONTACT [boxed]
   ├─ main
   │  ├─ section#hero (100svh, flex col, space-between)
   │  │  ├─ h1 (3 lines, accent glyph span)
   │  │  ├─ meta strip: (FREE)LANCE · location+time · ■ NAME · studio
   │  │  ├─ corner brackets L / ⌐
   │  │  └─ bottom row: ↓ + statement | sound + grid + studio link
   │  ├─ section.about-intro (min-h-100svh, centred 8/12 col)
   │  │  └─ p ×3 with inline pictograms + mono side notes
   │  ├─ section.interlude (mono paragraph, 3 columns of spaced text)
   │  ├─ section.about-studio (min-h-100svh)
   │  │  ├─ ConfidentialCard (folder, dashed?) — easter egg
   │  │  └─ p ×1 large + [LET'S TALK] + "pixel by pixel" note
   │  ├─ section.work
   │  │  ├─ header row: Selected work | Awwwards | CSSDA | FWA
   │  │  └─ 6 × WorkRow (title+year | 3 award cols | See live ↗)
   │  └─ section.footer (min-h-100svh)
   │     ├─ giant "Thank you & see you soon!"
   │     ├─ binary + mono decorations
   │     └─ bottom grid: back-to-top | CTA | email | site | location | credits
   └─ overlays: Preloader · CustomCursor · NoiseOverlay · ThemeWipe
```

Notes:
- Every display line is split into **per-character `<div>`s** (GSAP SplitText) — this powers the staggered mask reveals.
- Work rows carry `data-project` + `data-index`; the WebGL layer reads the row rect on hover.
- The canvas lives in `div.fixed.-z-1` (behind content) and never intercepts pointer events (`pointer-events:none`).

---

## 3. Signature Components — Specs

### 3.1 Binary preloader
- Full-screen `#000` with `rgba(0,0,0,.7)` fade layer, z-100000.
- Centre stack: mono binary fragments absolutely positioned around a serif `LOADING` (`loader-l`).
- Fixed strings: `Bonjour/`, `Nice to meet U`, `‹HI/›`, `100 00010`, plus 6 randomly revealed binary groups.
- Bottom: `%` label that **travels with the bar**, full-width 1px rail, white fill `scaleX(0→1)`.
- Timing: eased counter (0→100 in 2.2–2.8s, `power2.inOut`), hold 220ms at 100, then the whole overlay wipes up with `clip-path` while the binary groups scatter (`y:-40, opacity:0`, stagger 0.02).
- Skip when `prefers-reduced-motion` (200ms fade) or when `sessionStorage.preloaded=1` (300ms).

### 3.2 Type-led hero
- Line 1 `CREATIVE`, line 2 `WEB DEVELOPER` (accent glyph replaces the `W` via Fraunces `WONK`), line 3 optional.
- Intro: each line `y:110% → 0`, `clip-path` inset, 0.9s `expo.out`, stagger 0.08 after loader.
- Meta strip (`text-xxs`, mono): availability / local time (live, `Intl.DateTimeFormat`) / name badge (white square) / studio.
- **Status ticker (requested, not on the reference)**: replaces the studio slot on mobile and sits under the meta strip on desktop. Rotating lines with a vertical mask: `IN MY EARS — <track> — <artist>`, `AVAILABLE FOR Q1`, `BASED IN <city>`, `SCROLL TO EXPLORE`. 3.6s interval, 500ms slide, pause on hover, `aria-live="polite"`.
- Corner brackets, scroll cue (arrow box), sound toggle, grid toggle (opens a 12-col overlay), studio link.

### 3.3 Theme switch
- Pill 36×17, track `#676767`, knob 10px white, 220ms spring.
- On toggle: `document.startViewTransition` when available, else the clip-path wipe + WebGL `uTheme` lerp.
- `aria-pressed`, `aria-label="Switch to dark theme"`, keyboard `Enter/Space`.
- Desktop gets a tiny `◐` icon button in the header (instead of hiding the feature).

### 3.4 Selected Work list
- 6 rows, `border-top: 1px #D2D2D2`, last row `border-bottom`, `padding-block: .675em` (desktop) / `1em` (mobile).
- Columns: title + `./year` (35/120) | award 1 (25/120) | award 2 | award 3 | `SEE LIVE ↗` right.
- Title: `text-ml → text-l` on desktop, per-char hover slide (original + injected child at `translateY(10%)`).
- **Hover reveal**: the row's project image is drawn by WebGL as a displaced band exactly over the row rect (`uRowY`, `uRowH`, `uHover 0→1`), with fBm refraction and a 6% chromatic split. On mobile: tap opens a full-bleed preview sheet.
- **Stacked badge pills (requested, not on reference)**: `NEXT.JS` `WEBGL` `GSAP` tags, 1px white/40% border, 999px radius, `text-xxs`, revealed on row hover on desktop and always visible on mobile. Award columns collapse into these pills below 768px.
- Custom cursor becomes `CLICK` over rows, `DRAG` over the canvas.

### 3.5 Playful About
- Large serif paragraphs with inline **pictograms** (smiley, paper plane, hand) as 1em inline SVGs.
- Mono side notes (`./SINCE 2019`, `— THAT MAKE EACH PROJECT STAND OUT.`) absolutely positioned, 70% opacity.
- **Scramble/decrypt**: on enter, random glyphs resolve to final text over 900ms (`&NBSP;` artefacts intentionally echoed).
- **ConfidentialCard**: `CONFIDENTIAL/2026 — DO_NOT_OPEN`, folder icon, 1px border. Click #1 → label glitches, card shakes, text becomes `DIDN'T YOU READ THE LABEL? ONE TIME, I'LL LET IT SLIDE.` Click #2 → card flips, reveals a generic "secret": a mono ASCII doodle + `OK, YOU ASKED.` + confetti of binary. Click #3 → resets. Keyboard + `aria-expanded`.
- Optional second egg: the `LOG` chip in the header opens a tiny "build log" drawer (mono changelog).

### 3.6 Footer
- Giant `THANK YOU & SEE YOU SOON!` (`text-xl`), accent glyph on one `E`.
- Binary + `WEB DEVELOPMENT 1 0` mono decorations around it, 70% opacity.
- Bottom grid: back-to-top box (arrow, smooth Lenis `scrollTo(0)`), CTA block, `{ email }`, site link, live location/time, credits `© 2026`.
- **Marquee (requested)**: a thin 1px-bordered strip above the bottom grid, mono `AVAILABLE FOR FREELANCE — SAY HELLO — ` repeating, 28s linear, pauses on hover, duplicated track for a seamless loop.

### 3.7 Custom cursor
- 8px dot (mix-blend `difference`), 0.12s lerp follow; grows to a 64px ring on links.
- Label swap via `data-cursor` attribute (`CLICK`, `DRAG`, `OPEN`, `PLAY`).
- Hidden on touch and when `(hover:none)`.

---

## 4. Motion & WebGL Plan

### 4.1 Smooth scroll
- **Lenis** on `window`, `lerp: 0.09`, `wheelMultiplier: 1`, `touchMultiplier: 1.4`, `smoothWheel: true`.
- Drive from the GSAP ticker (`lenis.raf(time)`), `ScrollTrigger.update()` on scroll.
- `ScrollTrigger.config({ ignoreMobileResize: true })`; anchor links use `lenis.scrollTo(target, { offset: -24 })`.
- Disable Lenis for `prefers-reduced-motion` and on `(hover:none)` (native momentum feels better).

### 4.2 Scroll choreography
| Element | Trigger | Animation |
| --- | --- | --- |
| Hero lines | on load | `y 110%→0`, clip, stagger .08 |
| Hero meta | on load +.4s | fade/`y 8px`, stagger .04 |
| About paragraphs | `top 80%` | line mask reveal, stagger .05 |
| Pictograms | `top 85%` | scale .6→1, rotate -12→0, `back.out(2)` |
| Work header | `top 85%` | chars fade up |
| Work rows | `top 92%` | `y 100%→0` + `clip-path inset(0 0 100%→0)`, stagger .06 |
| Interlude | scrub | `y -40 → 40` (parallax) |
| Footer title | `top 80%` | char stagger, .02 |
| Progress rail | scroll | `scaleX` 0→1 + `%` counter |

All triggers use `once: true` except the progress rail and parallax.

### 4.3 WebGL (Three.js, raw — no R3F)
Two layers in one renderer:

1. **Fluid fog** (full-screen triangle)
   - Cheap path (default): 4-octave fBm domain-warp smoke, `uTime`, `uPointer` (smoothed), `uScrollVel`, `uTheme`.
   - Ink theme: black base, smoke luminance `0.0–0.09`, white-ish filaments.
   - Fog theme: radial `#9A9A9A → #5E5E5E` + grain, smoke nearly invisible.
   - Optional "high" path: real stable-fluids sim (velocity/dye ping-pong FBOs, 20 Jacobi iterations) at 0.5 res — behind a `quality` flag in `lib/webgl/quality.ts`.
2. **Hover band** (single quad, 1 draw call)
   - Positioned to the hovered row's rect; texture = placeholder project JPG.
   - Displacement: fBm + `uHover` + row-local `uv` mask; RGB split 0.006; `uScrollVel` adds a horizontal smear.
   - Fades out over 400ms when the pointer leaves.

Perf budget: DPR `min(devicePixelRatio, 1.5)`, render paused when `document.hidden` or canvas off-screen, `ResizeObserver` debounce, `powerPreference: "high-performance"`, context-loss fallback to the CSS fog gradient. Target 60fps on M1 / mid-range Android; degrade to 0.75 DPR + 3 octaves if frame time > 22ms for 2s.

Noise/grain: one 256×256 tiled PNG (or procedural hash in shader) at 4% opacity, `mix-blend-mode: overlay`.

---

## 5. Template Content (all placeholder)

```
BRAND      "YOUR NAME"            → display: "YOUR / NAME" (accent glyph)
ROLE       CREATIVE DEVELOPER
STUDIO     "STUDIO NORTH" (fictional)
LOCATION   "BASED IN LISBON"  ·  live clock
EMAIL      hello@yourname.dev
SOCIALS    LinkedIn · GitHub · X  (generic hrefs)
PROJECTS   NORTHWIND ./2026   [NEXT.JS, WEBGL, GSAP]
           HALFTONE  ./2025   [THREE.JS, GLSL]
           ATLAS     ./2025   [NUXT, LENIS]
           SIGNAL    ./2024   [WEBGL, MOTION]
           ORBITAL   ./2023   [CANVAS, SHADERS]
           FIELD NOTES ./2022 [EDITORIAL, CMS]
AWARDS     SITE OF THE DAY · DEVELOPER AWARD · HONORABLE MENTION (generic)
COPY       "I build smooth, interactive and memorable web experiences…"
```

Work images: 6 generated 1600×1000 abstract gradients (noise + duotone) stored in `public/work/`. No photos, no client work.

---

## 6. File Structure

```
portfolio-template/
├─ app/
│  ├─ layout.tsx                 # fonts, metadata, ThemeProvider, Cursor, SmoothScroll
│  ├─ page.tsx                   # composes Preloader + Header + sections + Footer
│  ├─ globals.css                # @import tailwind, @theme tokens, base, utilities
│  └─ opengraph-image.tsx        # static OG card
├─ components/
│  ├─ layout/
│  │  ├─ Header.tsx
│  │  ├─ ProgressRail.tsx
│  │  ├─ Footer.tsx
│  │  └─ CornerFrame.tsx
│  ├─ preloader/
│  │  ├─ Preloader.tsx
│  │  └─ BinaryField.tsx
│  ├─ hero/
│  │  ├─ Hero.tsx
│  │  ├─ HeroType.tsx
│  │  ├─ MetaStrip.tsx
│  │  ├─ StatusTicker.tsx
│  │  └─ HeroActions.tsx
│  ├─ about/
│  │  ├─ AboutIntro.tsx
│  │  ├─ Interlude.tsx
│  │  ├─ AboutStudio.tsx
│  │  ├─ ConfidentialCard.tsx
│  │  └─ InlinePictogram.tsx
│  ├─ work/
│  │  ├─ WorkList.tsx
│  │  ├─ WorkRow.tsx
│  │  ├─ AwardCell.tsx
│  │  ├─ TagPills.tsx
│  │  └─ WorkMobileSheet.tsx
│  ├─ ui/
│  │  ├─ ThemeSwitch.tsx
│  │  ├─ ThemeWipe.tsx
│  │  ├─ CustomCursor.tsx
│  │  ├─ MagneticLink.tsx
│  │  ├─ Marquee.tsx
│  │  ├─ ScrambleText.tsx
│  │  ├─ SplitReveal.tsx
│  │  ├─ ArrowIcon.tsx
│  │  └─ NoiseOverlay.tsx
│  └─ webgl/
│     ├─ WebGLStage.tsx          # canvas host, lifecycle, resize, visibility
│     ├─ FogScene.ts
│     ├─ HoverBand.ts
│     ├─ shaders/fog.vert.ts
│     ├─ shaders/fog.frag.ts
│     ├─ shaders/band.vert.ts
│     ├─ shaders/band.frag.ts
│     └─ quality.ts
├─ lib/
│  ├─ content.ts                 # single source of truth for all copy/projects
│  ├─ gsap.ts                    # plugin registration (ScrollTrigger, SplitText)
│  ├─ useLenis.ts
│  ├─ theme.tsx                  # context + persistence + wipe trigger
│  ├─ cursor.tsx
│  ├─ useMediaQuery.ts
│  ├─ useReducedMotion.ts
│  └─ utils.ts                   # cn(), clamp, lerp, formatters
├─ public/
│  ├─ fonts/                     # InstrumentSerif, Fraunces, SometypeMono (woff2)
│  ├─ work/                      # 6 placeholder images
│  ├─ grain.png
│  └─ favicon.svg
├─ scripts/
│  └─ gen-placeholders.mjs       # optional: regenerate abstract work images
├─ next.config.ts
├─ postcss.config.mjs
├─ tsconfig.json
├─ eslint.config.mjs
├─ package.json
├─ README.md
└─ PLAN.md
```

---

## 7. Build Plan (phases, in order)

**Phase 0 — Scaffold (30 min)**
1. `npm create next-app@latest portfolio-template --ts --tailwind --app --eslint --src-dir=false`
2. Install: `gsap lenis three clsx tailwind-merge` + `-D @types/three`.
3. `globals.css`: `@import "tailwindcss";` + `@theme` tokens (colours, type scale, breakpoints `tab`/`desktop`/`touchable`).
4. Fonts via `next/font/local` (3 families, `display: swap`, preload the display cut only).

**Phase 1 — Static shell (2–3 h)**
5. `content.ts` with all placeholder copy.
6. Header + progress rail + theme pill + contact box.
7. Hero markup + type scale + meta strip + corner brackets + bottom row.
8. About / interlude / studio / confidential card.
9. Work list with real 120-col layout + pills.
10. Footer + marquee.
11. Responsive pass at 390 / 768 / 1024 / 1440 / 1920.

**Phase 2 — Theme system (1–2 h)**
12. `data-theme` on `<html>`, CSS var swap, 600ms transitions.
13. View-transition/clip-path wipe from the toggle, persistence, system default, reduced motion.
14. Verify contrast + no flash on first paint (`next-themes`-style inline script).

**Phase 3 — Motion (3–4 h)**
15. Lenis + GSAP ticker wiring, anchor scroll, cleanup on unmount.
16. SplitText reveal primitive (`SplitReveal`) reused by hero/about/work/footer.
17. ScrollTrigger passes: hero intro, about, rows, footer, parallax, progress.
18. ScrambleText + per-char hover slide + magnetic links.
19. Custom cursor with `data-cursor` labels.

**Phase 4 — Preloader (2 h)**
20. Binary field generator (seeded, no layout shift), counter, progress rail, exit wipe.
21. Gate the hero intro on preloader completion; session skip; reduced-motion path.

**Phase 5 — WebGL (4–6 h)**
22. `WebGLStage` lifecycle: renderer, DPR clamp, resize, visibility, context loss, fallback.
23. Fog shader (fBm warp + pointer + scroll velocity + theme mix + grain).
24. HoverBand quad bound to row rects, displacement + RGB split, smooth in/out.
25. Mobile: disable band, reduce octaves, cap DPR at 1.
26. Perf instrumentation: frame-time watchdog + auto quality downgrade.

**Phase 6 — Polish (2–3 h)**
27. Focus states, skip link, `aria` on toggles/rows/loader, semantic headings.
28. Reduced-motion + keyboard-only passes.
29. Lighthouse (target ≥95 a11y/SEO, ≥85 perf), CLS check, font subsetting.
30. README with tokens, component map, how to replace content.

**Total:** ~14–20 h for full fidelity; a shippable v1 (phases 0–4) in ~8 h.

---

## 8. What to install

Already present: **Node 24.22**, **npm 11.19**, **git 2.56**, **Chrome**, **playwright-core** (in `ref/` for QA).

Nothing else is *required*. Recommended:

```powershell
corepack enable          # optional: pnpm 10, faster + stricter installs
npm i -g vercel          # optional: deploy
```

Project dependencies (installed by the scaffold):

```powershell
npm i gsap lenis three clsx tailwind-merge
npm i -D @types/three
```

Optional: `sharp` (image optimisation), `@tailwindcss/typography` (not needed), `vite-plugin-glsl` only if we choose Vite instead of Next.

---

## 9. Decisions to confirm

1. **Framework**: Next.js 15 (recommended: SEO + static export) or Vite + React (lighter, no SSR friction).
2. **Theme naming**: keep the fog/ink duality (grey calm ↔ black fluid) or invert to a true light/dark?
3. **Additions not in the reference**: status ticker, badge pills, footer marquee, sound toggle (fake/ambient?), grid overlay — include all or trim?
4. **Project media**: generated abstract gradients (safe) or CSS-only animated thumbnails (zero assets)?
5. **Scope of v1**: full WebGL fluid sim, or the cheaper fog shader first with the sim behind a flag?
