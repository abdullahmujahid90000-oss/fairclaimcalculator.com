"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Lazy-loaded, client-only: three.js/R3F never ship in the server bundle
// and never block first paint. `loading` renders nothing while the chunk
// fetches — the static gradient behind it (rendered by the parent) covers
// that gap so there's no flash of empty space.
const HeroScene = dynamic(() => import("./hero-scene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => null,
});

/** Pure-CSS stand-in: used under `prefers-reduced-motion` and as the visual base beneath the WebGL layer while it loads. */
function StaticGradientBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/4 top-[-4rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute right-[-6rem] top-1/3 h-[28rem] w-[28rem] rounded-full bg-accent-muted/20 blur-[120px]" />
      <div className="absolute bottom-[-8rem] left-1/3 h-[24rem] w-[24rem] rounded-full bg-accent/10 blur-[120px]" />
    </div>
  );
}

/**
 * Hero background layer: static gradient always renders first (instant,
 * zero JS), WebGL orbs fade in on top once the chunk loads. Skips WebGL
 * entirely under `prefers-reduced-motion` — the static gradient is the
 * whole background in that case, no canvas is mounted at all.
 */
export function HeroBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 -z-10 select-none">
      <StaticGradientBackdrop />
      {!reducedMotion && (
        <Suspense fallback={null}>
          <div className="pointer-events-none absolute inset-0">
            <HeroScene />
          </div>
        </Suspense>
      )}
      {/* Fade the scene into the page background so text stays fully readable. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}
