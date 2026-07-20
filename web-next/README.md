# FairClaimCalculator — Next.js marketing rebuild

A new animated marketing front-end, built separately from the live static
site at the repo root. Nothing here touches `index.html`, `about.html`, etc.
— this is a standalone Next.js app you can develop, review, and deploy on
its own timeline.

## Stack

Next.js 16 (App Router, TS) · Tailwind CSS 3 · Framer Motion · GSAP +
ScrollTrigger · Lenis (smooth scroll) · React Three Fiber + drei (WebGL hero
background) · lucide-react icons.

## Getting started

```bash
cd web-next
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build + type check
npm run lint     # eslint
```

## Structure

```
src/
  app/
    layout.tsx        # fonts, metadata, mounts Navbar/Footer/SmoothScrollProvider
    page.tsx           # homepage: Hero, HowItWorks, Tools, Principles, Cta
    globals.css         # design tokens (CSS vars) + base styles
  components/
    layout/            # Navbar (sticky, blur-on-scroll), Footer
    sections/           # Hero, HowItWorks, Tools, Principles, Cta
    ui/                  # Button, Card, Badge — built on the design tokens
    motion/              # SmoothScrollProvider (Lenis+GSAP), Reveal (scroll-in)
    three/                # HeroScene (R3F canvas), HeroBackground (lazy loader)
  hooks/
    use-reduced-motion.ts
  lib/
    utils.ts             # `cn()` class merge helper
tailwind.config.ts       # design tokens: background, foreground, surface, accent, muted, border
```

## Design tokens

Everything colored routes through five HSL CSS variables defined in
`src/app/globals.css` (`:root` = dark, the shipped default; `.light` =
light, wired but not switched on yet): `--background`, `--foreground`,
`--surface`, `--accent`, `--muted`, `--border`. `tailwind.config.ts` maps
each to a Tailwind color (`bg-accent`, `text-muted-foreground`, `border-border`,
etc.) — don't hardcode hex/rgb colors in components, extend the token set
instead.

## Motion notes

- **Framer Motion** handles component-level interaction: button/card
  press-and-hover (spring easing, ~150–250ms), the mobile nav menu, and the
  hero's on-load stagger.
- **GSAP ScrollTrigger** (via the `<Reveal>` wrapper) handles below-the-fold
  scroll-in reveals, with optional stagger across a section's direct
  children.
- **Lenis** drives smooth scrolling and is kept in sync with ScrollTrigger
  by `SmoothScrollProvider` (mounted once in the root layout).
- Everything motion-related checks `prefers-reduced-motion` via
  `useReducedMotion()` (a `useSyncExternalStore` hook) and no-ops when it's
  set — including skipping the WebGL canvas entirely.

## WebGL hero background

`HeroBackground` always renders a pure-CSS gradient first, then lazy-loads
`HeroScene` (the actual R3F `<Canvas>`) behind `next/dynamic({ ssr: false })`
and a `Suspense` boundary — the 3D scene is never in the initial JS bundle
or the server-rendered HTML. It's skipped entirely under reduced-motion.

## What's still placeholder

- Copy is real (drawn from the current site's actual tools and compliance
  language) but hasn't been through the same review pass as
  `CONTENT-STANDARDS.md`. Give it a pass before shipping.
- `/about`, `/contact`, `/privacy-policy`, etc. aren't built yet as Next.js
  routes — the nav/footer link to them by path, but only `/` exists so far.
- Light theme tokens are defined in CSS but there's no toggle UI yet.
